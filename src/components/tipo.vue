<template>
    <div>
        <div class="holder container" v-if="!carregando">

            <div class="row">
                <h2>Ataque - Prós e Contras</h2>
                <div class="row" v-if="tipo.efetivoContra.length > 0">
                    <div class="col-xs-12 bom"> Ataques do tipo {{tipo.nome | FiltroTipos }} são super-efetivos contra</div>
                    <div class="col-xs-12"><router-link v-for="(type, index) in tipo.efetivoContra" class="div-tipo" :class="type.name" tag="div" :to="{ name: 'tipo', params: {id: type.url.split('/')[6]}}" :key="type.name">{{ type.name | FiltroTipos}}</router-link></div>
                </div>
                <div class="row" v-if="tipo.fracoContra.length > 0">
                    <div class="col-xs-12 ruim">Ataques do tipo {{tipo.nome | FiltroTipos }} não são efetivos contra</div>
                    <div class="col-xs-12"><router-link v-for="(type, index) in tipo.fracoContra" class="div-tipo" :class="type.name" tag="div" :to="{ name: 'tipo', params: {id: type.url.split('/')[6]}}" :key="type.name">{{ type.name | FiltroTipos}}</router-link></div>
                </div>
                <div class="row" v-if="tipo.semEfeitoContra.length > 0">
                    <div class="col-xs-12 ruim">Ataques do tipo {{tipo.nome | FiltroTipos }} não causam efeitos contra</div>
                    <div class="col-xs-12"><router-link v-for="(type, index) in tipo.semEfeitoContra" class="div-tipo" :class="type.name" tag="div" :to="{ name: 'tipo', params: {id: type.url.split('/')[6]}}" :key="type.name">{{ type.name | FiltroTipos}}</router-link></div>
                </div>
            </div>

            <div class="row">
                <h2>Defesa - Prós e Contras</h2>
                <div class="row" v-if="tipo.naoSofreEfeito.length > 0">
                    <div class="col-xs-12 bom">Estes tipos não causam efeito contra pokemons dos tipo {{tipo.nome | FiltroTipos }}</div>
                    <div class="col-xs-12"><router-link v-for="(type, index) in tipo.naoSofreEfeito" class="div-tipo" :class="type.name" tag="div" :to="{ name: 'tipo', params: {id: id}}" :key="type.name">{{ type.name | FiltroTipos}}</router-link></div>
                </div>
                <div class="row" v-if="tipo.resistenteContra.length > 0">
                    <div class="col-xs-12 bom">Estes tipos não são efetivos contra pokemons dos tipo {{tipo.nome | FiltroTipos }}</div>
                    <div class="col-xs-12"><router-link v-for="(type, index) in tipo.resistenteContra" class="div-tipo" :class="type.name" tag="div" :to="{ name: 'tipo', params: {id: type.url.split('/')[6]}}" :key="type.name">{{ type.name | FiltroTipos}}</router-link></div>
                </div>
                <div class="row" v-if="tipo.sofreContra.length > 0">
                    <div class="col-xs-12 ruim">Estes tipos são super-efetivos contra pokemons dos tipo {{tipo.nome | FiltroTipos }}</div>
                    <div class="col-xs-12"><router-link v-for="(type, index) in tipo.sofreContra" class="div-tipo" :class="type.name" tag="div" :to="{ name: 'tipo', params: {id: type.url.split('/')[6]}}" :key="type.name">{{ type.name | FiltroTipos}}</router-link></div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <div>
                        <h2>Pokemons Tipo {{tipo.nome | FiltroTipos}}</h2>
                        <table>
                            <router-link class="seletor-pokemon" v-for="pokemon in tipo.pokemons" :key="pokemon.name" :to="{name: 'detalhes', params: {id: pokemon.pokemon.url.split('/')[6]}}" tag="tr">
                                <td class="td-nome">
                                    <div class="row"><img :src="imgLink+pokemon.pokemon.url.split('/')[6]+'.png'" alt=""></div>
                                    <div class="row">#{{pokemon.pokemon.url.split('/')[6]}} /{{pokemon.pokemon.name}}</div>
                                </td>
                            </router-link>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                tipo: {},
                carregando: true,
                imgLink: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
            }
        },
        props: ["id"],
        methods:{
            fetchData(){
                this.carregando = true;
                this.$http.get('type/' + this.id).then(response => {
                   let type = response.data;

                   this.tipo.nome = type.name;
                   this.tipo.pokemons = type.pokemon;
                   this.tipo.efetivoContra = type.damage_relations.double_damage_to;
                   this.tipo.fracoContra = type.damage_relations.half_damage_to;
                   this.tipo.sofreContra = type.damage_relations.double_damage_from;
                   this.tipo.resistenteContra = type.damage_relations.half_damage_from;
                   this.tipo.semEfeitoContra = type.damage_relations.no_damage_to;
                   this.tipo.naoSofreEfeito = type.damage_relations.no_damage_from;

                   this.carregando = false;
                });
            }
        },
        created(){
            this.fetchData();
        },
        watch:{
            '$route': 'fetchData'
        },
    }
</script>
<style scoped>
    .div-tipo{
        margin-bottom: 10px !important;
        margin-top: 10px !important;
    }

    .bom::before{
        content: '\2713';
        display: inline-block;
        color: green;
        padding: 0 6px 0 0;
    }

    .ruim::before{
        content: 'X';
        display: inline-block;
        color: red;
        padding: 0 6px 0 0;
    }

    .td-nome{
        text-align: center;
        width: 100%;
        padding-bottom: 15px;
    }
</style>