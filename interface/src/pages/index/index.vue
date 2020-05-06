<template>
    <div>
        <the-header title="STEP 1" description="Choose the layers that you want to export."></the-header>
        <q-divider></q-divider>

        <div class="content">
            <q-form-group v-model="selected">
                <div class="pages" v-for="(page, index) in list" :key="index">
                    <q-footnote class="page-name">{{page.name}}</q-footnote>
                    <q-checkbox v-for="artboard in page.artboards" :key="artboard.id" :value="artboard.id">{{artboard.name}}</q-checkbox>
                </div>
            </q-form-group>
        </div>

        <q-panel class="controller">
            <div class="buttons">
                <q-button size="large" type="primary" @click="duang">Next</q-button>
            </div>
            <div class="footnote">
                <q-footnote mode="single" class="name">Qi Sketch Exporter</q-footnote>
                <q-footnote mode="single" class="github">GitHub <q-icon name="open"></q-icon></q-footnote>
            </div>
        </q-panel>
    </div>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.content {
    .noselect();
    padding: 4*@grid;
    max-height: 306px - 2*4*@grid;
    overflow: auto;

    .pages {
        margin-bottom: 4*@grid;

        .page-name {
            margin-bottom: @grid;
        }

        .q-checkbox {
            display: block;
            // margin-top: 2*@grid;
            padding: @grid 0px;
        }
    }

    .pages:last-of-type {
        margin: 0px;
    }
}

.controller {
    padding: 2*@grid 4*@grid;

    .q-button {
        width: 100%;
    }

    .footnote {
        margin-top: 2*@grid;
        
        .name {
            float: left;
        }

        .github {
            float: right;
        }
    }

}
</style>

<script>

var mock = [
    {
        id: "0",
        name: "Plugin",
        artboards: [
            { id: "1", name: "step-1" },
            { id: "2", name: "export-processing" },
            { id: "3", name: "export-done" },
            { id: "4", name: "export-failed" },
        ]
    },
    {
        id: "5",
        name: "Outcome",
        artboards: [
            { id: "6", name: "桌面端 HD" },
            { id: "7", name: "桌面端 HD" },
            { id: "8", name: "桌面端 HD" },
            { id: "9", name: "桌面端 HD" },
            { id: "10", name: "桌面端 HD" },
            { id: "11", name: "桌面端 HD" },
            { id: "12", name: "桌面端 HD" },
        ]
    }
]


export default {
    data(){
        return {
            selected: [],
            list: mock
        }
    },
    mounted(){
        window.doExportList = (data)=>{
            console.log(data, typeof data);
            this.list = data;
        }

        window.doGetSavePath = (data)=>{
            if(data.path){
                console.log(data, typeof data);
                window.postMessage("doHide");

                let sorted = [];
                for(let p in this.list){
                    let page = this.list[p];
                    for(let a in page.artboards){
                        let artboard = page.artboards[a];
                        if(this.selected.indexOf(artboard.id)!=-1){
                            sorted.push(artboard.id);
                        }
                    }
                }

                this.$router.push({ name: "workspace" , params: {
                    path: data.path,
                    selected: sorted
                } });
            }
        };

        window.postMessage("doExportList");
    },
    methods: {
        duang(){
            window.postMessage("doGetSavePath");
            console.log(this.selected);;
        }
    }
}
</script>