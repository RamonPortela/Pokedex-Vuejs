import Detalhes from './components/detalhes.vue';
import Lista from './components/lista.vue';
import Tipo from './components/tipo.vue'

export const routes = [
    { path: '', redirect: '/pokemons' },
    {
        path: '/pokemons',
        name: 'lista',
        component: Lista
    },
    {
        path: '/pokemon/:id',
        name: 'detalhes',
        component: Detalhes,
        props: true
    },
    {
        path: '/tipo/:id',
        name: 'tipo',
        component: Tipo,
        props: true
    },
    { path: '*', redirect: '' }
];