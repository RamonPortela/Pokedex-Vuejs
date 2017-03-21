import Detalhes from './components/detalhes.vue';
import Lista from './components/lista.vue';

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
    { path: '*', redirect: '' }
];