import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import { routes } from './routes'
import Velocity from 'velocity-animate';

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
            return "Inseto"
            break;
        case "fire":
            return "Fogo";
            break;
        case "water":
            return "Água";
            break;
        case "normal":
            return "Normal";
            break;
        case "fighting":
            return "Lutador";
            break;
        case "grass":
            return "Planta";
            break;
        case "poison":
            return "Venenoso";
            break;
        case "electric":
            return "Elétrico";
            break;
        case "ground":
            return "Terra";
            break;
        case "psychic":
            return "Psíquico";
            break;
        case "rock":
            return "Pedra";
            break;
        case "flying":
            return "Voador";
            break;
        case "ghost":
            return "Fantasma";
            break;
        case "ice":
            return "Gelo";
            break;
        case "dragon":
            return "Dragão";
            break;
        case "steel":
            return "Metálico";
            break;
        case "dark":
            return "Noturno";
            break;
        case "fairy":
            return "Fada";
            break;
    }
});

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Velocity);

Vue.http.options.root = "https://pokeapi.co/api/v2";

const router = new VueRouter({
   routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
