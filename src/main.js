import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'

Vue.filter('FiltroNome', function(value){
  let nome = value;

  nome = nome.replace("-", " ");

  return nome.charAt(0).toUpperCase() + nome.substring(1);
});

Vue.use(VueResource);

Vue.http.options.root = "http://pokeapi.co/api/v2";

new Vue({
  el: '#app',
  render: h => h(App)
})
