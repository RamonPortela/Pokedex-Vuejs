<template>  
    <div class="card">
        <div>
            <img :src="imgLink"/>
        </div>
        <div>
            {{poke.name}}
        </div>
    </div>
</template>
<script>
    const link = "http://www.pokestadium.com/sprites/xy/";

    export default{
        data(){
            return{
                imgLink: ''
            };
        },
        props: {
            poke:{
                type: Object,
            }
        },
        mounted(){
            this.imgLink = link + this.poke.name + ".gif"
        }
    }
</script>
<style lang="" scoped>
    .card{
        float: left;
    }
</style>