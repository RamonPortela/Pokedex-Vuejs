<template>
<div>
    <div id="loading" v-if="carregando">
        <div class="pokeball" id="normal"></div>
        <div class="pokeball" id="great"></div>
        <div class="pokeball" id="ultra"></div>
        <div class="pokeball" id="master"></div>
        <div class="pokeball" id="safari"></div>
        <div class="div-carregando"><p>Carregando...</p></div>
    </div>

    <div class="holder container" v-if="pokemon != null && !carregando">
        <div class="row">
            <div class="col-md-4 col-xs-12">
                <div class="pokemon-detalhes">
                    <h1>#{{pokemon.id}} - {{pokemon.name | FiltroNome}}</h1>
                    <img :src="link+pokemon.name+'.gif'" :alt="pokemon.name">
                </div>

                <div class="div-tipo" :class="type.type.name" v-for="type in pokemon.types" v-if="type.type != null">
                    {{type.type.name}}
                </div>
            </div>

            <div class="col-md-8 col-xs-12">
                <div class="div-informacoes">
                    <h2>Informações</h2>
                    <table>
                        <tr>
                            <td>peso: {{peso}}</td>
                        </tr>
                        <tr>
                            <td>altura: {{altura}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4 col-xs-12">
                <div>
                    <h2>Habilidades</h2>
                    <table>
                        <tr v-for="habilidade in pokemon.abilities">
                            <td>{{habilidade.ability.name | FiltroNome}} <span v-show="habilidade.is_hidden">[hidden]</span></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="col-md-4 col-xs-12">
                <div>
                    <h2>Status</h2>
                    <table>
                        <tr v-for="status in pokemon.stats">
                            <td class="td-nome">{{status.stat.name | FiltroNome}}</td>
                            <td class="td-valor">{{status.base_stat}}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="col-md-4 col-xs-12">
                <div>
                    <h2>Encontrado Em</h2>
                    <div id="pikachu" v-if="carregandoLocal"></div>
                    <div id="ash" v-if="carregandoLocal"></div>

                    <table v-else>
                        <tr v-for="local in locais">
                            <td>{{local | FiltroNome}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div>
                    <h2>Evoluções</h2>
                    <div id='h' v-if="carregandoEvolucoes">
                        <div id='a'></div>
                        <div id='m'></div>
                        <div id='l'></div>
                    </div>
                    <table v-else>
                        <th class="td-nome">Evolução</th>
                        <th class="td-valor">Level</th>
                        <router-link v-for="evolucao of pokemon.evolucoes" :key="evolucao.nome" :to="{name: 'detalhes', params: {id: evolucao.id}}" tag="tr"  active-class="active" exact>
                            <td class="td-nome"><img :src="link+evolucao.nome+'.gif'" alt=""><br>{{evolucao.nome}}</td>
                            <td class="td-valor">{{evolucao.level}}</td>
                        </router-link>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <button @click="voltar" class="btn-voltar">Voltar</button>
        </div>
    </div>
</div>

</template>
<script>
    const POSICAO_ID_ENCOUTER = 6;

    export default{
        data(){
            return{
                pokemon: null,
                encontrado: null,
                carregando: false,
                carregandoLocal: false,
                carregandoEvolucoes: false,
                link: "https://www.pkparaiso.com/imagenes/xy/sprites/animados/"
            }
        },
        props:["id"],
        methods:{
            voltar(){
                this.$router.push({name: 'lista'})
            },
            PreencherEvolucoes(evolucao){

                let nivel;

                if(evolucao.evolution_details[0] != null){
                    nivel = evolucao.evolution_details[0].min_level;
                }
                else{
                    nivel = "Inicial";
                }

                let id = evolucao.species.url.split("/")[6];

                this.pokemon.evolucoes.push({nome: evolucao.species.name, level: nivel, id: id});
                if(evolucao.evolves_to.length > 0){
                    let evol = evolucao.evolves_to[0];
                    this.PreencherEvolucoes(evol);
                }
                this.carregandoEvolucoes = false;
            },
            fetchData(){
                if(this.id == null){
                    this.pokemon = null;
                }
                else{
                    let component = this;

                    this.carregando = true;
                    this.carregandoEvolucoes = true;

                    this.$http.get('pokemon/'+this.id).then(response => {
                        component.pokemon = response.data;
                        component.pokemon.evolucoes = [];
                        component.carregandoLocal = true;

                        this.$http.get('pokemon-species/'+component.pokemon.id).then(resp => {
                            component.pokemon.especie = resp.data;

                            this.$http.get('evolution-chain/'+component.pokemon.especie.evolution_chain.url.split('/')[POSICAO_ID_ENCOUTER]).then(r =>{
                                component.pokemon.detalhes_evolucao = r.data;
                                component.pokemon.evolucoes = [];
                                component.PreencherEvolucoes(component.pokemon.detalhes_evolucao.chain);
                            });
                        });

                        this.$http.get('pokemon/'+component.id+'/encounters').then(resp =>{
                            component.encontrado = resp.data;
                            component.carregandoLocal = false;
                        });
                        component.carregando = false;

                    });
                }
            }
        },
        created(){
            this.fetchData();
        },
        watch:{
            '$route': 'fetchData'
        },

        computed:{
        locais(){
              let vetor = this.encontrado.filter((local) => {

                if((local.location_area.name.includes('kanto')) || local.location_area.name.includes('sinnoh') || local.location_area.name.includes('johto') || local.location_area.name.includes('kalos')
                || local.location_area.name.includes('alola') || local.location_area.name.includes('unova') || local.location_area.name.includes('hoenn')){
                    let posicao;

                    posicao = local.location_area.name.indexOf("-");

                    local.location_area.name = local.location_area.name.substring(0, posicao);

                    return local.location_area.name;
                }
          });

              let setLocais = new Set();

              for(let local of vetor){
                  setLocais.add(local.location_area.name);
              }

              let vetorLocais = [];

              for(let local of setLocais){
                  vetorLocais.push(local);
              }

              if(vetorLocais.length == 0){
                  vetorLocais.push("Este pokemon não pode ser encontrado normalmente.")
              }

              return vetorLocais;
          },

          altura(){
              return (this.pokemon.height / 10) + "m";
          },

          peso(){
              return (this.pokemon.weight / 10) + "kg";
          }
        }
    }
</script>
<style scoped>

    h1{
        margin: 0;
    }

    hr{
        width: 255px;
    }

    tr{
        border-bottom: 1px solid #adc2bf;
        border-top: 1px solid #adc2bf;
    }

    th{
        width: 100%
    }

    table {
        border-collapse: collapse;
        margin:auto;
        width: 100%;
    }

    .td-nome{
        width: 65%;
        text-align: left;
    }

    .td-valor{
        text-align: center;
    }

    .holder{
        background: white;
        padding: 15px;
        border-radius: 15px;
        margin: auto;
        border: 1px solid black;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    }

    .div-tipo{
        border-radius: 30px;
        width: 93px;
        padding: 2px;
        color: white;
        font-weight: 600;
        background-clip: border-box;
        box-shadow: 1px 1px 1px black;
        display: inline-block;
        margin-left: 5px;
        cursor: default;
        margin-top: 10px;
    }

    .pokemon-detalhes{
        padding: 10px 0 10px 0
    }

    .btn-voltar{
        border-radius: 5px;
        border: none !important;
        font-family: Arial;
        color: #ffffff;
        font-size: 14px;
        background: #3498db;
        padding: 5px 20px 5px 20px;
        text-decoration: none;
        cursor: pointer;
        margin-top: 15px;
    }

    .btn-voltar:hover{
        background: #3081bb;
    }

    .div-informacoes{
        margin-top: 10px;
    }

    .active{
        background-color: beige;
    }

    .fire{
        background-color: #f95343;
    }
    .normal{
        background-color: #BCBCAF;
    }
    .poison{
        background-color: #AB5EA2;
    }
    .psychic{
        background-color: #fa5489;
    }
    .grass{
        background-color: #8CD751;
    }
    .ground{
        background-color: #EDCB56;
    }
    .ice{
        background-color: #96F1FF;
    }
    .rock{
        background-color: #CDBD72;
    }
    .dragon{
        background-color: #993aff;
    }
    .water{
        background-color: #56AEFF;
    }
    .bug{
        background-color: #C3D21F;
    }
    .dark{
        background-color: #8F6956;
    }
    .fighting{
        background-color: #A85645;
    }
    .ghost{
        background-color: #7874D6;
    }
    .steel{
        background-color: #C3C2D8;
    }
    .flying{
        background-color: #79A4FF;
    }
    .electric{
        background-color: #FDE53C;
    }
    .fairy{
        background-color: #ffb0c5;
    }

    /* Black and white, like the old days */
    /* In HD colors ;) */
    /*
    $ash-line: #181818;
    $ash-hat: #e31613;
    $ash-hat-front: #f7f7f7;
    $ash-face: #f0c3aa;
    $ash-mouth: #f0c3aa;
    $ash-backpack: #037efb;
    $ash-hand: #f0c3aa;
    $ash-pants: #ffffff;
    $ash-shoes: #ffffff;

    $pikachu-line: #181818;
    $pikachu-body: #fefe00;
    $pikachu-cheeck: #fe4100;
    $pikachu-tail: #823e00;
    */

    #ash,
    #pikachu {
        position: relative;
        display: inline-block;
        margin: 0 10px;
        overflow: hidden;
    }
    #ash:before, #ash:after,
    #pikachu:before,
    #pikachu:after {
        content: " ";
        position: absolute;
        width: 4px;
        height: 4px;
        top: 0;
        left: 0;
    }
    #ash:before,
    #pikachu:before {
        margin-left: 120px;
    }

    #ash {
        width: 52px;
        height: 64px;
    }
    #ash:before {
        -moz-box-shadow: 12px 4px 0 0 #181818, 16px 4px 0 0 #181818, 20px 4px 0 0 #181818, 24px 4px 0 0 #181818, 28px 4px 0 0 #181818, 32px 4px 0 0 #181818, 8px 8px 0 0 #181818, 12px 8px 0 0 #cdcdcd, 16px 8px 0 0 #cdcdcd, 20px 8px 0 0 #cdcdcd, 24px 8px 0 0 #cdcdcd, 28px 8px 0 0 #cdcdcd, 32px 8px 0 0 #cdcdcd, 36px 8px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #cdcdcd, 12px 12px 0 0 #cdcdcd, 16px 12px 0 0 #cdcdcd, 20px 12px 0 0 #cdcdcd, 24px 12px 0 0 #cdcdcd, 28px 12px 0 0 #cdcdcd, 32px 12px 0 0 #cdcdcd, 36px 12px 0 0 #cdcdcd, 40px 12px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #cdcdcd, 12px 16px 0 0 #cdcdcd, 16px 16px 0 0 #cdcdcd, 20px 16px 0 0 #cdcdcd, 24px 16px 0 0 #cdcdcd, 28px 16px 0 0 #cdcdcd, 32px 16px 0 0 #cdcdcd, 36px 16px 0 0 #f9f9f9, 40px 16px 0 0 #181818, 44px 16px 0 0 #181818, 0 20px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #cdcdcd, 16px 20px 0 0 #cdcdcd, 20px 20px 0 0 #cdcdcd, 24px 20px 0 0 #cdcdcd, 28px 20px 0 0 #cdcdcd, 32px 20px 0 0 #f9f9f9, 36px 20px 0 0 #f9f9f9, 40px 20px 0 0 #f9f9f9, 44px 20px 0 0 #f9f9f9, 48px 20px 0 0 #181818, 0 24px 0 0 #181818, 4px 24px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #181818, 20px 24px 0 0 #181818, 24px 24px 0 0 #181818, 28px 24px 0 0 #cdcdcd, 32px 24px 0 0 #cdcdcd, 36px 24px 0 0 #cdcdcd, 40px 24px 0 0 #181818, 44px 24px 0 0 #181818, 0 28px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #181818, 20px 28px 0 0 #181818, 24px 28px 0 0 #fdfdfd, 28px 28px 0 0 #fdfdfd, 32px 28px 0 0 #181818, 36px 28px 0 0 #fdfdfd, 40px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #fdfdfd, 16px 32px 0 0 #fdfdfd, 20px 32px 0 0 #181818, 24px 32px 0 0 #fdfdfd, 28px 32px 0 0 #fdfdfd, 32px 32px 0 0 #181818, 36px 32px 0 0 #fdfdfd, 40px 32px 0 0 #181818, 8px 36px 0 0 #181818, 12px 36px 0 0 #fdfdfd, 16px 36px 0 0 #fdfdfd, 20px 36px 0 0 #fdfdfd, 24px 36px 0 0 #fdfdfd, 28px 36px 0 0 #fdfdfd, 32px 36px 0 0 #fdfdfd, 36px 36px 0 0 #fdfdfd, 40px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #cdcdcd, 12px 40px 0 0 #181818, 16px 40px 0 0 #181818, 20px 40px 0 0 #fdfdfd, 24px 40px 0 0 #fdfdfd, 28px 40px 0 0 #fdfdfd, 32px 40px 0 0 #cdcdcd, 36px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #cdcdcd, 12px 44px 0 0 #181818, 16px 44px 0 0 #181818, 20px 44px 0 0 #181818, 24px 44px 0 0 #181818, 28px 44px 0 0 #181818, 32px 44px 0 0 #181818, 4px 48px 0 0 #181818, 8px 48px 0 0 #181818, 12px 48px 0 0 #fdfdfd, 16px 48px 0 0 #fdfdfd, 20px 48px 0 0 #181818, 24px 48px 0 0 #181818, 28px 48px 0 0 #181818, 32px 48px 0 0 #181818, 36px 48px 0 0 #181818, 40px 48px 0 0 #181818, 0 52px 0 0 #181818, 4px 52px 0 0 #cdcdcd, 8px 52px 0 0 #181818, 12px 52px 0 0 #fdfdfd, 16px 52px 0 0 #fdfdfd, 20px 52px 0 0 #181818, 24px 52px 0 0 #cdcdcd, 28px 52px 0 0 #cdcdcd, 32px 52px 0 0 #181818, 36px 52px 0 0 #cdcdcd, 40px 52px 0 0 #cdcdcd, 44px 52px 0 0 #181818, 0 56px 0 0 #181818, 4px 56px 0 0 #cdcdcd, 8px 56px 0 0 #cdcdcd, 12px 56px 0 0 #181818, 16px 56px 0 0 #181818, 20px 56px 0 0 #181818, 24px 56px 0 0 #181818, 28px 56px 0 0 #181818, 32px 56px 0 0 #cdcdcd, 36px 56px 0 0 #cdcdcd, 40px 56px 0 0 #181818, 4px 60px 0 0 #181818, 8px 60px 0 0 #181818, 28px 60px 0 0 #181818, 32px 60px 0 0 #181818, 36px 60px 0 0 #181818;
        -webkit-box-shadow: 12px 4px 0 0 #181818, 16px 4px 0 0 #181818, 20px 4px 0 0 #181818, 24px 4px 0 0 #181818, 28px 4px 0 0 #181818, 32px 4px 0 0 #181818, 8px 8px 0 0 #181818, 12px 8px 0 0 #cdcdcd, 16px 8px 0 0 #cdcdcd, 20px 8px 0 0 #cdcdcd, 24px 8px 0 0 #cdcdcd, 28px 8px 0 0 #cdcdcd, 32px 8px 0 0 #cdcdcd, 36px 8px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #cdcdcd, 12px 12px 0 0 #cdcdcd, 16px 12px 0 0 #cdcdcd, 20px 12px 0 0 #cdcdcd, 24px 12px 0 0 #cdcdcd, 28px 12px 0 0 #cdcdcd, 32px 12px 0 0 #cdcdcd, 36px 12px 0 0 #cdcdcd, 40px 12px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #cdcdcd, 12px 16px 0 0 #cdcdcd, 16px 16px 0 0 #cdcdcd, 20px 16px 0 0 #cdcdcd, 24px 16px 0 0 #cdcdcd, 28px 16px 0 0 #cdcdcd, 32px 16px 0 0 #cdcdcd, 36px 16px 0 0 #f9f9f9, 40px 16px 0 0 #181818, 44px 16px 0 0 #181818, 0 20px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #cdcdcd, 16px 20px 0 0 #cdcdcd, 20px 20px 0 0 #cdcdcd, 24px 20px 0 0 #cdcdcd, 28px 20px 0 0 #cdcdcd, 32px 20px 0 0 #f9f9f9, 36px 20px 0 0 #f9f9f9, 40px 20px 0 0 #f9f9f9, 44px 20px 0 0 #f9f9f9, 48px 20px 0 0 #181818, 0 24px 0 0 #181818, 4px 24px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #181818, 20px 24px 0 0 #181818, 24px 24px 0 0 #181818, 28px 24px 0 0 #cdcdcd, 32px 24px 0 0 #cdcdcd, 36px 24px 0 0 #cdcdcd, 40px 24px 0 0 #181818, 44px 24px 0 0 #181818, 0 28px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #181818, 20px 28px 0 0 #181818, 24px 28px 0 0 #fdfdfd, 28px 28px 0 0 #fdfdfd, 32px 28px 0 0 #181818, 36px 28px 0 0 #fdfdfd, 40px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #fdfdfd, 16px 32px 0 0 #fdfdfd, 20px 32px 0 0 #181818, 24px 32px 0 0 #fdfdfd, 28px 32px 0 0 #fdfdfd, 32px 32px 0 0 #181818, 36px 32px 0 0 #fdfdfd, 40px 32px 0 0 #181818, 8px 36px 0 0 #181818, 12px 36px 0 0 #fdfdfd, 16px 36px 0 0 #fdfdfd, 20px 36px 0 0 #fdfdfd, 24px 36px 0 0 #fdfdfd, 28px 36px 0 0 #fdfdfd, 32px 36px 0 0 #fdfdfd, 36px 36px 0 0 #fdfdfd, 40px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #cdcdcd, 12px 40px 0 0 #181818, 16px 40px 0 0 #181818, 20px 40px 0 0 #fdfdfd, 24px 40px 0 0 #fdfdfd, 28px 40px 0 0 #fdfdfd, 32px 40px 0 0 #cdcdcd, 36px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #cdcdcd, 12px 44px 0 0 #181818, 16px 44px 0 0 #181818, 20px 44px 0 0 #181818, 24px 44px 0 0 #181818, 28px 44px 0 0 #181818, 32px 44px 0 0 #181818, 4px 48px 0 0 #181818, 8px 48px 0 0 #181818, 12px 48px 0 0 #fdfdfd, 16px 48px 0 0 #fdfdfd, 20px 48px 0 0 #181818, 24px 48px 0 0 #181818, 28px 48px 0 0 #181818, 32px 48px 0 0 #181818, 36px 48px 0 0 #181818, 40px 48px 0 0 #181818, 0 52px 0 0 #181818, 4px 52px 0 0 #cdcdcd, 8px 52px 0 0 #181818, 12px 52px 0 0 #fdfdfd, 16px 52px 0 0 #fdfdfd, 20px 52px 0 0 #181818, 24px 52px 0 0 #cdcdcd, 28px 52px 0 0 #cdcdcd, 32px 52px 0 0 #181818, 36px 52px 0 0 #cdcdcd, 40px 52px 0 0 #cdcdcd, 44px 52px 0 0 #181818, 0 56px 0 0 #181818, 4px 56px 0 0 #cdcdcd, 8px 56px 0 0 #cdcdcd, 12px 56px 0 0 #181818, 16px 56px 0 0 #181818, 20px 56px 0 0 #181818, 24px 56px 0 0 #181818, 28px 56px 0 0 #181818, 32px 56px 0 0 #cdcdcd, 36px 56px 0 0 #cdcdcd, 40px 56px 0 0 #181818, 4px 60px 0 0 #181818, 8px 60px 0 0 #181818, 28px 60px 0 0 #181818, 32px 60px 0 0 #181818, 36px 60px 0 0 #181818;
        box-shadow: 12px 4px 0 0 #181818, 16px 4px 0 0 #181818, 20px 4px 0 0 #181818, 24px 4px 0 0 #181818, 28px 4px 0 0 #181818, 32px 4px 0 0 #181818, 8px 8px 0 0 #181818, 12px 8px 0 0 #cdcdcd, 16px 8px 0 0 #cdcdcd, 20px 8px 0 0 #cdcdcd, 24px 8px 0 0 #cdcdcd, 28px 8px 0 0 #cdcdcd, 32px 8px 0 0 #cdcdcd, 36px 8px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #cdcdcd, 12px 12px 0 0 #cdcdcd, 16px 12px 0 0 #cdcdcd, 20px 12px 0 0 #cdcdcd, 24px 12px 0 0 #cdcdcd, 28px 12px 0 0 #cdcdcd, 32px 12px 0 0 #cdcdcd, 36px 12px 0 0 #cdcdcd, 40px 12px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #cdcdcd, 12px 16px 0 0 #cdcdcd, 16px 16px 0 0 #cdcdcd, 20px 16px 0 0 #cdcdcd, 24px 16px 0 0 #cdcdcd, 28px 16px 0 0 #cdcdcd, 32px 16px 0 0 #cdcdcd, 36px 16px 0 0 #f9f9f9, 40px 16px 0 0 #181818, 44px 16px 0 0 #181818, 0 20px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #cdcdcd, 16px 20px 0 0 #cdcdcd, 20px 20px 0 0 #cdcdcd, 24px 20px 0 0 #cdcdcd, 28px 20px 0 0 #cdcdcd, 32px 20px 0 0 #f9f9f9, 36px 20px 0 0 #f9f9f9, 40px 20px 0 0 #f9f9f9, 44px 20px 0 0 #f9f9f9, 48px 20px 0 0 #181818, 0 24px 0 0 #181818, 4px 24px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #181818, 20px 24px 0 0 #181818, 24px 24px 0 0 #181818, 28px 24px 0 0 #cdcdcd, 32px 24px 0 0 #cdcdcd, 36px 24px 0 0 #cdcdcd, 40px 24px 0 0 #181818, 44px 24px 0 0 #181818, 0 28px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #181818, 20px 28px 0 0 #181818, 24px 28px 0 0 #fdfdfd, 28px 28px 0 0 #fdfdfd, 32px 28px 0 0 #181818, 36px 28px 0 0 #fdfdfd, 40px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #fdfdfd, 16px 32px 0 0 #fdfdfd, 20px 32px 0 0 #181818, 24px 32px 0 0 #fdfdfd, 28px 32px 0 0 #fdfdfd, 32px 32px 0 0 #181818, 36px 32px 0 0 #fdfdfd, 40px 32px 0 0 #181818, 8px 36px 0 0 #181818, 12px 36px 0 0 #fdfdfd, 16px 36px 0 0 #fdfdfd, 20px 36px 0 0 #fdfdfd, 24px 36px 0 0 #fdfdfd, 28px 36px 0 0 #fdfdfd, 32px 36px 0 0 #fdfdfd, 36px 36px 0 0 #fdfdfd, 40px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #cdcdcd, 12px 40px 0 0 #181818, 16px 40px 0 0 #181818, 20px 40px 0 0 #fdfdfd, 24px 40px 0 0 #fdfdfd, 28px 40px 0 0 #fdfdfd, 32px 40px 0 0 #cdcdcd, 36px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #cdcdcd, 12px 44px 0 0 #181818, 16px 44px 0 0 #181818, 20px 44px 0 0 #181818, 24px 44px 0 0 #181818, 28px 44px 0 0 #181818, 32px 44px 0 0 #181818, 4px 48px 0 0 #181818, 8px 48px 0 0 #181818, 12px 48px 0 0 #fdfdfd, 16px 48px 0 0 #fdfdfd, 20px 48px 0 0 #181818, 24px 48px 0 0 #181818, 28px 48px 0 0 #181818, 32px 48px 0 0 #181818, 36px 48px 0 0 #181818, 40px 48px 0 0 #181818, 0 52px 0 0 #181818, 4px 52px 0 0 #cdcdcd, 8px 52px 0 0 #181818, 12px 52px 0 0 #fdfdfd, 16px 52px 0 0 #fdfdfd, 20px 52px 0 0 #181818, 24px 52px 0 0 #cdcdcd, 28px 52px 0 0 #cdcdcd, 32px 52px 0 0 #181818, 36px 52px 0 0 #cdcdcd, 40px 52px 0 0 #cdcdcd, 44px 52px 0 0 #181818, 0 56px 0 0 #181818, 4px 56px 0 0 #cdcdcd, 8px 56px 0 0 #cdcdcd, 12px 56px 0 0 #181818, 16px 56px 0 0 #181818, 20px 56px 0 0 #181818, 24px 56px 0 0 #181818, 28px 56px 0 0 #181818, 32px 56px 0 0 #cdcdcd, 36px 56px 0 0 #cdcdcd, 40px 56px 0 0 #181818, 4px 60px 0 0 #181818, 8px 60px 0 0 #181818, 28px 60px 0 0 #181818, 32px 60px 0 0 #181818, 36px 60px 0 0 #181818;
    }
    #ash:after {
        -moz-box-shadow: 12px 0 0 0 #181818, 16px 0 0 0 #181818, 20px 0 0 0 #181818, 24px 0 0 0 #181818, 28px 0 0 0 #181818, 32px 0 0 0 #181818, 8px 4px 0 0 #181818, 12px 4px 0 0 #cdcdcd, 16px 4px 0 0 #cdcdcd, 20px 4px 0 0 #cdcdcd, 24px 4px 0 0 #cdcdcd, 28px 4px 0 0 #cdcdcd, 32px 4px 0 0 #cdcdcd, 36px 4px 0 0 #181818, 4px 8px 0 0 #181818, 8px 8px 0 0 #cdcdcd, 12px 8px 0 0 #cdcdcd, 16px 8px 0 0 #cdcdcd, 20px 8px 0 0 #cdcdcd, 24px 8px 0 0 #cdcdcd, 28px 8px 0 0 #cdcdcd, 32px 8px 0 0 #cdcdcd, 36px 8px 0 0 #cdcdcd, 40px 8px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #cdcdcd, 12px 12px 0 0 #cdcdcd, 16px 12px 0 0 #cdcdcd, 20px 12px 0 0 #cdcdcd, 24px 12px 0 0 #cdcdcd, 28px 12px 0 0 #cdcdcd, 32px 12px 0 0 #cdcdcd, 36px 12px 0 0 #f9f9f9, 40px 12px 0 0 #181818, 44px 12px 0 0 #181818, 0 16px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #181818, 12px 16px 0 0 #cdcdcd, 16px 16px 0 0 #cdcdcd, 20px 16px 0 0 #cdcdcd, 24px 16px 0 0 #cdcdcd, 28px 16px 0 0 #cdcdcd, 32px 16px 0 0 #f9f9f9, 36px 16px 0 0 #f9f9f9, 40px 16px 0 0 #f9f9f9, 44px 16px 0 0 #f9f9f9, 48px 16px 0 0 #181818, 0 20px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #181818, 16px 20px 0 0 #181818, 20px 20px 0 0 #181818, 24px 20px 0 0 #181818, 28px 20px 0 0 #cdcdcd, 32px 20px 0 0 #cdcdcd, 36px 20px 0 0 #cdcdcd, 40px 20px 0 0 #181818, 44px 20px 0 0 #181818, 0 24px 0 0 #181818, 4px 24px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #181818, 20px 24px 0 0 #181818, 24px 24px 0 0 #fdfdfd, 28px 24px 0 0 #fdfdfd, 32px 24px 0 0 #181818, 36px 24px 0 0 #fdfdfd, 40px 24px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #fdfdfd, 16px 28px 0 0 #fdfdfd, 20px 28px 0 0 #181818, 24px 28px 0 0 #fdfdfd, 28px 28px 0 0 #fdfdfd, 32px 28px 0 0 #181818, 36px 28px 0 0 #fdfdfd, 40px 28px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #fdfdfd, 16px 32px 0 0 #fdfdfd, 20px 32px 0 0 #fdfdfd, 24px 32px 0 0 #fdfdfd, 28px 32px 0 0 #fdfdfd, 32px 32px 0 0 #fdfdfd, 36px 32px 0 0 #fdfdfd, 40px 32px 0 0 #181818, 4px 36px 0 0 #181818, 8px 36px 0 0 #cdcdcd, 12px 36px 0 0 #181818, 16px 36px 0 0 #181818, 20px 36px 0 0 #fdfdfd, 24px 36px 0 0 #fdfdfd, 28px 36px 0 0 #fdfdfd, 32px 36px 0 0 #cdcdcd, 36px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #cdcdcd, 12px 40px 0 0 #cdcdcd, 16px 40px 0 0 #181818, 20px 40px 0 0 #181818, 24px 40px 0 0 #181818, 28px 40px 0 0 #181818, 32px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #cdcdcd, 12px 44px 0 0 #181818, 16px 44px 0 0 #fdfdfd, 20px 44px 0 0 #fdfdfd, 24px 44px 0 0 #181818, 28px 44px 0 0 #181818, 4px 48px 0 0 #181818, 8px 48px 0 0 #cdcdcd, 12px 48px 0 0 #181818, 16px 48px 0 0 #fdfdfd, 20px 48px 0 0 #fdfdfd, 24px 48px 0 0 #181818, 28px 48px 0 0 #181818, 8px 52px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #181818, 20px 52px 0 0 #181818, 24px 52px 0 0 #cdcdcd, 28px 52px 0 0 #cdcdcd, 32px 52px 0 0 #181818, 12px 56px 0 0 #181818, 16px 56px 0 0 #cdcdcd, 20px 56px 0 0 #cdcdcd, 24px 56px 0 0 #cdcdcd, 28px 56px 0 0 #cdcdcd, 32px 56px 0 0 #181818, 16px 60px 0 0 #181818, 20px 60px 0 0 #181818, 24px 60px 0 0 #181818, 28px 60px 0 0 #181818;
        -webkit-box-shadow: 12px 0 0 0 #181818, 16px 0 0 0 #181818, 20px 0 0 0 #181818, 24px 0 0 0 #181818, 28px 0 0 0 #181818, 32px 0 0 0 #181818, 8px 4px 0 0 #181818, 12px 4px 0 0 #cdcdcd, 16px 4px 0 0 #cdcdcd, 20px 4px 0 0 #cdcdcd, 24px 4px 0 0 #cdcdcd, 28px 4px 0 0 #cdcdcd, 32px 4px 0 0 #cdcdcd, 36px 4px 0 0 #181818, 4px 8px 0 0 #181818, 8px 8px 0 0 #cdcdcd, 12px 8px 0 0 #cdcdcd, 16px 8px 0 0 #cdcdcd, 20px 8px 0 0 #cdcdcd, 24px 8px 0 0 #cdcdcd, 28px 8px 0 0 #cdcdcd, 32px 8px 0 0 #cdcdcd, 36px 8px 0 0 #cdcdcd, 40px 8px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #cdcdcd, 12px 12px 0 0 #cdcdcd, 16px 12px 0 0 #cdcdcd, 20px 12px 0 0 #cdcdcd, 24px 12px 0 0 #cdcdcd, 28px 12px 0 0 #cdcdcd, 32px 12px 0 0 #cdcdcd, 36px 12px 0 0 #f9f9f9, 40px 12px 0 0 #181818, 44px 12px 0 0 #181818, 0 16px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #181818, 12px 16px 0 0 #cdcdcd, 16px 16px 0 0 #cdcdcd, 20px 16px 0 0 #cdcdcd, 24px 16px 0 0 #cdcdcd, 28px 16px 0 0 #cdcdcd, 32px 16px 0 0 #f9f9f9, 36px 16px 0 0 #f9f9f9, 40px 16px 0 0 #f9f9f9, 44px 16px 0 0 #f9f9f9, 48px 16px 0 0 #181818, 0 20px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #181818, 16px 20px 0 0 #181818, 20px 20px 0 0 #181818, 24px 20px 0 0 #181818, 28px 20px 0 0 #cdcdcd, 32px 20px 0 0 #cdcdcd, 36px 20px 0 0 #cdcdcd, 40px 20px 0 0 #181818, 44px 20px 0 0 #181818, 0 24px 0 0 #181818, 4px 24px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #181818, 20px 24px 0 0 #181818, 24px 24px 0 0 #fdfdfd, 28px 24px 0 0 #fdfdfd, 32px 24px 0 0 #181818, 36px 24px 0 0 #fdfdfd, 40px 24px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #fdfdfd, 16px 28px 0 0 #fdfdfd, 20px 28px 0 0 #181818, 24px 28px 0 0 #fdfdfd, 28px 28px 0 0 #fdfdfd, 32px 28px 0 0 #181818, 36px 28px 0 0 #fdfdfd, 40px 28px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #fdfdfd, 16px 32px 0 0 #fdfdfd, 20px 32px 0 0 #fdfdfd, 24px 32px 0 0 #fdfdfd, 28px 32px 0 0 #fdfdfd, 32px 32px 0 0 #fdfdfd, 36px 32px 0 0 #fdfdfd, 40px 32px 0 0 #181818, 4px 36px 0 0 #181818, 8px 36px 0 0 #cdcdcd, 12px 36px 0 0 #181818, 16px 36px 0 0 #181818, 20px 36px 0 0 #fdfdfd, 24px 36px 0 0 #fdfdfd, 28px 36px 0 0 #fdfdfd, 32px 36px 0 0 #cdcdcd, 36px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #cdcdcd, 12px 40px 0 0 #cdcdcd, 16px 40px 0 0 #181818, 20px 40px 0 0 #181818, 24px 40px 0 0 #181818, 28px 40px 0 0 #181818, 32px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #cdcdcd, 12px 44px 0 0 #181818, 16px 44px 0 0 #fdfdfd, 20px 44px 0 0 #fdfdfd, 24px 44px 0 0 #181818, 28px 44px 0 0 #181818, 4px 48px 0 0 #181818, 8px 48px 0 0 #cdcdcd, 12px 48px 0 0 #181818, 16px 48px 0 0 #fdfdfd, 20px 48px 0 0 #fdfdfd, 24px 48px 0 0 #181818, 28px 48px 0 0 #181818, 8px 52px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #181818, 20px 52px 0 0 #181818, 24px 52px 0 0 #cdcdcd, 28px 52px 0 0 #cdcdcd, 32px 52px 0 0 #181818, 12px 56px 0 0 #181818, 16px 56px 0 0 #cdcdcd, 20px 56px 0 0 #cdcdcd, 24px 56px 0 0 #cdcdcd, 28px 56px 0 0 #cdcdcd, 32px 56px 0 0 #181818, 16px 60px 0 0 #181818, 20px 60px 0 0 #181818, 24px 60px 0 0 #181818, 28px 60px 0 0 #181818;
        box-shadow: 12px 0 0 0 #181818, 16px 0 0 0 #181818, 20px 0 0 0 #181818, 24px 0 0 0 #181818, 28px 0 0 0 #181818, 32px 0 0 0 #181818, 8px 4px 0 0 #181818, 12px 4px 0 0 #cdcdcd, 16px 4px 0 0 #cdcdcd, 20px 4px 0 0 #cdcdcd, 24px 4px 0 0 #cdcdcd, 28px 4px 0 0 #cdcdcd, 32px 4px 0 0 #cdcdcd, 36px 4px 0 0 #181818, 4px 8px 0 0 #181818, 8px 8px 0 0 #cdcdcd, 12px 8px 0 0 #cdcdcd, 16px 8px 0 0 #cdcdcd, 20px 8px 0 0 #cdcdcd, 24px 8px 0 0 #cdcdcd, 28px 8px 0 0 #cdcdcd, 32px 8px 0 0 #cdcdcd, 36px 8px 0 0 #cdcdcd, 40px 8px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #cdcdcd, 12px 12px 0 0 #cdcdcd, 16px 12px 0 0 #cdcdcd, 20px 12px 0 0 #cdcdcd, 24px 12px 0 0 #cdcdcd, 28px 12px 0 0 #cdcdcd, 32px 12px 0 0 #cdcdcd, 36px 12px 0 0 #f9f9f9, 40px 12px 0 0 #181818, 44px 12px 0 0 #181818, 0 16px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #181818, 12px 16px 0 0 #cdcdcd, 16px 16px 0 0 #cdcdcd, 20px 16px 0 0 #cdcdcd, 24px 16px 0 0 #cdcdcd, 28px 16px 0 0 #cdcdcd, 32px 16px 0 0 #f9f9f9, 36px 16px 0 0 #f9f9f9, 40px 16px 0 0 #f9f9f9, 44px 16px 0 0 #f9f9f9, 48px 16px 0 0 #181818, 0 20px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #181818, 16px 20px 0 0 #181818, 20px 20px 0 0 #181818, 24px 20px 0 0 #181818, 28px 20px 0 0 #cdcdcd, 32px 20px 0 0 #cdcdcd, 36px 20px 0 0 #cdcdcd, 40px 20px 0 0 #181818, 44px 20px 0 0 #181818, 0 24px 0 0 #181818, 4px 24px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #181818, 20px 24px 0 0 #181818, 24px 24px 0 0 #fdfdfd, 28px 24px 0 0 #fdfdfd, 32px 24px 0 0 #181818, 36px 24px 0 0 #fdfdfd, 40px 24px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #fdfdfd, 16px 28px 0 0 #fdfdfd, 20px 28px 0 0 #181818, 24px 28px 0 0 #fdfdfd, 28px 28px 0 0 #fdfdfd, 32px 28px 0 0 #181818, 36px 28px 0 0 #fdfdfd, 40px 28px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #fdfdfd, 16px 32px 0 0 #fdfdfd, 20px 32px 0 0 #fdfdfd, 24px 32px 0 0 #fdfdfd, 28px 32px 0 0 #fdfdfd, 32px 32px 0 0 #fdfdfd, 36px 32px 0 0 #fdfdfd, 40px 32px 0 0 #181818, 4px 36px 0 0 #181818, 8px 36px 0 0 #cdcdcd, 12px 36px 0 0 #181818, 16px 36px 0 0 #181818, 20px 36px 0 0 #fdfdfd, 24px 36px 0 0 #fdfdfd, 28px 36px 0 0 #fdfdfd, 32px 36px 0 0 #cdcdcd, 36px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #cdcdcd, 12px 40px 0 0 #cdcdcd, 16px 40px 0 0 #181818, 20px 40px 0 0 #181818, 24px 40px 0 0 #181818, 28px 40px 0 0 #181818, 32px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #cdcdcd, 12px 44px 0 0 #181818, 16px 44px 0 0 #fdfdfd, 20px 44px 0 0 #fdfdfd, 24px 44px 0 0 #181818, 28px 44px 0 0 #181818, 4px 48px 0 0 #181818, 8px 48px 0 0 #cdcdcd, 12px 48px 0 0 #181818, 16px 48px 0 0 #fdfdfd, 20px 48px 0 0 #fdfdfd, 24px 48px 0 0 #181818, 28px 48px 0 0 #181818, 8px 52px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #181818, 20px 52px 0 0 #181818, 24px 52px 0 0 #cdcdcd, 28px 52px 0 0 #cdcdcd, 32px 52px 0 0 #181818, 12px 56px 0 0 #181818, 16px 56px 0 0 #cdcdcd, 20px 56px 0 0 #cdcdcd, 24px 56px 0 0 #cdcdcd, 28px 56px 0 0 #cdcdcd, 32px 56px 0 0 #181818, 16px 60px 0 0 #181818, 20px 60px 0 0 #181818, 24px 60px 0 0 #181818, 28px 60px 0 0 #181818;
    }

    #pikachu {
        width: 60px;
        height: 64px;
    }
    #pikachu:before {
        -moz-box-shadow: 16px 4px 0 0 #181818, 20px 4px 0 0 #181818, 0 8px 0 0 #181818, 4px 8px 0 0 #181818, 8px 8px 0 0 #181818, 12px 8px 0 0 #181818, 16px 8px 0 0 #181818, 20px 8px 0 0 #181818, 24px 8px 0 0 #181818, 28px 8px 0 0 #181818, 32px 8px 0 0 #181818, 0 12px 0 0 #181818, 4px 12px 0 0 #f8f8f8, 8px 12px 0 0 #f8f8f8, 12px 12px 0 0 #f8f8f8, 16px 12px 0 0 #181818, 20px 12px 0 0 #181818, 24px 12px 0 0 #181818, 28px 12px 0 0 #f8f8f8, 32px 12px 0 0 #f8f8f8, 36px 12px 0 0 #181818, 40px 12px 0 0 #181818, 44px 12px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #f8f8f8, 12px 16px 0 0 #f8f8f8, 16px 16px 0 0 #f8f8f8, 20px 16px 0 0 #181818, 24px 16px 0 0 #f8f8f8, 28px 16px 0 0 #f8f8f8, 32px 16px 0 0 #f8f8f8, 36px 16px 0 0 #f8f8f8, 40px 16px 0 0 #f8f8f8, 44px 16px 0 0 #f8f8f8, 48px 16px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #f8f8f8, 16px 20px 0 0 #f8f8f8, 20px 20px 0 0 #181818, 24px 20px 0 0 #181818, 28px 20px 0 0 #f8f8f8, 32px 20px 0 0 #f8f8f8, 36px 20px 0 0 #f8f8f8, 40px 20px 0 0 #f8f8f8, 44px 20px 0 0 #f8f8f8, 48px 20px 0 0 #f8f8f8, 52px 20px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #f8f8f8, 20px 24px 0 0 #f8f8f8, 24px 24px 0 0 #181818, 28px 24px 0 0 #f8f8f8, 32px 24px 0 0 #f8f8f8, 36px 24px 0 0 #f8f8f8, 40px 24px 0 0 #f8f8f8, 44px 24px 0 0 #f8f8f8, 48px 24px 0 0 #f8f8f8, 52px 24px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #f8f8f8, 20px 28px 0 0 #181818, 24px 28px 0 0 #f8f8f8, 28px 28px 0 0 #f8f8f8, 32px 28px 0 0 #f8f8f8, 36px 28px 0 0 #f8f8f8, 40px 28px 0 0 #f8f8f8, 44px 28px 0 0 #181818, 48px 28px 0 0 #f8f8f8, 52px 28px 0 0 #f8f8f8, 56px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #f8f8f8, 12px 32px 0 0 #f8f8f8, 16px 32px 0 0 #181818, 20px 32px 0 0 #181818, 24px 32px 0 0 #f8f8f8, 28px 32px 0 0 #f8f8f8, 32px 32px 0 0 #f8f8f8, 36px 32px 0 0 #c0c0c0, 40px 32px 0 0 #f8f8f8, 44px 32px 0 0 #f8f8f8, 48px 32px 0 0 #f8f8f8, 52px 32px 0 0 #f8f8f8, 56px 32px 0 0 #181818, 8px 36px 0 0 #181818, 12px 36px 0 0 #c0c0c0, 16px 36px 0 0 #181818, 20px 36px 0 0 #c0c0c0, 24px 36px 0 0 #c0c0c0, 28px 36px 0 0 #c0c0c0, 32px 36px 0 0 #f8f8f8, 36px 36px 0 0 #f8f8f8, 40px 36px 0 0 #f8f8f8, 44px 36px 0 0 #f8f8f8, 48px 36px 0 0 #f8f8f8, 52px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #c0c0c0, 12px 40px 0 0 #c0c0c0, 16px 40px 0 0 #181818, 20px 40px 0 0 #f8f8f8, 24px 40px 0 0 #f8f8f8, 28px 40px 0 0 #f8f8f8, 32px 40px 0 0 #f8f8f8, 36px 40px 0 0 #f8f8f8, 40px 40px 0 0 #f8f8f8, 44px 40px 0 0 #181818, 48px 40px 0 0 #f8f8f8, 52px 40px 0 0 #181818, 8px 44px 0 0 #181818, 12px 44px 0 0 #c0c0c0, 16px 44px 0 0 #181818, 20px 44px 0 0 #c0c0c0, 24px 44px 0 0 #c0c0c0, 28px 44px 0 0 #c0c0c0, 32px 44px 0 0 #f8f8f8, 36px 44px 0 0 #f8f8f8, 40px 44px 0 0 #181818, 44px 44px 0 0 #181818, 48px 44px 0 0 #f8f8f8, 52px 44px 0 0 #181818, 12px 48px 0 0 #181818, 16px 48px 0 0 #181818, 20px 48px 0 0 #181818, 24px 48px 0 0 #f8f8f8, 28px 48px 0 0 #f8f8f8, 32px 48px 0 0 #f8f8f8, 36px 48px 0 0 #f8f8f8, 40px 48px 0 0 #f8f8f8, 44px 48px 0 0 #f8f8f8, 48px 48px 0 0 #181818, 52px 48px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #f8f8f8, 20px 52px 0 0 #181818, 24px 52px 0 0 #181818, 28px 52px 0 0 #f8f8f8, 32px 52px 0 0 #f8f8f8, 36px 52px 0 0 #f8f8f8, 40px 52px 0 0 #f8f8f8, 44px 52px 0 0 #181818, 48px 52px 0 0 #f8f8f8, 52px 52px 0 0 #f8f8f8, 56px 52px 0 0 #181818, 16px 56px 0 0 #181818, 20px 56px 0 0 #f8f8f8, 24px 56px 0 0 #f8f8f8, 28px 56px 0 0 #181818, 32px 56px 0 0 #181818, 36px 56px 0 0 #181818, 40px 56px 0 0 #181818, 48px 56px 0 0 #181818, 52px 56px 0 0 #181818, 20px 60px 0 0 #181818, 24px 60px 0 0 #181818;
        -webkit-box-shadow: 16px 4px 0 0 #181818, 20px 4px 0 0 #181818, 0 8px 0 0 #181818, 4px 8px 0 0 #181818, 8px 8px 0 0 #181818, 12px 8px 0 0 #181818, 16px 8px 0 0 #181818, 20px 8px 0 0 #181818, 24px 8px 0 0 #181818, 28px 8px 0 0 #181818, 32px 8px 0 0 #181818, 0 12px 0 0 #181818, 4px 12px 0 0 #f8f8f8, 8px 12px 0 0 #f8f8f8, 12px 12px 0 0 #f8f8f8, 16px 12px 0 0 #181818, 20px 12px 0 0 #181818, 24px 12px 0 0 #181818, 28px 12px 0 0 #f8f8f8, 32px 12px 0 0 #f8f8f8, 36px 12px 0 0 #181818, 40px 12px 0 0 #181818, 44px 12px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #f8f8f8, 12px 16px 0 0 #f8f8f8, 16px 16px 0 0 #f8f8f8, 20px 16px 0 0 #181818, 24px 16px 0 0 #f8f8f8, 28px 16px 0 0 #f8f8f8, 32px 16px 0 0 #f8f8f8, 36px 16px 0 0 #f8f8f8, 40px 16px 0 0 #f8f8f8, 44px 16px 0 0 #f8f8f8, 48px 16px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #f8f8f8, 16px 20px 0 0 #f8f8f8, 20px 20px 0 0 #181818, 24px 20px 0 0 #181818, 28px 20px 0 0 #f8f8f8, 32px 20px 0 0 #f8f8f8, 36px 20px 0 0 #f8f8f8, 40px 20px 0 0 #f8f8f8, 44px 20px 0 0 #f8f8f8, 48px 20px 0 0 #f8f8f8, 52px 20px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #f8f8f8, 20px 24px 0 0 #f8f8f8, 24px 24px 0 0 #181818, 28px 24px 0 0 #f8f8f8, 32px 24px 0 0 #f8f8f8, 36px 24px 0 0 #f8f8f8, 40px 24px 0 0 #f8f8f8, 44px 24px 0 0 #f8f8f8, 48px 24px 0 0 #f8f8f8, 52px 24px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #f8f8f8, 20px 28px 0 0 #181818, 24px 28px 0 0 #f8f8f8, 28px 28px 0 0 #f8f8f8, 32px 28px 0 0 #f8f8f8, 36px 28px 0 0 #f8f8f8, 40px 28px 0 0 #f8f8f8, 44px 28px 0 0 #181818, 48px 28px 0 0 #f8f8f8, 52px 28px 0 0 #f8f8f8, 56px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #f8f8f8, 12px 32px 0 0 #f8f8f8, 16px 32px 0 0 #181818, 20px 32px 0 0 #181818, 24px 32px 0 0 #f8f8f8, 28px 32px 0 0 #f8f8f8, 32px 32px 0 0 #f8f8f8, 36px 32px 0 0 #c0c0c0, 40px 32px 0 0 #f8f8f8, 44px 32px 0 0 #f8f8f8, 48px 32px 0 0 #f8f8f8, 52px 32px 0 0 #f8f8f8, 56px 32px 0 0 #181818, 8px 36px 0 0 #181818, 12px 36px 0 0 #c0c0c0, 16px 36px 0 0 #181818, 20px 36px 0 0 #c0c0c0, 24px 36px 0 0 #c0c0c0, 28px 36px 0 0 #c0c0c0, 32px 36px 0 0 #f8f8f8, 36px 36px 0 0 #f8f8f8, 40px 36px 0 0 #f8f8f8, 44px 36px 0 0 #f8f8f8, 48px 36px 0 0 #f8f8f8, 52px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #c0c0c0, 12px 40px 0 0 #c0c0c0, 16px 40px 0 0 #181818, 20px 40px 0 0 #f8f8f8, 24px 40px 0 0 #f8f8f8, 28px 40px 0 0 #f8f8f8, 32px 40px 0 0 #f8f8f8, 36px 40px 0 0 #f8f8f8, 40px 40px 0 0 #f8f8f8, 44px 40px 0 0 #181818, 48px 40px 0 0 #f8f8f8, 52px 40px 0 0 #181818, 8px 44px 0 0 #181818, 12px 44px 0 0 #c0c0c0, 16px 44px 0 0 #181818, 20px 44px 0 0 #c0c0c0, 24px 44px 0 0 #c0c0c0, 28px 44px 0 0 #c0c0c0, 32px 44px 0 0 #f8f8f8, 36px 44px 0 0 #f8f8f8, 40px 44px 0 0 #181818, 44px 44px 0 0 #181818, 48px 44px 0 0 #f8f8f8, 52px 44px 0 0 #181818, 12px 48px 0 0 #181818, 16px 48px 0 0 #181818, 20px 48px 0 0 #181818, 24px 48px 0 0 #f8f8f8, 28px 48px 0 0 #f8f8f8, 32px 48px 0 0 #f8f8f8, 36px 48px 0 0 #f8f8f8, 40px 48px 0 0 #f8f8f8, 44px 48px 0 0 #f8f8f8, 48px 48px 0 0 #181818, 52px 48px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #f8f8f8, 20px 52px 0 0 #181818, 24px 52px 0 0 #181818, 28px 52px 0 0 #f8f8f8, 32px 52px 0 0 #f8f8f8, 36px 52px 0 0 #f8f8f8, 40px 52px 0 0 #f8f8f8, 44px 52px 0 0 #181818, 48px 52px 0 0 #f8f8f8, 52px 52px 0 0 #f8f8f8, 56px 52px 0 0 #181818, 16px 56px 0 0 #181818, 20px 56px 0 0 #f8f8f8, 24px 56px 0 0 #f8f8f8, 28px 56px 0 0 #181818, 32px 56px 0 0 #181818, 36px 56px 0 0 #181818, 40px 56px 0 0 #181818, 48px 56px 0 0 #181818, 52px 56px 0 0 #181818, 20px 60px 0 0 #181818, 24px 60px 0 0 #181818;
        box-shadow: 16px 4px 0 0 #181818, 20px 4px 0 0 #181818, 0 8px 0 0 #181818, 4px 8px 0 0 #181818, 8px 8px 0 0 #181818, 12px 8px 0 0 #181818, 16px 8px 0 0 #181818, 20px 8px 0 0 #181818, 24px 8px 0 0 #181818, 28px 8px 0 0 #181818, 32px 8px 0 0 #181818, 0 12px 0 0 #181818, 4px 12px 0 0 #f8f8f8, 8px 12px 0 0 #f8f8f8, 12px 12px 0 0 #f8f8f8, 16px 12px 0 0 #181818, 20px 12px 0 0 #181818, 24px 12px 0 0 #181818, 28px 12px 0 0 #f8f8f8, 32px 12px 0 0 #f8f8f8, 36px 12px 0 0 #181818, 40px 12px 0 0 #181818, 44px 12px 0 0 #181818, 4px 16px 0 0 #181818, 8px 16px 0 0 #f8f8f8, 12px 16px 0 0 #f8f8f8, 16px 16px 0 0 #f8f8f8, 20px 16px 0 0 #181818, 24px 16px 0 0 #f8f8f8, 28px 16px 0 0 #f8f8f8, 32px 16px 0 0 #f8f8f8, 36px 16px 0 0 #f8f8f8, 40px 16px 0 0 #f8f8f8, 44px 16px 0 0 #f8f8f8, 48px 16px 0 0 #181818, 8px 20px 0 0 #181818, 12px 20px 0 0 #f8f8f8, 16px 20px 0 0 #f8f8f8, 20px 20px 0 0 #181818, 24px 20px 0 0 #181818, 28px 20px 0 0 #f8f8f8, 32px 20px 0 0 #f8f8f8, 36px 20px 0 0 #f8f8f8, 40px 20px 0 0 #f8f8f8, 44px 20px 0 0 #f8f8f8, 48px 20px 0 0 #f8f8f8, 52px 20px 0 0 #181818, 12px 24px 0 0 #181818, 16px 24px 0 0 #f8f8f8, 20px 24px 0 0 #f8f8f8, 24px 24px 0 0 #181818, 28px 24px 0 0 #f8f8f8, 32px 24px 0 0 #f8f8f8, 36px 24px 0 0 #f8f8f8, 40px 24px 0 0 #f8f8f8, 44px 24px 0 0 #f8f8f8, 48px 24px 0 0 #f8f8f8, 52px 24px 0 0 #181818, 4px 28px 0 0 #181818, 8px 28px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #f8f8f8, 20px 28px 0 0 #181818, 24px 28px 0 0 #f8f8f8, 28px 28px 0 0 #f8f8f8, 32px 28px 0 0 #f8f8f8, 36px 28px 0 0 #f8f8f8, 40px 28px 0 0 #f8f8f8, 44px 28px 0 0 #181818, 48px 28px 0 0 #f8f8f8, 52px 28px 0 0 #f8f8f8, 56px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #f8f8f8, 12px 32px 0 0 #f8f8f8, 16px 32px 0 0 #181818, 20px 32px 0 0 #181818, 24px 32px 0 0 #f8f8f8, 28px 32px 0 0 #f8f8f8, 32px 32px 0 0 #f8f8f8, 36px 32px 0 0 #c0c0c0, 40px 32px 0 0 #f8f8f8, 44px 32px 0 0 #f8f8f8, 48px 32px 0 0 #f8f8f8, 52px 32px 0 0 #f8f8f8, 56px 32px 0 0 #181818, 8px 36px 0 0 #181818, 12px 36px 0 0 #c0c0c0, 16px 36px 0 0 #181818, 20px 36px 0 0 #c0c0c0, 24px 36px 0 0 #c0c0c0, 28px 36px 0 0 #c0c0c0, 32px 36px 0 0 #f8f8f8, 36px 36px 0 0 #f8f8f8, 40px 36px 0 0 #f8f8f8, 44px 36px 0 0 #f8f8f8, 48px 36px 0 0 #f8f8f8, 52px 36px 0 0 #181818, 4px 40px 0 0 #181818, 8px 40px 0 0 #c0c0c0, 12px 40px 0 0 #c0c0c0, 16px 40px 0 0 #181818, 20px 40px 0 0 #f8f8f8, 24px 40px 0 0 #f8f8f8, 28px 40px 0 0 #f8f8f8, 32px 40px 0 0 #f8f8f8, 36px 40px 0 0 #f8f8f8, 40px 40px 0 0 #f8f8f8, 44px 40px 0 0 #181818, 48px 40px 0 0 #f8f8f8, 52px 40px 0 0 #181818, 8px 44px 0 0 #181818, 12px 44px 0 0 #c0c0c0, 16px 44px 0 0 #181818, 20px 44px 0 0 #c0c0c0, 24px 44px 0 0 #c0c0c0, 28px 44px 0 0 #c0c0c0, 32px 44px 0 0 #f8f8f8, 36px 44px 0 0 #f8f8f8, 40px 44px 0 0 #181818, 44px 44px 0 0 #181818, 48px 44px 0 0 #f8f8f8, 52px 44px 0 0 #181818, 12px 48px 0 0 #181818, 16px 48px 0 0 #181818, 20px 48px 0 0 #181818, 24px 48px 0 0 #f8f8f8, 28px 48px 0 0 #f8f8f8, 32px 48px 0 0 #f8f8f8, 36px 48px 0 0 #f8f8f8, 40px 48px 0 0 #f8f8f8, 44px 48px 0 0 #f8f8f8, 48px 48px 0 0 #181818, 52px 48px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #f8f8f8, 20px 52px 0 0 #181818, 24px 52px 0 0 #181818, 28px 52px 0 0 #f8f8f8, 32px 52px 0 0 #f8f8f8, 36px 52px 0 0 #f8f8f8, 40px 52px 0 0 #f8f8f8, 44px 52px 0 0 #181818, 48px 52px 0 0 #f8f8f8, 52px 52px 0 0 #f8f8f8, 56px 52px 0 0 #181818, 16px 56px 0 0 #181818, 20px 56px 0 0 #f8f8f8, 24px 56px 0 0 #f8f8f8, 28px 56px 0 0 #181818, 32px 56px 0 0 #181818, 36px 56px 0 0 #181818, 40px 56px 0 0 #181818, 48px 56px 0 0 #181818, 52px 56px 0 0 #181818, 20px 60px 0 0 #181818, 24px 60px 0 0 #181818;
    }
    #pikachu:after {
        -moz-box-shadow: 16px 8px 0 0 #181818, 20px 8px 0 0 #181818, 0 12px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #181818, 12px 12px 0 0 #181818, 16px 12px 0 0 #181818, 20px 12px 0 0 #181818, 24px 12px 0 0 #181818, 28px 12px 0 0 #181818, 32px 12px 0 0 #181818, 0 16px 0 0 #181818, 4px 16px 0 0 #f8f8f8, 8px 16px 0 0 #f8f8f8, 12px 16px 0 0 #f8f8f8, 16px 16px 0 0 #181818, 20px 16px 0 0 #181818, 24px 16px 0 0 #181818, 28px 16px 0 0 #f8f8f8, 32px 16px 0 0 #f8f8f8, 36px 16px 0 0 #181818, 40px 16px 0 0 #181818, 44px 16px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #f8f8f8, 12px 20px 0 0 #f8f8f8, 16px 20px 0 0 #f8f8f8, 20px 20px 0 0 #181818, 24px 20px 0 0 #f8f8f8, 28px 20px 0 0 #f8f8f8, 32px 20px 0 0 #f8f8f8, 36px 20px 0 0 #f8f8f8, 40px 20px 0 0 #f8f8f8, 44px 20px 0 0 #f8f8f8, 48px 20px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #f8f8f8, 16px 24px 0 0 #f8f8f8, 20px 24px 0 0 #181818, 24px 24px 0 0 #181818, 28px 24px 0 0 #f8f8f8, 32px 24px 0 0 #f8f8f8, 36px 24px 0 0 #f8f8f8, 40px 24px 0 0 #f8f8f8, 44px 24px 0 0 #f8f8f8, 48px 24px 0 0 #f8f8f8, 52px 24px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #f8f8f8, 20px 28px 0 0 #f8f8f8, 24px 28px 0 0 #181818, 28px 28px 0 0 #f8f8f8, 32px 28px 0 0 #f8f8f8, 36px 28px 0 0 #f8f8f8, 40px 28px 0 0 #f8f8f8, 44px 28px 0 0 #f8f8f8, 48px 28px 0 0 #f8f8f8, 52px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #181818, 16px 32px 0 0 #f8f8f8, 20px 32px 0 0 #181818, 24px 32px 0 0 #f8f8f8, 28px 32px 0 0 #f8f8f8, 32px 32px 0 0 #f8f8f8, 36px 32px 0 0 #f8f8f8, 40px 32px 0 0 #f8f8f8, 44px 32px 0 0 #181818, 48px 32px 0 0 #f8f8f8, 52px 32px 0 0 #f8f8f8, 56px 32px 0 0 #181818, 4px 36px 0 0 #181818, 8px 36px 0 0 #f8f8f8, 12px 36px 0 0 #f8f8f8, 16px 36px 0 0 #f8f8f8, 20px 36px 0 0 #181818, 24px 36px 0 0 #f8f8f8, 28px 36px 0 0 #f8f8f8, 32px 36px 0 0 #f8f8f8, 36px 36px 0 0 #c0c0c0, 40px 36px 0 0 #f8f8f8, 44px 36px 0 0 #f8f8f8, 48px 36px 0 0 #f8f8f8, 52px 36px 0 0 #f8f8f8, 56px 36px 0 0 #181818, 8px 40px 0 0 #181818, 12px 40px 0 0 #c0c0c0, 16px 40px 0 0 #181818, 20px 40px 0 0 #c0c0c0, 24px 40px 0 0 #c0c0c0, 28px 40px 0 0 #c0c0c0, 32px 40px 0 0 #f8f8f8, 36px 40px 0 0 #f8f8f8, 40px 40px 0 0 #f8f8f8, 44px 40px 0 0 #f8f8f8, 48px 40px 0 0 #f8f8f8, 52px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #c0c0c0, 12px 44px 0 0 #c0c0c0, 16px 44px 0 0 #181818, 20px 44px 0 0 #f8f8f8, 24px 44px 0 0 #f8f8f8, 28px 44px 0 0 #f8f8f8, 32px 44px 0 0 #f8f8f8, 36px 44px 0 0 #f8f8f8, 40px 44px 0 0 #f8f8f8, 44px 44px 0 0 #181818, 48px 44px 0 0 #f8f8f8, 52px 44px 0 0 #181818, 8px 48px 0 0 #181818, 12px 48px 0 0 #c0c0c0, 16px 48px 0 0 #181818, 20px 48px 0 0 #c0c0c0, 24px 48px 0 0 #c0c0c0, 28px 48px 0 0 #c0c0c0, 32px 48px 0 0 #f8f8f8, 36px 48px 0 0 #f8f8f8, 40px 48px 0 0 #181818, 44px 48px 0 0 #181818, 48px 48px 0 0 #f8f8f8, 52px 48px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #181818, 20px 52px 0 0 #181818, 24px 52px 0 0 #f8f8f8, 28px 52px 0 0 #f8f8f8, 32px 52px 0 0 #f8f8f8, 36px 52px 0 0 #f8f8f8, 40px 52px 0 0 #f8f8f8, 44px 52px 0 0 #f8f8f8, 48px 52px 0 0 #f8f8f8, 52px 52px 0 0 #181818, 24px 56px 0 0 #181818, 28px 56px 0 0 #181818, 32px 56px 0 0 #f8f8f8, 36px 56px 0 0 #f8f8f8, 40px 56px 0 0 #f8f8f8, 44px 56px 0 0 #181818, 48px 56px 0 0 #181818, 32px 60px 0 0 #181818, 36px 60px 0 0 #181818, 40px 60px 0 0 #181818;
        -webkit-box-shadow: 16px 8px 0 0 #181818, 20px 8px 0 0 #181818, 0 12px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #181818, 12px 12px 0 0 #181818, 16px 12px 0 0 #181818, 20px 12px 0 0 #181818, 24px 12px 0 0 #181818, 28px 12px 0 0 #181818, 32px 12px 0 0 #181818, 0 16px 0 0 #181818, 4px 16px 0 0 #f8f8f8, 8px 16px 0 0 #f8f8f8, 12px 16px 0 0 #f8f8f8, 16px 16px 0 0 #181818, 20px 16px 0 0 #181818, 24px 16px 0 0 #181818, 28px 16px 0 0 #f8f8f8, 32px 16px 0 0 #f8f8f8, 36px 16px 0 0 #181818, 40px 16px 0 0 #181818, 44px 16px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #f8f8f8, 12px 20px 0 0 #f8f8f8, 16px 20px 0 0 #f8f8f8, 20px 20px 0 0 #181818, 24px 20px 0 0 #f8f8f8, 28px 20px 0 0 #f8f8f8, 32px 20px 0 0 #f8f8f8, 36px 20px 0 0 #f8f8f8, 40px 20px 0 0 #f8f8f8, 44px 20px 0 0 #f8f8f8, 48px 20px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #f8f8f8, 16px 24px 0 0 #f8f8f8, 20px 24px 0 0 #181818, 24px 24px 0 0 #181818, 28px 24px 0 0 #f8f8f8, 32px 24px 0 0 #f8f8f8, 36px 24px 0 0 #f8f8f8, 40px 24px 0 0 #f8f8f8, 44px 24px 0 0 #f8f8f8, 48px 24px 0 0 #f8f8f8, 52px 24px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #f8f8f8, 20px 28px 0 0 #f8f8f8, 24px 28px 0 0 #181818, 28px 28px 0 0 #f8f8f8, 32px 28px 0 0 #f8f8f8, 36px 28px 0 0 #f8f8f8, 40px 28px 0 0 #f8f8f8, 44px 28px 0 0 #f8f8f8, 48px 28px 0 0 #f8f8f8, 52px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #181818, 16px 32px 0 0 #f8f8f8, 20px 32px 0 0 #181818, 24px 32px 0 0 #f8f8f8, 28px 32px 0 0 #f8f8f8, 32px 32px 0 0 #f8f8f8, 36px 32px 0 0 #f8f8f8, 40px 32px 0 0 #f8f8f8, 44px 32px 0 0 #181818, 48px 32px 0 0 #f8f8f8, 52px 32px 0 0 #f8f8f8, 56px 32px 0 0 #181818, 4px 36px 0 0 #181818, 8px 36px 0 0 #f8f8f8, 12px 36px 0 0 #f8f8f8, 16px 36px 0 0 #f8f8f8, 20px 36px 0 0 #181818, 24px 36px 0 0 #f8f8f8, 28px 36px 0 0 #f8f8f8, 32px 36px 0 0 #f8f8f8, 36px 36px 0 0 #c0c0c0, 40px 36px 0 0 #f8f8f8, 44px 36px 0 0 #f8f8f8, 48px 36px 0 0 #f8f8f8, 52px 36px 0 0 #f8f8f8, 56px 36px 0 0 #181818, 8px 40px 0 0 #181818, 12px 40px 0 0 #c0c0c0, 16px 40px 0 0 #181818, 20px 40px 0 0 #c0c0c0, 24px 40px 0 0 #c0c0c0, 28px 40px 0 0 #c0c0c0, 32px 40px 0 0 #f8f8f8, 36px 40px 0 0 #f8f8f8, 40px 40px 0 0 #f8f8f8, 44px 40px 0 0 #f8f8f8, 48px 40px 0 0 #f8f8f8, 52px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #c0c0c0, 12px 44px 0 0 #c0c0c0, 16px 44px 0 0 #181818, 20px 44px 0 0 #f8f8f8, 24px 44px 0 0 #f8f8f8, 28px 44px 0 0 #f8f8f8, 32px 44px 0 0 #f8f8f8, 36px 44px 0 0 #f8f8f8, 40px 44px 0 0 #f8f8f8, 44px 44px 0 0 #181818, 48px 44px 0 0 #f8f8f8, 52px 44px 0 0 #181818, 8px 48px 0 0 #181818, 12px 48px 0 0 #c0c0c0, 16px 48px 0 0 #181818, 20px 48px 0 0 #c0c0c0, 24px 48px 0 0 #c0c0c0, 28px 48px 0 0 #c0c0c0, 32px 48px 0 0 #f8f8f8, 36px 48px 0 0 #f8f8f8, 40px 48px 0 0 #181818, 44px 48px 0 0 #181818, 48px 48px 0 0 #f8f8f8, 52px 48px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #181818, 20px 52px 0 0 #181818, 24px 52px 0 0 #f8f8f8, 28px 52px 0 0 #f8f8f8, 32px 52px 0 0 #f8f8f8, 36px 52px 0 0 #f8f8f8, 40px 52px 0 0 #f8f8f8, 44px 52px 0 0 #f8f8f8, 48px 52px 0 0 #f8f8f8, 52px 52px 0 0 #181818, 24px 56px 0 0 #181818, 28px 56px 0 0 #181818, 32px 56px 0 0 #f8f8f8, 36px 56px 0 0 #f8f8f8, 40px 56px 0 0 #f8f8f8, 44px 56px 0 0 #181818, 48px 56px 0 0 #181818, 32px 60px 0 0 #181818, 36px 60px 0 0 #181818, 40px 60px 0 0 #181818;
        box-shadow: 16px 8px 0 0 #181818, 20px 8px 0 0 #181818, 0 12px 0 0 #181818, 4px 12px 0 0 #181818, 8px 12px 0 0 #181818, 12px 12px 0 0 #181818, 16px 12px 0 0 #181818, 20px 12px 0 0 #181818, 24px 12px 0 0 #181818, 28px 12px 0 0 #181818, 32px 12px 0 0 #181818, 0 16px 0 0 #181818, 4px 16px 0 0 #f8f8f8, 8px 16px 0 0 #f8f8f8, 12px 16px 0 0 #f8f8f8, 16px 16px 0 0 #181818, 20px 16px 0 0 #181818, 24px 16px 0 0 #181818, 28px 16px 0 0 #f8f8f8, 32px 16px 0 0 #f8f8f8, 36px 16px 0 0 #181818, 40px 16px 0 0 #181818, 44px 16px 0 0 #181818, 4px 20px 0 0 #181818, 8px 20px 0 0 #f8f8f8, 12px 20px 0 0 #f8f8f8, 16px 20px 0 0 #f8f8f8, 20px 20px 0 0 #181818, 24px 20px 0 0 #f8f8f8, 28px 20px 0 0 #f8f8f8, 32px 20px 0 0 #f8f8f8, 36px 20px 0 0 #f8f8f8, 40px 20px 0 0 #f8f8f8, 44px 20px 0 0 #f8f8f8, 48px 20px 0 0 #181818, 8px 24px 0 0 #181818, 12px 24px 0 0 #f8f8f8, 16px 24px 0 0 #f8f8f8, 20px 24px 0 0 #181818, 24px 24px 0 0 #181818, 28px 24px 0 0 #f8f8f8, 32px 24px 0 0 #f8f8f8, 36px 24px 0 0 #f8f8f8, 40px 24px 0 0 #f8f8f8, 44px 24px 0 0 #f8f8f8, 48px 24px 0 0 #f8f8f8, 52px 24px 0 0 #181818, 12px 28px 0 0 #181818, 16px 28px 0 0 #f8f8f8, 20px 28px 0 0 #f8f8f8, 24px 28px 0 0 #181818, 28px 28px 0 0 #f8f8f8, 32px 28px 0 0 #f8f8f8, 36px 28px 0 0 #f8f8f8, 40px 28px 0 0 #f8f8f8, 44px 28px 0 0 #f8f8f8, 48px 28px 0 0 #f8f8f8, 52px 28px 0 0 #181818, 4px 32px 0 0 #181818, 8px 32px 0 0 #181818, 12px 32px 0 0 #181818, 16px 32px 0 0 #f8f8f8, 20px 32px 0 0 #181818, 24px 32px 0 0 #f8f8f8, 28px 32px 0 0 #f8f8f8, 32px 32px 0 0 #f8f8f8, 36px 32px 0 0 #f8f8f8, 40px 32px 0 0 #f8f8f8, 44px 32px 0 0 #181818, 48px 32px 0 0 #f8f8f8, 52px 32px 0 0 #f8f8f8, 56px 32px 0 0 #181818, 4px 36px 0 0 #181818, 8px 36px 0 0 #f8f8f8, 12px 36px 0 0 #f8f8f8, 16px 36px 0 0 #f8f8f8, 20px 36px 0 0 #181818, 24px 36px 0 0 #f8f8f8, 28px 36px 0 0 #f8f8f8, 32px 36px 0 0 #f8f8f8, 36px 36px 0 0 #c0c0c0, 40px 36px 0 0 #f8f8f8, 44px 36px 0 0 #f8f8f8, 48px 36px 0 0 #f8f8f8, 52px 36px 0 0 #f8f8f8, 56px 36px 0 0 #181818, 8px 40px 0 0 #181818, 12px 40px 0 0 #c0c0c0, 16px 40px 0 0 #181818, 20px 40px 0 0 #c0c0c0, 24px 40px 0 0 #c0c0c0, 28px 40px 0 0 #c0c0c0, 32px 40px 0 0 #f8f8f8, 36px 40px 0 0 #f8f8f8, 40px 40px 0 0 #f8f8f8, 44px 40px 0 0 #f8f8f8, 48px 40px 0 0 #f8f8f8, 52px 40px 0 0 #181818, 4px 44px 0 0 #181818, 8px 44px 0 0 #c0c0c0, 12px 44px 0 0 #c0c0c0, 16px 44px 0 0 #181818, 20px 44px 0 0 #f8f8f8, 24px 44px 0 0 #f8f8f8, 28px 44px 0 0 #f8f8f8, 32px 44px 0 0 #f8f8f8, 36px 44px 0 0 #f8f8f8, 40px 44px 0 0 #f8f8f8, 44px 44px 0 0 #181818, 48px 44px 0 0 #f8f8f8, 52px 44px 0 0 #181818, 8px 48px 0 0 #181818, 12px 48px 0 0 #c0c0c0, 16px 48px 0 0 #181818, 20px 48px 0 0 #c0c0c0, 24px 48px 0 0 #c0c0c0, 28px 48px 0 0 #c0c0c0, 32px 48px 0 0 #f8f8f8, 36px 48px 0 0 #f8f8f8, 40px 48px 0 0 #181818, 44px 48px 0 0 #181818, 48px 48px 0 0 #f8f8f8, 52px 48px 0 0 #181818, 12px 52px 0 0 #181818, 16px 52px 0 0 #181818, 20px 52px 0 0 #181818, 24px 52px 0 0 #f8f8f8, 28px 52px 0 0 #f8f8f8, 32px 52px 0 0 #f8f8f8, 36px 52px 0 0 #f8f8f8, 40px 52px 0 0 #f8f8f8, 44px 52px 0 0 #f8f8f8, 48px 52px 0 0 #f8f8f8, 52px 52px 0 0 #181818, 24px 56px 0 0 #181818, 28px 56px 0 0 #181818, 32px 56px 0 0 #f8f8f8, 36px 56px 0 0 #f8f8f8, 40px 56px 0 0 #f8f8f8, 44px 56px 0 0 #181818, 48px 56px 0 0 #181818, 32px 60px 0 0 #181818, 36px 60px 0 0 #181818, 40px 60px 0 0 #181818;
    }

    /* Animations */
    #ash:before, #ash:after,
    #pikachu:before,
    #pikachu:after {
        -webkit-animation: the-animation 0.4s infinite steps(2);
        -moz-animation: the-animation 0.4s infinite steps(2);
        -o-animation: the-animation 0.4s infinite steps(2);
        animation: the-animation 0.4s infinite steps(2);
    }
    #ash:after,
    #pikachu:after {
        -webkit-animation-direction: reverse;
        -moz-animation-direction: reverse;
        -o-animation-direction: reverse;
        animation-direction: reverse;
    }

    #pikachu:after, #pikachu:before {
        -webkit-animation-duration: 0.2s;
        -moz-animation-duration: 0.2s;
        -o-animation-duration: 0.2s;
        animation-duration: 0.2s;
    }

    @-webkit-keyframes the-animation {
        0% {
            margin-left: 0;
        }
        100% {
            margin-left: 120px;
        }
    }
    @-moz-keyframes the-animation {
        0% {
            margin-left: 0;
        }
        100% {
            margin-left: 120px;
        }
    }
    @-o-keyframes the-animation {
        0% {
            margin-left: 0;
        }
        100% {
            margin-left: 120px;
        }
    }
    @keyframes the-animation {
        0% {
            margin-left: 0;
        }
        100% {
            margin-left: 120px;
        }
    }


#h {
  position: relative;
  width: 81.66667px;
  margin: 100px auto;
  transform: rotate(45deg);
  top: -65px;
  left: 25px;
}
#h #a {
  position: absolute;
  width: 70px;
  height: 70px;
  border-width: 11.66667px;
  border-color: #6ab071;
  border-style: solid;
  border-radius: 70px;
  border-bottom-color: transparent;
  border-right-color: transparent;
  animation: goa 2s 0.5s linear infinite;
}
#h #m {
  position: absolute;
  width: 35px;
  height: 35px;
  border-width: 11.66667px;
  border-color: #b2dea6;
  border-style: solid;
  border-radius: 70px;
  border-bottom-color: transparent;
  border-right-color: transparent;
  top: 17.5px;
  left: 17.5px;
  animation: gom 2s linear infinite;
}
#h #l {
    position: absolute;
    width: 0;
    height: 0;
    background: red;
    border-width: 6.66667px;
    border-color: #e0f1db;
    border-style: solid;
    border-radius: 70px;
    top: 28px;
    left: 28px;
}

@keyframes goa {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-180deg);
  }
  50% {
    transform: rotate(-180deg);
  }
  75% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes gom {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}



</style>