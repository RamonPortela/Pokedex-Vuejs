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
