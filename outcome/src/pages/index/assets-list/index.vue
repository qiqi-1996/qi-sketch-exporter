<template>
    <div class="container">
        <q-button
            v-for="(item, index) in data"
            :key="index"
            icon="download"
            :href="`./assets/${item}`"
        >
        {{item}}
        </q-button>
    </div>
</template>

<style lang="less" scoped>
.container {
    .q-button {
        display: block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
}
</style>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: ()=>[]
        }
    }
}
</script>