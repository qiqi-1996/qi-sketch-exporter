<template>
    <div class="property-layout">
        <q-text class="title">{{title}}</q-text
        ><div class="content">
            <div class="slot">
                <slot></slot>
            </div>
            <copy class="copy" :copy="copy"></copy>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.property-layout {
    width: 100%;
}

.title {
    margin-bottom: 2*@grid;
    opacity: 0.5;
}

.slot, .copy {
    display: inline-block;
    vertical-align: middle;
}

.slot {
    width: calc(~"100% - 72px - 8px");
    margin-right: @grid;
    white-space: initial;
}

.copy {
    width: 72px;
}
</style>

<script>
import copy from "./copy.vue";

export default {
    components: {
        copy
    },
    props: {
        title: String,
        copy: Array
    }
}
</script>