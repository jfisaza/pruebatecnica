<template lang="">
    <div>
        <!-- ENCABEZADO -->
        <header-component></header-component>
        <section>
            <!-- DATOS DEL USUARIO -->
            <article class="card">
                <div class="card-header">
                    <div>
                        <RouterLink to="/home"><font-awesome-icon icon="fa-solid fa-arrow-left" /></RouterLink>
                    </div>
                    <br>
                    <h1>Actualizar datos</h1>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="identificacion">Identificación</label>
                        <input type="text" name="identificacion" v-model="data.identificacion">
                    </div>
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" name="nombre" v-model="data.nombre">
                    </div>
                    <div class="form-group">
                        <label for="apellido">Apellido</label>
                        <input type="text" name="apellido" v-model="data.apellido">
                    </div>
                    <div class="form-group">
                        <button class="success" @click="enviar">Enviar</button>
                    </div>
                </div>
            </article>
        </section>
    </div>
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
            identificacion: '',
            nombre: '',
            apellido: ''
        })

        const enviar = () => {
            axios.put(api+'actualizaUser/'+store.user._id, data, {
                headers: {
                    authorization: store.token
                }
            }).then(async (response) => {
                store.user.identificacion = data.identificacion
                store.user.apellido = data.apellido
                store.user.nombre = data.nombre
                await swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Actualzación realizada satisfactoriamente',
                    showConfirmButton: false,
                    timer: 1000
                })
                router.replace('/home')
            }).catch(error => {
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'Ocurrió un error, intenta de nuevo.',
                    timer: 2000,
                    showConfirmButton: false
                })
            })
        }


        // Se toma la información del store, si no hay, se consulta por el token y si ya expiró o no existe un usuario con el token
        // se redirige al login
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
                        data.identificacion = store.user.identificacion
                        data.nombre = store.user.nombre
                        data.apellido = store.user.apellido
                    }).catch(error => {
                        router.replace('/')
                    })
                }
            }else{
                data.identificacion = store.user.identificacion
                data.nombre = store.user.nombre
                data.apellido = store.user.apellido
            }
        })

        return{
            data,
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