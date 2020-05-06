<template>
    <div class="app">
        <framework></framework>
    </div>
</template>

<style lang="less" scoped>
.app {
    width: 100%;
    height: 100%;
}
</style>

<script>
import framework from "./core/framework/index.vue";
import store from "/store.js";

export default {
    components: {
        framework
    },
    data() {
        return {
            store
        };
    }
};
</script>