<template>
    <layout :title="name">
        <q-input :value="data.toString()"></q-input>
    </layout>
</template>

<script>
import BaseExtends from "./base/base-extends.js";

export default {
    extends: BaseExtends
}
</script>