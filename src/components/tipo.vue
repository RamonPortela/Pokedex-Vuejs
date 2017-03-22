<template>
    <div>
        <div class="holder container" v-if="!carregando">
            <router-link v-for="(type, index) in tipo.efetivoContra" class="div-tipo" :class="type.name" tag="div" :to="{ name: 'tipo', params: {id: id}}" :key="type.name">{{ type.name }}</router-link>
<!--          <router-link v-for="(type, index) in tipo.fracoContra" class="div-tipo" :class="type.type.name" v-if="type.type != null" tag="div" :to="{ name: 'tipo', params: {id: pokemon.tipos[index]}}" :key="type.type.name">{{ type.type.name }}</router-link>
            <router-link v-for="(type, index) in tipo.sofreContra" class="div-tipo" :class="type.type.name" v-if="type.type != null" tag="div" :to="{ name: 'tipo', params: {id: pokemon.tipos[index]}}" :key="type.type.name">{{ type.type.name }}</router-link>
            <router-link v-for="(type, index) in tipo.resistenteContra" class="div-tipo" :class="type.type.name" v-if="type.type != null" tag="div" :to="{ name: 'tipo', params: {id: pokemon.tipos[index]}}" :key="type.type.name">{{ type.type.name }}</router-link>-->
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                tipo: {},
                carregando: true
            }
        },
        methods:{
            fetchData(){
                this.$http.get('type/' + this.id).then(response => {
                   let type = response.data;
                   this.tipo.nome = type.name;
                   this.tipo.pokemons = type.pokemon;
                   this.tipo.efetivoContra = type.damage_relations.double_damage_to;
                   this.tipo.fracoContra = type.damage_relations.half_damage_to;
                   this.tipo.sofreContra = type.damage_relations.double_damage_from;
                   this.tipo.resistenteContra = type.damage_relations.half_damage_from;
                   console.log(this.tipo.efetivoContra);
                   this.carregando = false;
                });
            }
        },
        created(){
            this.fetchData();
        },
        props: ["id"]
    }
</script>