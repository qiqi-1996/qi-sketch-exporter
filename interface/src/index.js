import Vue from "vue/dist/vue.js";
import VueRouter from "vue-router";

import "./reset.css";
import "animate.css";
import QiDesignVue from "@qiqi1996/qi-design-vue";
import "@qiqi1996/qi-design-vue/style.css";

import GlobalComponentsRegister from "./components/GlobalComponentsRegister.js";
import store from "/store.js";

import App from "./app.vue";
import routes from "./pages/routes.js";

Vue.use(VueRouter);
Vue.use(QiDesignVue);
GlobalComponentsRegister(Vue);

const router = new VueRouter({
    routes
})

const vm = new Vue({
    el: "#app",
    router,
    components: {
        App
    },
    template: "<app></app>"
});