import { createApp } from 'vue';
import App from './App.vue';
import { createWebHistory, createRouter } from 'vue-router';
import DomainList from "./components/DomainList.vue";
import DomainView from "./components/DomainView.vue";

const routes = [

    {
        path: "/",
        redirect: 'domains',
    },
    {
        path: "/domains/:domain",
        name: "verifyDomain",
        component: DomainView,
        props: true,
    },
    {
        path: "/domains",
        name: "domains",
        component: DomainList,
    }


]

const router = createRouter({
    history: createWebHistory(),
    routes
})


createApp(App).use(router).mount("#app");


