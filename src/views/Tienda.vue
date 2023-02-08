<template lang="">
    <div>
        <header>Alien express</header>
        <section>
            <aside></aside>
            <article>
                <div class="modal">
                    <div class="content">
                        <div class="factura">
                            <div class="photo"><img src="../assets/teclado.jpg"></div>
                            <br>
                            <hr>
                            <br>
                            <div>
                                <strong>Producto: </strong>
                                <span>Teclado gamer</span>
                                <br><br>
                                <strong>Cantidad: </strong>
                                <span>1</span>
                                <br><br>
                                <strong>Valor: </strong>
                                <span>$150.000</span>
                                <br><br>
                                <strong>Descuento: </strong>
                                <span>10%</span>
                                <br><br>
                                <strong>Subtotal: </strong>
                                <span>$135.000</span>
                                <br><br>
                                <hr>
                                <br><br>
                                <strong>Total: </strong>
                                <span>$135.000</span>
                            </div>
                        </div>
                        <div class="nique">
                            <div>
                                <div class="title">
                                    <h1>NIQUE</h1>
                                </div>
                                <div class="form">
                                    <div class="form-group">
                                        <label for="telefono">Teléfono</label>
                                        <input type="text" name="telefono" v-model="data.telefono">
                                    </div>
                                    <div class="form-group">
                                        <label for="pin">Pin</label>
                                        <input type="text" name="pin" v-model="data.pin">
                                    </div>
                                    <div class="form-group" style="text-align: center">
                                        <button class="success" @click="pagar">Pagar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    </div>
</template>
<script>
import { reactive, inject } from 'vue'

export default {
    setup(){

        const axios = inject('axios')
        const api = inject('api')
        const swal = inject('$swal')

        const data = reactive({
            telefono: '',
            pin: '',
            valor: 135000
        })

        const pagar = () => {
            axios.post(api+'realizarPago', data).then(response => {
                swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Pago realizado satisfactoriamente',
                    timer: 2000,
                    showConfirmButton: false
                })
                return
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
                    text: 'Ocurrió un error al realizar el pago.',
                    timer: 2000,
                    showConfirmButton: false
                })
                return
            })
        }

        return {
            data,
            pagar
        }
 
    }
}
</script>
<style lang="css" scoped>
    header{
        background-color: deepskyblue;
        color: white;
        font-size: 20px;
        font-weight: 700;
        border-bottom: 2px solid darkblue;
    }
    section{
        display: flex;
    }
    aside{
        min-height: calc(100vh - 44px);
        width: 206px;
        background: #d3d3d3a6;
    }
    .modal{
        background: rgba(0,0,0,.6);
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
    }

    .modal .content{
        width: 60%;
        height: 60%;
        background: white;
        margin: auto;
        border-radius: 10px;
        padding: 25px;
        display: flex;
    }

    .factura{
        background-color: aliceblue;
        padding: 10px;
    }

    img{
        width: 200px;
    }

    strong{
        font-weight: 700;
    }

    .nique{
        padding: 30px;
        width: 100%;
        height: 100%;
    }

    .nique > div{
        border: 2px solid lightgray;
        height: 100%;
    }

    .title{
        text-align: center;
        padding: 40px;
        font-size: 45px;
        font-weight: 900;
        color: #00BD7E;
    }
    
    .form{
        padding: 40px;
    }

    .form-group{
        margin: 10px;
    }
</style>