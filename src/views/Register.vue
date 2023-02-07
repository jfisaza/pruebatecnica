<template lang="">
    <!-- Formulario de registro de usuario -->
    <section>
        <article>
            <div>
                <RouterLink to="/"><font-awesome-icon icon="fa-solid fa-arrow-left" /></RouterLink>
            </div>
            <div class="title"><h2>Registrarse</h2></div>
            <div class="form-group">
                <label for="identificacion">Número de identificación</label>
                <br>
                <input name="identificacion" type="text" v-model="data.identificacion">
            </div>
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <br>
                <input name="nombre" type="text" v-model="data.nombre">
            </div>
            <div class="form-group">
                <label for="apellido">Apellido</label>
                <br>
                <input name="apellido" type="text" v-model="data.apellido">
            </div>
            <div class="form-group">
                <label for="correo">Correo<span>*</span></label>
                <br>
                <input name="correo" type="email" v-model="data.correo">
            </div>
            <div class="form-group">
                <label for="telefono">Teléfono<span>*</span></label>
                <br>
                <input name="telefono" type="text" v-model="data.telefono" @input="limitarTelefono">
            </div>
            <div class="form-group">
                <label for="pin">Pin<span>*</span></label>
                <br>
                <input name="pin" type="text" v-model="data.pin" @input="limitarPin">
            </div>
            <div class="form-group">
                <label for="contraseña">Contraseña<span>*</span></label>
                <br>
                <input name="contraseña" type="password" v-model="data.contraseña">
            </div>
            <div class="form-group">
                <label for="contraseña">Confirmar contraseña<span>*</span></label>
                <br>
                <input name="contraseña" type="password" v-model="confirmaClave">
            </div>
            <div>
                <template v-for="(error, index) in errors" :key="index">
                    <span>{{ error }}</span> <br>
                </template>
            </div>
            <div class="send">
                <button class="success" @click="enviar">Enviar</button>
            </div>
        </article>
    </section>
</template>
<script>
import { reactive, ref, computed, inject } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

export default {

    setup(){
        const axios = inject('axios')
        const swal = inject('$swal')
        const api = inject('api')

        const store = useStore()
        const router = useRouter()

        const data = reactive({
            identificacion: '',
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            pin: null,
            contraseña: ''
        })

        const confirmaClave = ref('')

        // Esta computada devuelve los errores en el formulario
        const errors = computed(() => {
            let errorsArray = []

            if(!data.telefono || !data.correo || !data.pin || !data.contraseña){
                errorsArray.push('Debe completar los datos marcados con *')
            }

            if(data.contraseña != confirmaClave.value){
                errorsArray.push('La contraseña y la confirmación de contraseña no coinciden.')
            }

            return errorsArray
        })

        // Limitar el campo de pin a solo números y solo 6 caractéres
        const limitarPin = () => {
            let re = new RegExp("^[0-9]*$")
            if(data.pin && !re.test(data.pin.at(-1))) data.pin = data.pin.replace(data.pin.at(-1),'')
            if(data.pin && data.pin.length > 6) data.pin = data.pin.substr(0,6)
        }

        // Limitar el campo de teléfono a solo números y solo 13 caratéres
        const limitarTelefono = () => {
            let re = new RegExp("^[0-9]*$")
            if(data.telefono && !re.test(data.telefono.at(-1))) data.telefono = data.telefono.replace(data.telefono.at(-1),'')
            if(data.telefono && data.telefono.length > 6) data.telefono = data.telefono.substr(0,13)
        }

        // Enviar datos del formulario al backend
        const enviar = () => {
            axios.post(api+'user', data).then((response) => {
                store.setUser(response.data.user)
                store.setToken(response.data.token)
                router.replace({ path: '/home' })
            }).catch((error) => {
                // console.log(error)
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
            data,
            confirmaClave,
            limitarPin,
            limitarTelefono,
            errors,
            enviar
        }

    }
    
}
</script>
<style lang="css" scoped>
    section{
        background-color: #00BD7E;
        min-height: 100vh;
        padding: 5px;
    }

    article{
        width: 300px;
        background-color: white;
        margin: auto;
        margin-top: 75px;
        border-radius: 10px;
        box-shadow: 0 0 11px 5px rgba(0,0,0,.5);
        padding: 10px;
    }

    .title{
        text-align: center;
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .form-group{
        margin: 15px 0 15px 0;
    }

    .send{
        text-align: center;
        margin: 15px 0;
    }

    span{
        color: red;
    }
</style>