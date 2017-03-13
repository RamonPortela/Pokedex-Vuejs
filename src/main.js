import Vue from 'vue'
import App from './App.vue'

Vue.filter('FiltroNome', function(value){
  let nome = value;

  nome = nome.replace("-", " ");

  return nome.charAt(0).toUpperCase() + nome.substring(1);
});

new Vue({
  el: '#app',
  render: h => h(App)
})
