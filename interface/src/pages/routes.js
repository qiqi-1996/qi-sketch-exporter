export default [
    {
        path: "/index",
        name: "index",
        component: require("./index/index.vue").default,
    },
    {
        path: "/workspace",
        name: "workspace",
        component: require("./workspace/index.vue").default,
    },

    {
        path: "/",
        redirect: "/index"
    }
]