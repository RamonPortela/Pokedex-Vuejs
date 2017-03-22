<template>
    <div>
        <div class="pesquisa navbar navbar-fixed-top ">
            <div class="navbar-form">
                <input class="form-control" type="text" placeholder="pesquise um pokemon" v-model="pesquisa">
            </div>
        </div>

        <div class="div-pokebolas" id="loading" v-if="carregando">
            <div class="pokeball" id="normal"></div>
            <div class="pokeball" id="great"></div>
            <div class="pokeball" id="ultra"></div>
            <div class="pokeball" id="master"></div>
            <div class="pokeball" id="safari"></div>
            <div class="div-carregando"><p>Carregando...</p></div>
        </div>

        <div class="row" v-else>
            <transition-group
                    name="staggered-fade"
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter"
                    v-on:leave="leave"
            >
                <pokemon-card v-for="pokemon in listaFiltrada" :key="pokemon.id"
                              :poke="pokemon" @click.native="detalharPokemon(pokemon)"
                ></pokemon-card>
            </transition-group>

            <div v-if="listaFiltrada.length == 0">
                <h4>Nenhum pokemon encontrado.</h4>
            </div>

        </div>
    </div>
</template>

<script>
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
            detalharPokemon(pokemon){
                this.$router.push({name: 'detalhes', params: {id: pokemon.id}})
            },
            beforeEnter: function (el) {
                el.style.opacity = 0
            },
            enter: function (el, done) {
                let delay = el.dataset.index * 150
                setTimeout(function () {
                    Velocity(
                        el,
                        { opacity: 1 },
                        { complete: done }
                    )
                }, delay)
            },
            leave: function (el, done) {
                var delay = el.dataset.index * 500
                setTimeout(function () {
                    Velocity(
                        el,
                        { opacity: 0, height: 0 },
                        { complete: done }
                    )
                }, delay)
            }
        },
        computed:{
            listaFiltrada(){
                let retorno = [];
                switch (this.pesquisa.toLowerCase()){
                    case "bug":
                    case "inseto":
                        for(let pokemon of this.tipos.bug.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "fire":
                    case "fogo":
                        for(let pokemon of this.tipos.fire.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "water":
                    case "agua":
                    case "água":
                        for(let pokemon of this.tipos.water.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "normal":
                        for(let pokemon of this.tipos.normal.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "fighting":
                    case "lutador":
                        for(let pokemon of this.tipos.fighting.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "grass":
                    case "planta":
                        for(let pokemon of this.tipos.grass.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "poison":
                    case "venenoso":
                        for(let pokemon of this.tipos.poison.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "electric":
                    case "elétrico":
                    case "eletrico":
                        for(let pokemon of this.tipos.electric.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "ground":
                    case "terra":
                        for(let pokemon of this.tipos.ground.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "psychic":
                    case "psíquico":
                    case "psiquico":
                        for(let pokemon of this.tipos.psychic.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "rock":
                    case "pedra":
                        for(let pokemon of this.tipos.rock.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "flying":
                    case "voador":
                        for(let pokemon of this.tipos.flying.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "ghost":
                    case "fantasma":
                        for(let pokemon of this.tipos.ghost.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "ice":
                    case "gelo":
                        for(let pokemon of this.tipos.ice.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "dragon":
                    case "dragão":
                    case "dragao":
                        for(let pokemon of this.tipos.dragon.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "steel":
                    case "metálico":
                    case "metalico":
                        for(let pokemon of this.tipos.steel.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "dark":
                    case "noturno":
                        for(let pokemon of this.tipos.dark.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
                            retorno.push(pokemon.pokemon);
                        }
                        return retorno;
                        break;
                    case "fairy":
                    case "fada":
                        for(let pokemon of this.tipos.fairy.pokemon){
                            pokemon.pokemon.id = pokemon.pokemon.url.split("/")[6];
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
            this.carregando = true;

            function getId(url){
                let id;
                id = url.substring(34);
                id = id.substring(0, id.length - 1);
                return parseInt(id);
            }

            if(this.pokemons.length == 0){

                this.$http.get('pokemon/?limit=900').then(response => {
                    for(let pokemon of response.data.results){
                        pokemon.id = getId(pokemon.url);
                        this.pokemons.push(pokemon);
                        this.carregando = false;
                    }
                });

                this.pronto = false;

                this.$http.get('type').then(response =>{
                    for(let type of response.data.results){
                       this.$http.get('type/'+type.name).then(
                            function(resp){
                                this.tipos[resp.data.name] = resp.data;
                                this.pronto = true;
                            }
                        );
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .pesquisa{
        background-color: rgba(255, 255, 255, 0.95);
    }
    .div-pokebolas{
        top:150px;
    }
</style>