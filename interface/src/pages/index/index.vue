<template>
    <div>
        <the-header title="STEP 1" description="Choose the layers that you want to export."></the-header>
        <q-divider></q-divider>

        <div class="content">
            <div class="pages" v-for="(page, index) in list" :key="index">
                
                <div class="collapse-header" @click="toggleCollapse(page.id)">
                    <q-footnote>{{page.name}} ( {{getSelectedNumbers(page.id)}} / {{page.artboards.length}} )</q-footnote>
                    <div class="right">
                        <q-footnote class="select-all" @click.native.stop="toggleSelectAll(page.id)">{{ isAllSelected(page.id)?"Unselect All":"Select All" }}</q-footnote>
                        <q-icon :class="['indicator', page.expand?'active':'']" name="right" container="q-footnote"></q-icon>
                    </div>
                </div>

                <q-collapse v-model="page.expand">
                    <q-checkbox v-for="artboard in page.artboards" :key="artboard.id" :value="artboard.id" v-model="artboard.selected">{{artboard.name}}</q-checkbox>
                </q-collapse>
            </div>
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
        margin-bottom: 3*@grid;

        .q-checkbox {
            display: block;
            // margin-top: 2*@grid;
            padding: @grid 0px;
        }
    }

    .pages:last-of-type {
        margin: 0px;
    }

    .collapse-header {
        padding: @grid 0px;
        cursor: pointer;

        .right {
            float: right;
            margin-top: 2px;
        }

        .select-all {
            margin-right: @grid;
        }

        .active {
            transform: rotate(90deg);
        }

        * {
            display: inline-block;
            vertical-align: middle;
        }
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
            list: this.preprocess(mock)
        }
    },
    computed: {
        selected(){
            let result = [];
            this.list.forEach(page=>{
                result = result.concat(page.artboards.filter(artboard=>artboard.selected).map(artboard=>artboard.id));
            })
            return result;
        }
    },
    mounted(){
        window.doExportList = (data)=>{
            console.log(data, typeof data);
            this.list = this.preprocess(data);
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
        preprocess(data) {
            return data.map(page=>{
                page.expand = true;
                page.artboards = page.artboards.map(artboard=>{
                    artboard.selected = false;
                    return artboard;
                })
                return page;
            })
        },
        toggleCollapse(pageID){
            for(let i in this.list){
                let page = this.list[i]
                if(page.id == pageID){
                    page.expand = !page.expand;
                    break;
                }
            }
        },
        getSelectedNumbers(pageID){
            for(let i in this.list){
                let page = this.list[i]
                if(page.id == pageID){
                    return page.artboards.filter(artboard=>artboard.selected).length;
                }
            }
        },
        isAllSelected(pageID){
            for(let i in this.list){
                let page = this.list[i]
                if(page.id == pageID){
                    return (page.artboards.filter(artboard=>artboard.selected).length == page.artboards.length);
                }
            }
        },
        toggleSelectAll(pageID){
            let state = !this.isAllSelected(pageID);
            for(let i in this.list){
                let page = this.list[i]
                if(page.id == pageID){
                    page.artboards.forEach(artboard=>{
                        artboard.selected = state;
                    })
                }
            }
        },
        duang(){
            window.postMessage("doGetSavePath");
            console.log(this.selected);
        }
    }
}
</script>