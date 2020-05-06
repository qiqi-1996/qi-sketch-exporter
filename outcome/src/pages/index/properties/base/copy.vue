<template>
    <q-menu :data="TestData" :value="id" v-model="menu.open" position="bottom-right" size="small">
        <q-button icon="copy" class="copy" @click="toggleMenu" disable>{{$t("copy")}}</q-button>
    </q-menu>
</template>

<style lang="less" scoped>
.copy {
    width: 72px;
}
</style>

<script>
import CopyMenu from "./copy-menu.js";
import shortid from "shortid";
import messages from "../properties.i18n.json";

export default {
    i18n: {
        messages
    },
    data(){
        return {
            id: shortid(),
            menu: CopyMenu,
            TestData: [
                {
                    text: "test",
                }
            ]
        }
    },
    methods: {
        toggleMenu(){
            this.menu.open = this.id;
        }
    }
}
</script>