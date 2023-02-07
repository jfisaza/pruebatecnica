<template lang="">
    <div>
        <!-- ENCABEZADO -->
        <header-component></header-component>
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
                        <span>{{ saldoEnDolar }}</span>
                    </div>
                </div>
            </article>
            <!-- ACCIONES -->
            <article class="card">
                <div class="card-header"><h1>¿Que quieres hacer hoy?</h1></div>
                <div class="card-body">
                    <div class="action" @click="redirect('/actualizarDatos')">
                        <font-awesome-icon class="icono" icon="fa-solid fa-user-pen" />
                        <br>
                        Actualizar tus datos
                    </div>
                    <div class="action" @click="redirect('/transferencia')">
                        <font-awesome-icon class="icono" icon="fa-solid fa-share" />
                        <br>
                        Enviar dinero
                    </div>
                    <div class="action" @click="redirect('/cargarSaldo')">
                        <font-awesome-icon class="icono" icon="fa-solid fa-arrow-up-from-bracket" />
                        <br>
                        Cargar saldo
                    </div>
                </div>
            </article>
            <!-- TRANSACCIONES -->
            <article class="card">
                <div class="card-header"><h1>Reporte de transacciones</h1></div>
                <div class="card-body">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Valor</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="transaccion in transacciones">
                                <td>{{ transaccion.fecha }}</td>
                                <td :style="transaccion.ingreso == 1 ? 'color: #00BD7E': 'color: red'">{{ transaccion.valor }}</td>
                                <td>{{ transaccion.descripcion }}</td>
                            </tr>
                            <tr v-if="transacciones.length == 0">
                                <td colspan="3">No se encontraron movimientos.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    </div>
</template>
<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import { ref, onMounted, inject, computed } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import moment from 'moment'

export default {
    components: {
        HeaderComponent
    },
    setup(){
        const axios = inject('axios')
        const api = inject('api')

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

        const transacciones = ref([])

        // Computada para convertir el saldo en formato de moneda
        const saldoEnDolar = computed(() => {
            const options = { style: 'currency', currency: 'USD' };
            const currency = new Intl.NumberFormat('en-US', options);
            if(!userData.value.saldo) return currency.format(0)
            return currency.format(userData.value.saldo)
        })

        const obtenerMovimientos = () => {
            axios.get(api+'getMovimientos/'+store.user._id, {
                headers: {
                    authorization: store.token
                }
            }).then(response => {
                transacciones.value = response.data.data.map(item => {
                    return {
                        fecha: moment(item.fecha).format('DD/MM/YYYY HH:mm'),
                        descripcion: item.descripcion,
                        valor: item.valor,
                        ingreso: item.ingreso
                    }
                })
            }).catch(error => {
                swal.fire({
                    icon: 'error',
                    title: 'Opps!',
                    text: 'Ocurrió un error al cargar las transacciones.',
                    timer: 2000,
                    showConfirmButton: false
                })
                return
            })
        }

        const redirect = (route) => {
            router.replace(route)
        }

        // Se toma la información del store, si no hay, se consulta por el token y si ya expiró o no existe un usuario con el token
        // se redirige al login
        onMounted(() => {
            userData.value = store.user
            if(Object.values(userData.value).length == 0){
                let token = localStorage.getItem('token')
                if(token && token != ''){
                    store.token = token
                    axios.get(api+'getUser', {
                        headers: {
                            authorization: token
                        }
                    }).then(response => {
                        store.setUser(response.data.data)
                        userData.value = response.data.data
                        obtenerMovimientos()
                    }).catch(error => {
                        router.replace('/')
                    })
                }
            }else{
                obtenerMovimientos()
            }
        })

        return{
            userData,
            saldoEnDolar,
            redirect,
            transacciones
        }
    }
}
</script>
<style lang="css" scoped>
    
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

    thead th:nth-child(1){
        width: 100px;
    }
</style>