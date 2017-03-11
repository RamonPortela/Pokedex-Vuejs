<template>
  <div id="app">
    <div v-show="!exibirDetalhes">
      <pokemon-card v-for="pokemon in pokemons" :key="pokemon.id"
                    :poke="pokemon" @click.native="selecionarPokemon(pokemon)"
      ></pokemon-card>
    </div>
    <div v-show="exibirDetalhes">
      <detalhes :poke="pokemonSelecionado" @voltar="pokemonSelecionado = null"></detalhes>
    </div>
  </div>
</template>

<script>
let axios = require('axios');
import pokemonCard from './components/card.vue';
import detalhes from './components/detalhes.vue';

export default {
  name: 'app',
  data () {
    return {
      pokemons: [],
      pokemonSelecionado: null
    }
  },
  components: {
    'pokemon-card': pokemonCard,
    'detalhes': detalhes
  },
  methods:{
      selecionarPokemon(pokemon){
        this.pokemonSelecionado = pokemon;
      }
  },
  computed:{
      exibirDetalhes(){
          if(this.pokemonSelecionado == null)
              return false;
          else
              return true;
      }
  },
  created(){
    let app = this;

    function getId(url){
      let id;
      id = url.substring(33);
      id = id.substring(0, id.length - 1);
      return parseInt(id);
    }

    if(this.pokemons.length == 0){
        console.log("got here");
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
  },
    destroyed(){
      console.log("I was destryoed");
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
  margin-left: auto;
  margin-right: auto;
  width: 85%;
  background-color: lightgray;
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

body{
  background: #f1f1f1;
}
</style>
