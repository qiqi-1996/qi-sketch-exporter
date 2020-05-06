<template>
    <layout :title="name">
        <q-text mode="compact">{{data | defaultString}}</q-text>
    </layout>
</template>

<script>
import BaseExtends from "./base/base-extends.js";

export default {
    extends: BaseExtends,
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