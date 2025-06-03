import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Election from './views/Election.vue'
import Results from './views/Resultats.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/election', component: Election },
    { path: '/resultats', component: Results }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})
