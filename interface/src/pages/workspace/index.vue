<template>
    <q-panel class="page" :color="stateColor">
        <the-header :title="stateTitle" :description="description"></the-header>

        <div class="content">
            <q-progress :current="progress" round :animation="false"></q-progress>
        </div>

        <q-divider></q-divider>

        <div class="foobar" v-if="state==='processing'">
            <q-button>Abort</q-button>
        </div>
        <div class="foobar" v-else-if="state==='failed'">
            <q-button @click="doExit">Close</q-button>
            <q-button type="primary">Retry</q-button>
        </div>
        <div class="foobar" v-else-if="state==='done'">
            <q-button @click="doExit">Close</q-button>
            <q-button type="primary" @click="doOpenDirectory">Open The Folder</q-button>
        </div>
    </q-panel>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.content {
    padding: 0px 4 * @grid;
    margin-bottom: 4 * @grid;
}

.foobar {
    text-align: right;
    padding: 2 * @grid 4 * @grid;
    
    .q-button {
        margin-left: 2*@grid;
    }
}
</style>

<script>
export default {
    data() {
        return {
            progress: 0,
            error: "",
            description: "Please wait",

            debounceTime: 0
        };
    },
    computed: {
        state(){
            if(this.error){
                return "error";
            }
            if(this.progress==1){
                return "done";
            }
            return "processing";
        },
        stateColor(){
            if(this.state === "error"){
                return "enjolras";
            }
            if(this.state === "done"){
                return "spring";
            }
            return "poe";
        },
        stateTitle(){
            if(this.state === "error"){
                return "Failed.";
            }
            if(this.state === "done"){
                return "Done.";
            }
            return "Processing...";
        }
    },
    mounted() {
        window.postMessage("doShow");
        window.postMessage("doExport", this.$route.params);

        window.doProgress = data => {
            // if (data.progress && Date.now() - this.debounceTime > 500) {
            //     this.debounceTime = Date.now();
            //     this.progress = Number(data.progress);
            // }
            if (data.progress) {
                this.progress = Number(data.progress);
            }
            if (data.description) {
                this.description = data.description;
            }
            if (Number(data.progress) == 1) {
                this.progress = 1;
            }
        };
    },
    methods: {
        doExit(){
            window.postMessage("doExit");
        },
        doOpenDirectory(){
            window.postMessage("doOpenDirectory", this.$route.params.path);
            setTimeout(()=>{
                window.postMessage("doExit");
            });
        }
    }
};
</script>