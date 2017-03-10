<template>
  <div id="app">
    <pokemon-card v-for="pokemon in pokemons" :key="pokemon.id"
      :poke="pokemon"
    ></pokemon-card>
  </div>
</template>

<script>
let axios = require('axios');
import pokemonCard from './components/card.vue';

export default {
  name: 'app',
  data () {
    return {
      pokemons: []
    }
  },
  components: {
    'pokemon-card': pokemonCard
  },

  created(){
    let app = this;

    function getId(url){
      let id;
      id = url.substring(33);
      id = id.substring(0, id.length - 1);
      return parseInt(id);
    }

    axios.get('http://pokeapi.co/api/v2/pokemon/?limit=900').then(
      function(response){
        let pokemon;
        for(pokemon of response.data.results){
          pokemon.id = getId(pokemon.url);
          app.pokemons.push(pokemon);
        }
      }
    )
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
