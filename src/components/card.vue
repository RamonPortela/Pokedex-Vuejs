<template>  
    <div class="card">
        <div>
            <img class="card-img" :src="imgLink"/>
        </div>
        <div>
            <h4>{{name}}</h4>
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
        computed:{
            name(){
                if(this.poke.name.endsWith("-m") || this.poke.name.endsWith("-f")){
                    this.poke.name = this.poke.name.replace("-", "");
                    return this.poke.name.substring(0, this.poke.name.length-1);
                }
                return this.poke.name;
            }
        },
        mounted(){
            this.imgLink = link + this.poke.name + ".gif"
            this.poke.imgLink = this.imgLink;
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
        width: 15%;
        margin: 0px 0 20px 2.5%;
        background-color: white;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        transition: all .2s ease-in-out;
    }

    .card:hover{
        transform: scale(1.1);
    }

    .card-img{
        width: 70px;
        height: 50px;
    }

    h4{
        margin: 0px;
        margin-top: 10px;
    }
</style>