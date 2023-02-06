<template lang="">
    <div>
        <!-- ENCABEZADO -->
        <header class="success">
            <h2>Prueba</h2>
            <div>
                <logout></logout>
            </div>
        </header>
        <section>
            <!-- DATOS DEL USUARIO -->
            <article class="card">
                <div class="card-header"><h1>Datos personales</h1></div>
                <div class="card-body">
                    <div class="user-photo"><font-awesome-icon icon="fa-solid fa-user" /></div>
                    <div class="user-info">
                        <b>Nombre: </b>
                        <span>{{ userData.nombre }}</span>
                        <br>
                        <b>Apellido: </b>
                        <span>{{ userData.apellido }}</span>
                        <br>
                        <b>Teléfono: </b>
                        <span>{{ userData.telefono }}</span>
                        <br>
                        <b>Correo: </b>
                        <span>{{ userData.correo }}</span>
                        <br>
                        <b>Saldo: </b>
                        <span>{{ userData.saldo }}</span>
                    </div>
                </div>
            </article>
            <!-- ACCIONES -->
            <article class="card">
                <div class="card-header"><h1>¿Que quieres hacer hoy?</h1></div>
                <div class="card-body">
                    <div class="action">
                        <font-awesome-icon class="icono" icon="fa-solid fa-user-pen" />
                        <br>
                        Actualizar tus datos
                    </div>
                    <div class="action">
                        <font-awesome-icon class="icono" icon="fa-solid fa-share" />
                        <br>
                        Enviar dinero
                    </div>
                    <div class="action">
                        <font-awesome-icon class="icono" icon="fa-solid fa-arrow-up-from-bracket" />
                        <br>
                        Cargar saldo
                    </div>
                </div>
            </article>
        </section>
    </div>
</template>
<script>
import Logout from '../components/Logout.vue'
import { ref, onMounted, inject } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

export default {
    components: {
        Logout
    },
    setup(){
        const axios = inject('axios')
        const swal = inject('$swal')

        const store = useStore()
        const router = useRouter()

        const userData = ref({
            identificacion: '',
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            saldo: 0
        })

        onMounted(() => {
            userData.value = store.user
            if(Object.values(userData.value).length == 0) router.replace('/')
        })

        return{
            userData
        }
    }
}
</script>
<style lang="css" scoped>
    header{
        padding: 5px;
        display: flex;
    }

    header div{
        margin-left: auto;
    }

    .card-body{
        display: flex;
    }

    .user-photo{
        width: 100px;
        height: 150px;
        background-color: lightgray;
        color: white;
        font-size: 40px;
        text-align: center;
        line-height: 3.5;
        border-radius: 10px;
        margin: 5px;
    }

    .user-info{
        margin: 5px;
    }

    .user-info b{
        font-weight: bold;
    }

    .action{
        width: 100px;
        text-align: center;
        cursor: pointer;
    }

    .action:hover{
        opacity: .8;
    }

    .icono{
        font-size: 30px;
    }
</style>