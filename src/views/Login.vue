<template lang="">
    <section>
        <article>
            <div class="title"><h2>Iniciar sesión</h2></div>
            <div class="form-group">
                <label for="usuario">Correo electrónico o teléfono</label>
                <br>
                <input name="usuario" type="text" v-model="usuario">
            </div>
            <div class="form-group">
                <label for="contraseña">Contraseña</label>
                <br>
                <input name="contraseña" type="password" v-model="contraseña">
            </div>
            <div class="register">
                <RouterLink to="/register">Registrarse</RouterLink>
            </div>
            <div class="singin">
                <button class="success" @click="singin">Entrar</button>
            </div>
        </article>
    </section>
</template>
<script>
import { ref, inject } from 'vue'
import { RouterLink } from "vue-router";
import { useStore } from '../store'
import { useRouter } from 'vue-router'

export default {
    components:{
        RouterLink
    },
    setup(){
        const axios = inject('axios')
        const swal = inject('$swal')
        const api = inject('api')

        const store = useStore()
        const router = useRouter()

        const usuario = ref('')
        const contraseña = ref('')

        const singin = () => {
            // validar que se haya digitado el usuario y la clave
            if(!usuario.value || !contraseña.value){
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'Debe digitar el usuario y la contraseña para poder ingresar.',
                    showConfirmButton: false,
                    timer: 2000
                })
            }

            // envía petición para loguear al usuario
            axios.post(api+'login', { usuario: usuario.value, contraseña: contraseña.value }).then(response => {
                store.setUser(response.data.data)
                store.setToken(response.data.token)
                localStorage.setItem('token',response.data.token)
                router.replace({ path: '/home' })
            }).catch(error => {
                console.log(error)
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

        return{
            usuario,
            contraseña,
            singin
        }
    }
}
</script>
<style lang="css" scoped>
    section{
        background-color: #00BD7E;
        height: 100vh;
        padding: 5px;
    }

    article{
        width: 300px;
        height: 500px;
        background-color: white;
        margin: auto;
        margin-top: calc(100vh - 85vh);
        border-radius: 10px;
        box-shadow: 0 0 11px 5px rgba(0,0,0,.5);
        padding: 10px;
    }

    .title{
        text-align: center;
        margin-top: 30px;
        margin-bottom: 50px;
    }

    .form-group{
        margin: 30px 0 30px 0;
    }

    .register, .singin{
        text-align: center;
    }

    .singin{
        margin-top: 50px;
    }

    a{
        text-decoration: none;
    }
</style>