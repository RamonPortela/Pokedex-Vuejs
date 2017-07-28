import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import { routes } from './routes'
import Velocity from 'velocity-animate';
import axios from 'axios';

axios.defaults.baseURL = "https://pokeapi.co/api/v2";
Vue.prototype.axios = axios;

Vue.filter('FiltroNome', function(value){
  let nome = value;

  nome = nome.replace("-", " ");

  return nome.charAt(0).toUpperCase() + nome.substring(1);
});

Vue.filter('FiltroTipos', value =>
{
  let tipo = value;

    switch (tipo){
        case "bug":
            return "Inseto";
        case "fire":
            return "Fogo";
        case "water":
            return "Água";
        case "normal":
            return "Normal";
        case "fighting":
            return "Lutador";
        case "grass":
            return "Planta";
        case "poison":
            return "Venenoso";
        case "electric":
            return "Elétrico";
        case "ground":
            return "Terra";
        case "psychic":
            return "Psíquico";
        case "rock":
            return "Pedra";
        case "flying":
            return "Voador";
        case "ghost":
            return "Fantasma";
        case "ice":
            return "Gelo";
        case "dragon":
            return "Dragão";
        case "steel":
            return "Metálico";
        case "dark":
            return "Noturno";
        case "fairy":
            return "Fada";
    }
});

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Velocity);

//Vue.http.options.root = "https://pokeapi.co/api/v2";

const router = new VueRouter({
   routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
