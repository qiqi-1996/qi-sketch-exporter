# Summary

<center>
    <img :src="`${URL_PREFIX}/assets/banner.png`" height="320px" />
</center>

**Qi Sketch Exporter** is an UI design export plugin for Sketch, which can help you convert the design graphics into a handover document that suitable for developers to preview. For example: Auto mark element's size and margin, auto export slice, etc. All features can be found at [Features](#Features), or you can try it by this <a href="preview/index.html">Online Demo</a>。

<Note label="Tips">

If you have any suggestions or comments in use, please feedback on [GitHub Issues](https://github.com/qiqi-1996/qi-sketch-exporter/issues)

</Note>

<Note type="warning">

Qi Sketch Exporter is work-in-progress（Including the front-end component library used in the project [Qi Design Vue](https://qiqi-1996.github.io/qi-design-vue/) is also in the Alpha testing stage).Please be aware of the possibility of errors and risks in this project before applying this project to a business environment
</Note>


## Install

<center>
    <a :href="`https://qiqi-1996.github.io/qi-sketch-exporter/releases/qi-sketch-exporter@${VERSION}.zip`" class="download">Download Version {{VERSION}}</a>
    <br>
    <a href="https://github.com/qiqi-1996/qi-sketch-exporter/releases">Checkout History Versions</a>
</center>

After downloading, unzip it, and then double-click `qi-sketch-exporter.sketchplugin` to complete the installation. For details, please refer to [Instructions](usage.md)

<style>
.download {
    background: #CC8800;
    text-align: center;
    color: #FFF;
    font-weight: bolder;
    display: inline-block;
    padding: 0px 32px;
    margin: 16px 0px;
    line-height: 48px;
    border-radius: 48px;
}
.download:hover {
    text-decoration: none !important;
    opacity: 0.75;
}
</style>

## Features

* Automatically mark elements's sizes and margins
* Plugin interface and Marked Document automatically adapt to the system theme (Light Mode or Dark Mode)
* Mark the various attributes of the element font, size, color, etc.（Developing）

## License

MIT

## Thanks

* [Sketch Measure](https://github.com/utom/sketch-measure) This project refers to many codes of Sketch Measure.