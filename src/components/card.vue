<template>
    <div class="card col-md-2 col-xs-12 col-sm-3">
        <div>
            <img class="card-img" :src="imgLink"/>
        </div>
        <div>
            <h4>{{name | FiltroNome}}</h4>
        </div>
    </div>
</template>

<script>
    const link = "http://www.pokestadium.com/sprites/xy/";
    const linkSpecialPikachu = "http://www.pokestadium.com/sprites/xy-fan/";

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

            if(this.poke.name.includes("-x") || this.poke.name.includes("-y")){
                this.poke.name = this.poke.name.replace("-x", "x");
                this.poke.name = this.poke.name.replace("-y", "y");
            }            

            switch(this.poke.name){
                case "giratina-altered":
                    this.poke.name = "giratina";
                    break;
                case "deoxys-normal":
                    this.poke.name = "deoxys";
                    break;
                case "wormadam-plant":
                    this.poke.name = "wormadam"
                    break;
                case "basculin-red-striped":
                    this.poke.name = "basculin";
                    break;
                case "basculin-blue-striped":
                    this.poke.name = "basculin-blue";
                    break;
                case "shaymin-land":
                    this.poke.name = "shaymin";
                    break;
                case "darmanitan-standard":
                    this.poke.name = "darmanitan";
                    break;
                case "tornadus-incarnate":
                    this.poke.name = "tornadus";
                    break;
                case "thundurus-incarnate":
                    this.poke.name = "thundurus";
                    break;
                case "landorus-incarnate":
                    this.poke.name = "landorus";
                    break;
                case "keldeo-ordinary":
                    this.poke.name = "keldeo";
                    break;
                case "meloetta-aria":
                    this.poke.name = "meloetta";
                    break;
                case "meowstic-male":
                    this.poke.name = "meowstic";
                    break;
                case "aegislash-shield":
                    this.poke.name = "aegislash";
                    break;
            }

            this.imgLink = link + this.poke.name + ".gif";
            
            if(this.poke.name.includes("pikachu") && this.poke.name.length > "pikachu".length){
                this.imgLink = linkSpecialPikachu + this.poke.name + ".png";
            }            

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