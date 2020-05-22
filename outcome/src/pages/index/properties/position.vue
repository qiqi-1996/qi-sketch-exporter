<template>
    <layout :title="name" :copy="copy">
        <q-input class="x" :value="data.x.toString()">
            <q-footnote class="prefix">X</q-footnote><q-divider type="vertical"></q-divider>
        </q-input>
        <q-input class="y" :value="data.y.toString()">
            <q-footnote class="prefix">Y</q-footnote><q-divider type="vertical"></q-divider>
        </q-input>
    </layout>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.x, .y {
    width: calc(~"50% - 8px");
    pointer-events: none;
}

.x {
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
    extends: BaseExtends,
    computed: {
        copy(){
            return [
                { title: "top & left", value: `top: ${this.data.y}px;\nleft: ${this.data.x}px`},
                { title: "margin", value: `margin-top: ${this.data.y}px;\nmargin-left: ${this.data.x}px`},
                { title: "padding", value: `padding-top: ${this.data.y}px;\npadding-left: ${this.data.x}px`},
            ]
        }
    }
}
</script>