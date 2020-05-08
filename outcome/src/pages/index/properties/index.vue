<template>
    <div class="property">
        <component :is="displayComponent" v-if="type && data" :name="$t(type)" :data="data"></component>
    </div>
</template>

<script>
import defaults from "./default.vue";
import position from "./position.vue";
import size from "./size.vue";
import alignment from "./alignment.vue";
import ptext from "./text.vue";

import messages from "./properties.i18n.json";

const components = {
    defaults,

    position,
    size,
    alignment,
    ptext
}

const componentsNameMap = Object.keys(components);

export default {
    components,
    i18n: {
        messages
    },
    props: {
        type: String,
        data: {}
    },
    computed: {
        displayComponent(){
            if(componentsNameMap.indexOf(this.type) != -1){
                return this.type;
            } else if(this.type === "content"){
                return "ptext";
            } else {
                return "defaults";
            }
        }
    }
}
</script>

