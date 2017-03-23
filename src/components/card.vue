<template>
    <div class="card col-md-2 col-xs-12 col-sm-3">
        <div>
            <img class="card-img" :src="imgLink + poke.id + '.png'"/>
        </div>
        <div>
            <h4>{{name | FiltroNome}}</h4>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                imgLink: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
            };
        },
        props: {
            poke:{
                type: Object,
            }
        },
        computed:{
            name(){
                if(this.poke.name.endsWith("-m") || this.poke.name.endsWith("-f")){
                    this.poke.name = this.poke.name.replace("-", "");
                    return this.poke.name.substring(0, this.poke.name.length-1);
                }
                return this.poke.name;
            }
        }
    }
</script>
<style lang="" scoped>
    .card{
        float: left;
        cursor: pointer;
        border: 1px black solid;
        border-radius: 10px;
        padding: 15px;
        margin: 0px 0 20px 2.5%;
        background-color: white;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        transition: all .2s ease-in-out;
    }

    .card:hover{
        transform: scale(1.1);
    }

    .card-img{
        width: 96px;
        height: 96px;
    }

    h4{
        margin: 0px;
        margin-top: 10px;
    }
</style>