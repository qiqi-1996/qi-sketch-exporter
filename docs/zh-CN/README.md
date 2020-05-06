# 概述

**Qi Sketch Exporter** 是一个 Sketch 设计图导出插件，可以帮助你把设计图转换为适合程序开发人员预览的交接文档。例如：自动标注元素尺寸及边距、自动导出切片等等。更多功能请查看下方的[特性列表](#特性)，或者直接查看 <a href="preview/index.html">在线 DEMO</a>。

<Note label="Tips">

如果您在使用中有任何建议或意见，请在 [GitHub Issues](https://github.com/qiqi-1996/qi-sketch-exporter/issues) 上反馈（请尽可能的使用英语）。

对于中国（中文）用户，也可以加入 QQ 群交流：[634121064](https://jq.qq.com/?_wv=1027&k=5lH8p4c)

</Note>

## 安装

<center>
    <a :href="`https://qiqi-1996.github.io/qi-sketch-exporter/releases/qi-sketch-exporter.${VERSION}.zip`" class="download">下载插件 Version {{VERSION}}</a>
    <br>
    <a href="https://github.com/qiqi-1996/qi-sketch-exporter/releases">查看历史版本</a>
</center>

下载完成后解压，然后双击 `qi-sketch-exporter.sketchplugin` 即可完成安装。使用方法详见 [使用说明](usage.md)。

<style>
.download {
    background: #009688;
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
}
</style>

## 特性

* 自动标注元素的尺寸和边距
* 插件界面及导出界面自动适应系统主题（明亮模式和暗黑模式）
* 标注元素的各项属性 字体、字号、颜色 等（开发中）

## 开源协议

MIT

## 鸣谢

* [Sketch Measure](https://github.com/utom/sketch-measure)，本项目参考了 Sketch Measure 的诸多代码。

## 捐助项目

本项目从设计图到代码完全免费开源，不以任何方式出售和干预（谨请遵守 MIT 开源协议）插件及其全部相关文件的使用权。如果您觉得本项目对您的工作给予了很大的帮助，请考虑捐助这个项目继续发展。

<ImageZoom src="/assets/donate-alipay.jpg" :border="true" width="300"/>