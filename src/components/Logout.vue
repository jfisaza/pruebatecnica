<template lang="">
    <div>
        <div class="boton" @click="togglePopover"><font-awesome-icon icon="fa-solid fa-user" /></div>
        <div class="popover" v-if="open">
            <div>
                <div class="triangulo"></div>
                <div class="cuadro">
                    <ul>
                        <li @click="logout">Salir</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
export default {
    setup(){
        const store = useStore()
        const router = useRouter()
        const open = ref(false)

        const togglePopover = () => {
            open.value = !open.value
        }

        const logout = () => {
            store.setUser({})
            store.setToken('')
            router.replace('/')
        }

        return{
            open,
            togglePopover,
            logout
        }
    }
}
</script>
<style lang="css" scoped>

    .boton{
        border: 2px solid white;
        border-radius: 50%;
        padding: 5px 10px;
        cursor: pointer;
    }

    .boton:hover{
        opacity: 0.8;
    }
    .popover{
        position: absolute;
        right: 5px;
        color: black;
    }

    .popover > div{
        position: relative;
        padding-top: 10px;
    }

    .triangulo{
        width: 10px;
        height: 10px;
        background-color: white;
        border-top: 1px solid gray;
        border-left: 1px solid gray;
        transform: rotate(45deg);
        position: absolute;
        top: 5px;
        right: 8px;
        z-index: 2;
    }

    .cuadro{
        background-color: white;
        border: 1px solid gray;
        box-shadow: 0 0 13px 0 rgba(0,0,0,.5);
        width: 100px;
        height: 67px;
        padding-top: 10px;
        z-index: 1;
    }

    ul{
        list-style: none;
        padding: 0;
    }

    li{
        cursor: pointer;
        padding: 10px 5px 10px 5px;
    }
    li:hover{
        background-color: lightgray;
    }
</style>