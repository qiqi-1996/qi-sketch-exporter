<template>
    <div class="page">

        <q-panel class="layout-left" border>
            <div class="margin-block-4">
                <q-title class="block-title" :level="2" mode="single" colorful>Layers</q-title>

                <div class="block-list">
                    <q-hover
                        class="list-item" 
                        v-for="(page, index) in pagesList" 
                        :key="index"
                        :config="config.listItem"
                        :active="currentPageIndex == index"
                        @click="doChangePage(index)"
                    >{{page}}</q-hover>
                </div>

                <q-divider class="block-divider"></q-divider>

                <q-title class="block-title" :level="2" mode="single" colorful>Artboards</q-title>

                <div class="block-list">
                    <q-hover
                        class="list-item" 
                        v-for="(artboard, index) in artboardsList" 
                        :key="index"
                        :config="config.listItem"
                        :active="currentArtboardIndex == index"
                        @click="doChangeArtboard(index)"
                    >
                        <q-panel border class="preview" :style="{ backgroundImage: `url(${artboard.preview})` }"></q-panel>
                        <div class="info">
                            <q-text mode="single"><span class="inner-text">{{artboard.name}}</span></q-text>
                            <q-footnote mode="single"><span class="inner-text">{{artboard.description}}</span></q-footnote>
                        </div>
                    </q-hover>
                </div>
            </div>
        </q-panel>

        <q-panel class="layout-content" secondary>
            <artboard :image="currentArtboardImage" :data="currentArtboard"></artboard>
        </q-panel>

        <div :class="['layout-right', config.ui.layoutRight?'':'hidden']">
            <div class="topbar">
                <q-button :icon="config.ui.layoutRight?'right':'left'" style="width: 32px;" @click="toggleLayoutRight" type="primary"></q-button>
            </div>

            <span v-show="config.ui.layoutRight">

                <q-panel class="panel">
                    <q-title :level=3 colorful>UI Settings</q-title>

                    <div class="option option-switch" @click="toggleDarkMode">
                        <div class="left">
                            <q-text>Dark Mode</q-text>
                        </div>
                        <div class="right">
                            <q-switch v-model="config.ui.darkmode"></q-switch>
                        </div>
                    </div>

                    <div class="option option-color">
                        <q-text>Theme Color</q-text>
                        <q-hover :config="config.ui.color" :active="config.ui.color.current==='poe'" @click.native="toggleColor('poe')"><q-color-block :size="16" color="poe" round></q-color-block></q-hover>
                        <q-hover :config="config.ui.color" :active="config.ui.color.current==='starrynight'" @click.native="toggleColor('starrynight')"><q-color-block :size="16" color="starrynight" round></q-color-block></q-hover>
                        <q-hover :config="config.ui.color" :active="config.ui.color.current==='enjolras'" @click.native="toggleColor('enjolras')"><q-color-block :size="16" color="enjolras" round></q-color-block></q-hover>
                        <q-hover :config="config.ui.color" :active="config.ui.color.current==='sunflower'" @click.native="toggleColor('sunflower')"><q-color-block :size="16" color="sunflower" round></q-color-block></q-hover>
                        <q-hover :config="config.ui.color" :active="config.ui.color.current==='spring'" @click.native="toggleColor('spring')"><q-color-block :size="16" color="spring" round></q-color-block></q-hover>
                    </div>

                </q-panel>

            </span>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.margin-block(4, 4);

.page {
    white-space: nowrap;
    font-size: 0px;
    width: 100%;
    height: 100%;
}

.layout-left {
    width: 320px;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    overflow: auto;
    border-left: none !important;
    border-top: none !important;
    border-bottom: none !important;

    .block-title {
        margin-bottom: 3 * @grid;
    }

    .block-divider {
        margin-top: 4*@grid;
        margin-bottom: 4 * @grid;
    }

    .block-list {
        .list-item {
            cursor: pointer;
            padding: @grid;
            margin-bottom: @grid;
            border-radius: 2px;
            overflow: hidden;

            .preview {
                float: left;
                width: 64px;
                height: 64px;
                background-color: @color-white;
                background-size: contain;
                border-radius: 2px;
                margin-right: 2*@grid;
            }

            .info * {
                margin-top: @grid;
            }

        }

        .q-hover[class*="theme-light"][class~="active"] .inner-text {
            font-weight: bolder;
            color: @color-light-background !important;
        }

        .q-hover[class*="theme-dark"][class*="color-poe"][class~="active"] .inner-text {
            font-weight: bolder;
            color: @color-dark-background !important;
        }
    }
}

