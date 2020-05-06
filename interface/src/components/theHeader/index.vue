<template>
    <div class="header-container" data-app-region="drag">
        <q-title :level="2" mode="single">{{title}}</q-title>
        <q-footnote mode="single" class="description">{{description}}</q-footnote>
    </div>
</template>

<style lang="less" scoped>
@import "~@qiqi1996/qi-design-vue/standard.less";

.header-container {
    .noselect();
    padding: 4*@grid;

    .description {
        margin-top: @grid;
    }
}
</style>

<script>
export default {
    props: {
        title: String,
        description: String
    }
}
</script>