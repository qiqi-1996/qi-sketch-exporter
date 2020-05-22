<template>
    <layout :title="name" :copy="copy">
        <q-text mode="compact">{{data | defaultString}}</q-text>
    </layout>
</template>

<script>
import BaseExtends from "./base/base-extends.js";

export default {
    extends: BaseExtends,
    computed: {
        copy(){
            return [
                { value: typeof this.data==="object"?JSON.stringify(this.data):this.data }
            ]
        }
    },
    filters: {
        defaultString(value){
            if(typeof value === "object"){
                return JSON.stringify(value);
            }
            return value;
        }
    }
}
</script>