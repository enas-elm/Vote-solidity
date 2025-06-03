import { createRouter, createWebHashHistory } from 'vue-router'
import Election from './views/Election.vue'
import Results from './views/Resultats.vue'

const routes = [
    { path: '/', component: Election },
    { path: '/resultats', component: Results }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})
