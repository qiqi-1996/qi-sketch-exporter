<template>
    <layout :title="name">
        <div :style="{ textAlign: fixedData }">
            <q-icon class="icon" :name="'align-'+fixedData"></q-icon>
            <q-text class="text">{{fixedData}}</q-text>
        </div>
    </layout>
</template>

<style lang="less" scoped>
.icon, .text {
    display: inline-block;
    vertical-align: middle;
}
</style>

<script>
import BaseExtends from "./base/base-extends.js";

export default {
    extends: BaseExtends,
    computed: {
        fixedData(){
            if(this.data=="justified"){
                return "justify";
            }
            return this.data;
        }
    }
}
</script>