import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft, faUser, faUserPen, faShare, faArrowUpFromBracket, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import "./assets/main.css";

library.add(faArrowLeft)
library.add(faUser)
library.add(faUserPen)
library.add(faShare)
library.add(faArrowUpFromBracket)
library.add(faKeyboard)
const pinia = createPinia()

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios)
app.use(VueSweetalert2)
app.use(pinia)

app.component('font-awesome-icon', FontAwesomeIcon)

app.provide('axios', app.config.globalProperties.axios)
app.provide('api','https://api-pruebatecnica.onrender.com/api/')

app.mount("#app");
