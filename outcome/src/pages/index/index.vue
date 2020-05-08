<template>
    <div class="page">

        <q-panel class="layout-left" border>
            <div class="margin-block-4">
                <q-title class="block-title" :level="2" mode="single" colorful>{{ $t("layers") }}</q-title>

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

                <q-title class="block-title" :level="2" mode="single" colorful>{{ $t("artboards") }}</q-title>

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
        </q-panel
        ><q-panel class="layout-content" secondary>
            <artboard :image="currentArtboardImage" :data="currentArtboard" @select="handleSelect"></artboard>
        </q-panel>

        <layout-right :layer="selectedLayer"></layout-right>
    </div>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.margin-block(4, 4);

.page {
    white-space: nowrap;
    // font-size: 0px;
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
</style>

<script>
import artboard from "./artboard.vue";
import layoutRight from "./layoutRight.vue";
import messages from "./index.i18n.json";

export default {
    i18n: {
        messages
    },
    components: {
        artboard,
        layoutRight
    },
    data(){
        return {
            state: "loading",
            errorMessage: "",
            manifest: [],
            currentPageIndex: 0,
            currentArtboardIndex: 0,

            config: {
                listItem: {
                    hover: {
                        border: "default"
                    }
                }
            },

            selectedLayer: null
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
        handleSelect(layer){
            console.log(layer);
            this.selectedLayer = layer;
        }
    }
};
</script>