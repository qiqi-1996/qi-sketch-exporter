<template>
    <div :class="['layout-right', enable?'':'hidden']">
        <div class="topbar">
            <q-button :icon="enable?'right':'left'" style="width: 32px;" @click="toggle"
                type="primary"></q-button>
        </div>

        <transition name="transition-layout-right">
            <div style="width: 320px;" v-show="enable">

                <q-panel class="panel" border v-if="layer != null && layer.assets.length">
                    <q-collapse :title="$t('assets')" :title-colorful="true" :value="true">
                        <assets-list :data="layer.assets"></assets-list>
                    </q-collapse>
                </q-panel>
                
                <q-panel class="panel" border v-if="layer != null">
                    <q-collapse :title="$t('properties')" :title-colorful="true" :value="true">
                        <q-divider class="collapse-divider"></q-divider>
                        <property class="property" v-for="(property, type) in parsedProperties" :key="type" :type="type" :data="property"></property>
                    </q-collapse>
                </q-panel>

                <q-panel class="panel" border>
                    <q-collapse :title="$t('ui-settings')" :title-colorful="true" :value="true">
                        <q-divider class="collapse-divider"></q-divider>
                        <div class="option option-switch" @click="toggleDarkMode">
                            <div class="left">
                                <q-text>{{ $t('ui-darkmode') }}</q-text>
                            </div>
                            <div class="right">
                                <q-switch v-model="darkmode"></q-switch>
                            </div>
                        </div>

                        <div class="option option-color">
                            <q-text class="title">{{ $t('ui-color') }}</q-text>
                            <div class="flex">
                                <q-hover :config="color" :active="color.current==='poe'"
                                    @click.native="toggleColor('poe')">
                                    <q-color-block :size="16" color="poe" round></q-color-block>
                                </q-hover>
                                <q-hover :config="color" :active="color.current==='starrynight'"
                                    @click.native="toggleColor('starrynight')">
                                    <q-color-block :size="16" color="starrynight" round></q-color-block>
                                </q-hover>
                                <q-hover :config="color" :active="color.current==='enjolras'"
                                    @click.native="toggleColor('enjolras')">
                                    <q-color-block :size="16" color="enjolras" round></q-color-block>
                                </q-hover>
                                <q-hover :config="color" :active="color.current==='sunflower'"
                                    @click.native="toggleColor('sunflower')">
                                    <q-color-block :size="16" color="sunflower" round></q-color-block>
                                </q-hover>
                                <q-hover :config="color" :active="color.current==='spring'"
                                    @click.native="toggleColor('spring')">
                                    <q-color-block :size="16" color="spring" round></q-color-block>
                                </q-hover>
                            </div>
                        </div>

                        <div class="option option-language">
                            <q-text>{{ $t('ui-language') }}</q-text>
                            <q-radio v-model="language" value="en">English</q-radio>
                            <q-radio v-model="language" value="zh-CN">简体中文</q-radio>
                        </div>

                    </q-collapse>
                </q-panel>

                <q-panel class="panel" border>
                    <q-collapse :title="$t('about')" :title-colorful="true" :value="true">
                        <q-divider class="collapse-divider"></q-divider>
                        <q-footnote style="margin-bottom: 8px;">{{ $t('about-powered') }}</q-footnote>
                        <q-button icon="open" size="small" href="https://qiqi-1996.github.io/qi-sketch-exporter">{{$t("about-help")}}</q-button>
                        <q-button icon="open" size="small" href="https://github.com/qiqi-1996/qi-sketch-exporter">GitHub</q-button>
                    </q-collapse>
                </q-panel>

            </div>
        </transition>
    </div>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.layout-right {
    position: absolute;
    width: 320px;
    max-height: 100%;
    top: 0px;
    right: 0px;
    overflow-x: hidden;
    overflow-y: auto;

    .topbar {
        text-align: right;
        margin: 2*@grid;
    }

    .panel {
        margin: 2*@grid;

        .collapse-divider {
            margin-bottom: 2*@grid;
        }
        
        .option {
            margin-bottom: 2*@grid;

            .title {
                margin-bottom: 2*@grid;
            }
        }

        .option-switch {
            cursor: pointer;

            .left, .right {
                width: 50%;
                display: inline-block;
                vertical-align: middle;
            }

            .right {
                pointer-events: none;
                text-align: right;
            }
        }

        .option-color {
            
            .flex {
                display: flex;
                justify-content: space-around;
            }

            .q-hover {
                margin-right: @grid;
                cursor: pointer;
                display: inline-block;
                text-align: center;
                padding: 4px;
                border-radius: 24px;
            }
        }

        .option-language {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }
    }

    .property {
        margin-bottom: 2*@grid;
    }
}

.layout-right[class*="hidden"]{
    width: auto;
    height: auto;
}

.transition-layout-right-enter-active, .transition-layout-right-leave-active {
    .transition();
}

.transition-layout-right-enter, .transition-layout-right-leave-to {
    transform: translate(100%, 0);
}
</style>

<script>
import store from "/store.js";
import assetsList from "./assets-list/index.vue";
import property from "./properties/index.vue";
import messages from "./index.i18n.json";

export default {
    i18n: {
        messages
    },
    components: {
        property,
        assetsList
    },
    props: ["layer"],
    data(){
        return {
            enable: true,
            darkmode: false,
            color: {
                current: "poe",
                hover: { color: "none" },
                actived: { color: "secondary", border: "inherit"}
            },
            language: store.i18n.locale
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.darkmode = store.enableDarkMode;
        })
    },
    watch: {
        language(newValue, oldValue){
            if(newValue != oldValue){
                store.i18n.locale = newValue;
            }
        }
    },
    computed: {
        parsedProperties(){
            let p = this.layer;
            if(p == null){
                return result;
            }

            let result = {};
            result.name = p.name;
            result.position = { x: p.x , y: p.y };
            result.size = { width: p.width, height: p.height };
            p.properties.opacity != 1 && (result.opacity = p.properties.opacity);
            if(p.type=="Text"){
                result.font = p.properties.fontSize + " px, " + p.properties.fontFamily || null;
                result.alignment = p.properties.alignment || null;

                result.content = p.properties.text || null;
            }
            return result;
        }
    },
    methods: {
        toggle(){
            this.enable = !this.enable;
        },
        toggleDarkMode(){
            store.enableDarkMode = !store.enableDarkMode;
            this.darkmode = store.enableDarkMode;
        },
        toggleColor(colorname){
            store.color = colorname;
            this.color.current = colorname;
        }
    }
}
</script>