import Vue from "vue";

const vm = new Vue({
    data() {
        return {
            i18n: null,
            enableDarkMode: false,
            theme: "light",
            color: "poe"
        }
    },
    watch: {
        enableDarkMode: {
            handler(newValue) {
                if (newValue) {
                    this.theme = "dark";
                } else {
                    this.theme = "light"
                }
            },
            immediate: true
        }
    }
});

export default vm;