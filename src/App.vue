<template>
  <div id="app">
    <div v-show="!exibirDetalhes" class="pesquisa">
      <input type="text" placeholder="pesquise um pokemon" v-model="pesquisa">
    </div>
    <div v-show="!exibirDetalhes">
        <pokemon-card v-for="pokemon in listaFiltrada" :key="pokemon.id"
                      :poke="pokemon" @click.native="selecionarPokemon(pokemon)"
        ></pokemon-card>
        <div v-if="listaFiltrada.length == 0">
          <h4>Nenhum pokemon encontrado.</h4>
        </div>

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
      pokemonSelecionado: null,
      pesquisa: ''
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
      },
      listaFiltrada(){
          return this.pokemons.filter((pok) => {return pok.name.includes(this.pesquisa) || pok.id == this.pesquisa});
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
  background-color: transparent;
  padding: 10px 0 10px 0;
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
.pesquisa{
  margin-bottom: 20px;
}
</style>
