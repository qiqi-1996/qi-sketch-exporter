import Vue from "vue/dist/vue.js";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";

import "./reset.css";
import "animate.css";
import QiDesignVue from "@qiqi1996/qi-design-vue";
import "@qiqi1996/qi-design-vue/style.css";

import GlobalComponentsRegister from "./components/GlobalComponentsRegister.js";
import store from "/store.js";

import App from "./app.vue";
import routes from "./pages/routes.js";

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(QiDesignVue);
GlobalComponentsRegister(Vue);

const router = new VueRouter({
    routes
})

var locale = "en";
var language = navigator.language || navigator.browserLanguage;
if (language.indexOf("zh") != -1) {
    locale = "zh-CN";
}

store.i18n = new VueI18n({
    locale
})

const vm = new Vue({
    el: "#app",
    router,
    i18n: store.i18n,
    components: {
        App
    },
    template: "<app></app>"
});