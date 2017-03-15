<template>
    <div style="position: absolute">
        <div class="pesquisa row ">
            <div class="col-sm-4 col-sm-offset-4">
                <input class="form-control" type="text" placeholder="pesquise um pokemon" v-model="pesquisa">
            </div>
        </div>

        <div id="loading" v-if="carregando">
            <div class="pokeball" id="normal"></div>
            <div class="pokeball" id="great"></div>
            <div class="pokeball" id="ultra"></div>
            <div class="pokeball" id="master"></div>
            <div class="pokeball" id="safari"></div>
            <div class="div-carregando"><p>Carregando...</p></div>
        </div>

        <div class="row" v-else>
            <pokemon-card v-for="pokemon in listaFiltrada" :key="pokemon.id"
                          :poke="pokemon" @click.native="selecionarPokemon(pokemon)"
            ></pokemon-card>
            <div v-if="listaFiltrada.length == 0">
                <h4>Nenhum pokemon encontrado.</h4>
            </div>

        </div>
    </div>
</template>

<script>
    let axios = require('axios');
    import pokemonCard from './card.vue';

    export default{
        data(){
            return{
                pesquisa: '',
                carregando: false,
                tipos: {},
                pokemons: []
            };
        },
        components:{
            'pokemon-card': pokemonCard
        },
        methods:{
            selecionarPokemon(pokemon){
                this.$emit('selecionarPokemon', pokemon);
            }
        },
        computed:{
            listaFiltrada(){
                let retorno = [];
                switch (this.pesquisa.toLowerCase()){
                    case "bug":
                    case "inseto":
                        for(let pokemon of this.tipos.bug.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "fire":
                    case "fogo":
                        for(let pokemon of this.tipos.fire.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "water":
                    case "agua":
                    case "água":
                        for(let pokemon of this.tipos.water.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "normal":
                        for(let pokemon of this.tipos.normal.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "fighting":
                    case "lutador":
                        for(let pokemon of this.tipos.fighting.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "grass":
                    case "planta":
                        for(let pokemon of this.tipos.grass.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "poison":
                    case "venenoso":
                        for(let pokemon of this.tipos.poison.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "electric":
                    case "elétrico":
                    case "eletrico":
                        for(let pokemon of this.tipos.electric.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "ground":
                    case "terra":
                        for(let pokemon of this.tipos.ground.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "psychic":
                    case "psíquico":
                    case "psiquico":
                        for(let pokemon of this.tipos.psychic.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "rock":
                    case "pedra":
                        for(let pokemon of this.tipos.rock.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "flying":
                    case "voador":
                        for(let pokemon of this.tipos.flying.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "ghost":
                    case "fantasma":
                        for(let pokemon of this.tipos.ghost.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "ice":
                    case "gelo":
                        for(let pokemon of this.tipos.ice.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "dragon":
                    case "dragão":
                    case "dragao":
                        for(let pokemon of this.tipos.dragon.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "steel":
                    case "metálico":
                    case "metalico":
                        for(let pokemon of this.tipos.steel.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "dark":
                    case "noturno":
                        for(let pokemon of this.tipos.dark.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "fairy":
                    case "fada":
                        for(let pokemon of this.tipos.fairy.pokemon){
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                }

                return this.pokemons.filter((pok) =>
                {
                    return ((pok.id == this.pesquisa) || pok.name.toUpperCase().includes(this.pesquisa.toUpperCase()));
                });
            }
        },
        created(){
            let app = this;

            this.carregando = true;

            function getId(url){
                let id;
                url = url.replace("https", "http")
                id = url.substring(33);
                id = id.substring(0, id.length - 1);
                return parseInt(id);
            }

            if(this.pokemons.length == 0){
                axios.get('http://pokeapi.co/api/v2/pokemon/?limit=900').then(
                    function(response){
                        for(let pokemon of response.data.results){
                            pokemon.id = getId(pokemon.url);
                            app.pokemons.push(pokemon);
                            app.carregando = false;
                        }
                    }
                );

                this.pronto = false;


                axios.get('http://pokeapi.co/api/v2/type').then(
                    function (response) {
                        for(let type of response.data.results){
                            axios.get(type.url).then(
                                function(resp){
                                    app.tipos[resp.data.name] = resp.data;
                                    app.pronto = true;
                                }
                            );
                        }
                    }
                );
            }
        },
        created(){
            let app = this;
            console.log('teste');
            this.carregando = true;

            function getId(url){
                let id;
                url = url.replace("https", "http")
                id = url.substring(33);
                id = id.substring(0, id.length - 1);
                return parseInt(id);
            }

            if(this.pokemons.length == 0){
                axios.get('http://pokeapi.co/api/v2/pokemon/?limit=900').then(
                    function(response){
                        for(let pokemon of response.data.results){
                            pokemon.id = getId(pokemon.url);
                            app.pokemons.push(pokemon);
                            app.carregando = false;
                        }
                    }
                );

                this.pronto = false;


                axios.get('http://pokeapi.co/api/v2/type').then(
                    function (response) {
                        for(let type of response.data.results){
                            axios.get(type.url).then(
                                function(resp){
                                    app.tipos[resp.data.name] = resp.data;
                                    app.pronto = true;
                                }
                            );
                        }
                    }
                );
            }
        }
    }
</script>