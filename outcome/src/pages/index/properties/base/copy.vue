<template>
    <q-popover position="bottom-right" :mode="(haveCopy && copy.length>1)?'hover':'none'">
        <q-button icon="copy" class="copy" :disable="!haveCopy" @click="doCopy(copy[0].value)">{{$t("copy")}}</q-button>

        <q-panel class="popover" slot="content" secondary v-show="haveCopy && copy.length>1">
            <q-button v-for="(item, index) in copy" :key="index" @click="doCopy(item.value)">
                {{item.title || item.value}}
                <q-footnote style="margin-top: 4px" v-if="index===0">{{ $t("copy-default") }}</q-footnote>
            </q-button>
        </q-panel>
    </q-popover>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.copy {
    width: 72px;
}

.popover {
    max-width: 280px;
    padding: @grid;
    padding-right: 3*@grid;

    .q-button {
        width: 100%;
        display: block;
        margin: @grid;
        text-align: left;
    }
}
</style>

<script>
import CopyMenu from "./copy-menu.js";
import shortid from "shortid";
import messages from "../properties.i18n.json";
import CopyToClipboard from "copy-to-clipboard";

export default {
    i18n: {
        messages
    },
    props: {
        copy: Array
    },
    data(){
        return {
            id: shortid(),
        }
    },
    computed: {
        haveCopy(){
            return Boolean(this.copy && Array.isArray(this.copy) && this.copy.length)
        }
    },
    methods: {
        toggleMenu(){
            this.menu.open = this.id;
        },
        doCopy(content){
            CopyToClipboard(content, {
                message: this.$t("copy-failed"),
                format: "text/plain"
            });

            this.$qidesign.toast(this.$t("copy-success"))
        }
    }
}
</script>