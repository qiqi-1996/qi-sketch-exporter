<template>
    <q-panel class="framework-container" ref="framework" :color="color" :theme="theme">
        <div class="content">
            <router-view></router-view>
        </div>
    </q-panel>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.framework-container, .content {
    width: 100%;
    height: 100%;
}
</style>

<script>
import store from "/store.js";

export default {
    data(){
        return {
            theme: store.theme,
            color: store.color,
        }
    },
    mounted(){
        store.$watch("theme", (newValue)=>{
            this.theme = newValue;
        });

        store.$watch("color", (newValue)=>{
            this.color = newValue;
        });

        if (window.matchMedia) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                this.$set(store, "enableDarkMode", true);
                console.log("Detected Dark Mode");
            } else {
                this.$set(store, "enableDarkMode", false);
                console.log("Detected Light Mode");
            }
        }
    },
    methods: {
        doExit(){
            window.postMessage("doExit");
        }
    }
}
</script>