<template>
    <q-panel>
        <framework></framework>
    </q-panel>
</template>

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