<template lang="">
    <section>
        <!-- ENCABEZADO -->
        <header-component></header-component>
        <!-- Formulario para cargar saldo -->
        <article class="card">
            <div class="card-header">
                <div>
                    <RouterLink to="/home"><font-awesome-icon icon="fa-solid fa-arrow-left" /></RouterLink>
                </div>
                <br>
                <h1>Cargar saldo</h1>
            </div>
            <div class="card-body">
                <p>Actualmente solo tenemos habilitado cargar saldo mediante tarjeta de crédito.</p>
                <div class="form-group">
                    <label for="">Número de tarjeta</label>
                    <input type="text" v-model="data.nroTarjeta" @input="limitarNro">
                </div>
                <div class="form-group codigo">
                    <div>
                        <label for="">Fecha exp</label>
                        <input type="text" v-model="data.fechaExpira">
                    </div>
                    <div>
                        <label for="">Código</label>
                        <input type="text" v-model="data.codigo" @input="limitarCodigo">
                    </div>
                </div>
                <div class="form-group">
                    <label for="">Nombre del propietario</label>
                    <input type="text" v-model="data.nombre">
                </div>
                <div class="form-group">
                    <label for="">Valor</label>
                    <input type="text" v-model="data.valor" @input="limitarValor">
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

        const data = reactive({
            nroTarjeta: '',
            fechaExpira: '',
            codigo: '',
            nombre: '',
            valor: '',
            _id: ''
        })

        // Función que limita el campo de nro de tarjeta a solo números
        const limitarNro = () => {
            let re = new RegExp("^[0-9]*$")
            if(data.nroTarjeta && !re.test(data.nroTarjeta.at(-1))) data.nroTarjeta = data.nroTarjeta.replace(data.nroTarjeta.at(-1),'')
        }

        // Función que limita el campo de codigo a solo números y máximo 3 carácteres
        const limitarCodigo = () => {
            let re = new RegExp("^[0-9]*$")
            if(data.codigo && !re.test(data.codigo.at(-1))) data.codigo = data.codigo.replace(data.codigo.at(-1),'')
            if(data.codigo && data.codigo.length > 3) data.codigo = data.codigo.substr(0,3)
        }

        // Función que limita el campo del valor a solo números
        const limitarValor = () => {
            let re = new RegExp("^[0-9]*$")
            if(data.valor && !re.test(data.valor.at(-1))) data.valor = data.valor.replace(data.valor.at(-1),'')
        }

        // Enviar data
        const enviar = () => {

            if(data.nroTarjeta == '' || data.fechaExpira == '' || data.codigo == '' || data.nombre == '' || data.valor == ''){
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'Debe llenar todos los campos para realizar la recarga.',
                    timer: 2000,
                    showConfirmButton: false
                })
                return
            }

            if(data.valor == '' || parseInt(data.valor) < 5000){
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'El valor mínimo es de $5.000',
                    timer: 2000,
                    showConfirmButton: false
                })
                return
            }

            // Se envía la petición para realizar la data
            data._id = store.user._id
            axios.post(api+'cargarSaldo', data, {
                headers: {
                    authorization: store.token
                }
            }).then(async (response) => {
                store.user.saldo = store.user.saldo+parseInt(data.valor)
                await swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Recarga realizada satisfactoriamente',
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
            data,
            limitarNro,
            limitarCodigo,
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

    .codigo{
        display: flex;
    }
    .codigo div{
        margin: 5px;
    }
</style>