.layout-content {
    width: calc(~"100% - 320px");
    height: 100%;
    display: inline-block;
    vertical-align: top;
}

.layout-right {
    position: absolute;
    width: 320px;
    height: 100%;
    top: 0px;
    right: 0px;

    .topbar {
        text-align: right;
        margin: 2*@grid;
    }

    .panel {
        margin: 2*@grid;
        padding: 2*@grid;

        .option-switch {
            margin: 2*@grid 0px;
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
            .q-text {
                margin-bottom: @grid;
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
    }
}

.layout-right[class*="hidden"]{
    width: auto;
    height: auto;
}
</style>

<script>
import store from "/store.js";
import artboard from "./artboard.vue";

export default {
    components: {
        artboard
    },
    data(){
        return {
            state: "loading",
            errorMessage: "",
            manifest: [],
            currentPageIndex: 0,
            currentArtboardIndex: 0,

            config: {
                ui: {
                    darkmode: store.enableDarkMode,
                    color: {
                        current: "poe",
                        hover: { color: "none" },
                        actived: { color: "secondary", border: "inherit"}
                    },
                    layoutRight: true
                },
                listItem: {
                    hover: {
                        border: "default"
                    }
                }
            }
        }
    },
    computed: {

        pagesList(){
            return ["All"].concat(this.manifest.map((item)=>{
                return item.name;
            }));
        },
        artboardsList(){
            let result = []
            if(this.currentPageIndex == 0){
                this.manifest.forEach((page)=>{
                    page.layers.forEach((artboard)=>{
                        result.push({
                            name: artboard.name,
                            description: artboard.width + " × " + artboard.height,
                            preview: `./assets/${artboard.id}@0.2x.png`,
                            source: artboard
                        });
                    });
                })
            }else{
                this.manifest[this.currentPageIndex-1].layers.forEach((artboard)=>{
                    result.push({
                        name: artboard.name,
                        description: artboard.width + " × " + artboard.height,
                        preview: `./assets/${artboard.id}@0.2x.png`,
                        source: artboard
                    });
                });
            }
            return result;
        },
        currentArtboard(){
            return this.artboardsList[this.currentArtboardIndex]?.source;
        },
        currentArtboardImage(){
            if(this.currentArtboard){
                return './assets/'+this.currentArtboard.id +"@2x.png";
            }
            return "";
        }
    },
    mounted() {
        // this.loadManifest();
        window.onManifestLoaded = ()=>{
            this.manifest = window.manifest;
        }

        let script = document.createElement("script");
        script.setAttribute("src", "./manifest.js");
        document.body.appendChild(script);
    },
    methods: {
        loadManifest() {
            let request = new XMLHttpRequest();
            request.open("GET", "./manifest.json", true);
            request.send();
            request.onreadystatechange = () => {
                if (request.readyState == 4) {
                    if(request.status == 200 || request.status == 0){
                        this.state = "done";
                        this.manifest = JSON.parse(request.responseText);
                    }else if(request.status == 404){
                        this.state = "error";
                        this.errorMessage = "404";
                    }else{
                        this.state = "error";
                    }
                }
            };
        },
        doChangePage(index){
            this.currentPageIndex = index;
            this.currentArtboardIndex = 0;
        },
        doChangeArtboard(index){
            this.currentArtboardIndex = index;
        },
        toggleDarkMode(){
            store.enableDarkMode = !store.enableDarkMode;
            this.config.ui.darkmode = store.enableDarkMode;
        },
        toggleColor(colorname){
            store.color = colorname;
            this.config.ui.color.current = colorname;
        },
        toggleLayoutRight(){
            this.config.ui.layoutRight = !this.config.ui.layoutRight;
        }
    }
};
</script>