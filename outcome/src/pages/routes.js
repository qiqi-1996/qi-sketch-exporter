export default [
    {
        path: "/index",
        name: "index",
        component: require("./index/index.vue").default,
    },

    {
        path: "/",
        redirect: "/index"
    }
]