<template lang="">
    <section>
        <!-- ENCABEZADO -->
        <header-component></header-component>
        <!-- Formulario para transferir dinero -->
        <article class="card">
            <div class="card-header">
                <div>
                    <RouterLink to="/home"><font-awesome-icon icon="fa-solid fa-arrow-left" /></RouterLink>
                </div>
                <br>
                <h1>Enviar dinero</h1>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="">Teléfono</label>
                    <input type="text" v-model="transferencia.telefono" @input="limitarTelefono">
                </div>
                <div class="form-group">
                    <label for="">Valor</label>
                    <input type="text" v-model="transferencia.valor" @input="limitarValor">
                </div>
                <div class="form-group">
                    <button class="success" @click="enviar">Enviar</button>
                </div>
            </div>
        </article>
    </section>
</template>
<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import { reactive, onMounted, inject } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

export default {
    components: {
        HeaderComponent
    },
    setup(){

        const axios = inject('axios')
        const api = inject('api')
        const swal = inject('$swal')

        const store = useStore()
        const router = useRouter()

        const transferencia = reactive({
            telefono: '',
            valor: '',
            _id: ''
        })

        // Función que limita el campo de teléfono a solo números y máximo 13 carácteres
        const limitarTelefono = () => {
            let re = new RegExp("^[0-9]*$")
            if(transferencia.telefono && !re.test(transferencia.telefono.at(-1))) transferencia.telefono = transferencia.telefono.replace(transferencia.telefono.at(-1),'')
            if(transferencia.telefono && transferencia.telefono.length > 6) transferencia.telefono = transferencia.telefono.substr(0,13)
        }

        // Función que limita el campo del valor a solo números
        const limitarValor = () => {
            let re = new RegExp("^[0-9]*$")
            if(transferencia.valor && !re.test(transferencia.valor.at(-1))) transferencia.valor = transferencia.valor.replace(transferencia.valor.at(-1),'')
        }

        // Enviar transferencia
        const enviar = () => {
            // Primero se valida que el usuario haya digitado un nro de teléfono y un valor mayor a 5000
            if(transferencia.telefono == ''){
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'Debe digitar el número de teléfono',
                    timer: 2000,
                    showConfirmButton: false
                })
                return
            }
            if(transferencia.valor == '' || parseInt(transferencia.valor) < 5000){
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'El valor mínimo de transferencia es de $5.000',
                    timer: 2000,
                    showConfirmButton: false
                })
                return
            }

            // Se envía la petición para realizar la transferencia
            transferencia._id = store.user._id
            axios.post(api+'transferir', transferencia, {
                headers: {
                    authorization: store.token
                }
            }).then(async (response) => {
                store.user.saldo = store.user.saldo-parseInt(transferencia.valor)
                await swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Transacción realizada satisfactoriamente',
                    showConfirmButton: false,
                    timer: 1000
                })
                router.replace('/home')
            }).catch(error => {
                if(error.response.data.status == 422){
                    swal.fire({
                        icon: 'error',
                        title: 'Opps!',
                        text: error.response.data.message,
                        timer: 2000,
                        showConfirmButton: false
                    })
                    return
                }
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'Ocurrió un error, intenta de nuevo.',
                    timer: 2000,
                    showConfirmButton: false
                })
            })
        }

        onMounted(() => {
            if(Object.values(store.user).length == 0){
                let token = localStorage.getItem('token')
                if(token && token != ''){
                    store.token = token
                    axios.get(api+'getUser', {
                        headers: {
                            authorization: token
                        }
                    }).then(response => {
                        store.setUser(response.data.data)
                    }).catch(error => {
                        router.replace('/')
                    })
                }
            }
        })

        return{
            transferencia,
            limitarTelefono,
            limitarValor,
            enviar
        }

    }
}
</script>
<style lang="css" scoped>
    .form-group{
        width: 200px;
        margin: 10px;
    }
</style>