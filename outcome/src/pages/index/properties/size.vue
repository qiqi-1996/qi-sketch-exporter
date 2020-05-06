<template>
    <layout :title="name">
        <q-input class="width" :value="data.width.toString()">
            <q-footnote class="prefix">W</q-footnote><q-divider type="vertical"></q-divider>
        </q-input>
        <q-input class="height" :value="data.height.toString()">
            <q-footnote class="prefix">H</q-footnote><q-divider type="vertical"></q-divider>
        </q-input>
    </layout>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.width, .height {
    width: calc(~"50% - 8px");
    pointer-events: none;
}

.width {
    margin-right: @grid;
}

.prefix {
    display: inline-block;
    vertical-align: middle;
    width: 32px;
    text-align: center;
}

.q-divider {
    display: inline-block;
    vertical-align: middle;
    height: 16px !important;
}
</style>

<script>
import BaseExtends from "./base/base-extends.js";

export default {
    extends: BaseExtends
}
</script>