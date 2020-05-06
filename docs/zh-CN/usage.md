# 使用说明

使用前请先[安装插件](./README.md#安装)

## 导出

> 此段落是关于 Sketch 插件的使用说明，导出后的标记文档使用说明请查看：[标记文档](#标记文档)

安装插件后，在 Sketch 应用中的菜单部分找到 **插件** -> **Qi Sketch Exporter** -> **Export**。此时，您将看到导出选择界面，如下：（插件会判断系统是否启用了暗黑模式而采用不同的配色，因此您可能会看到与截图不一样的界面，但是使用方法是一样的）

<ImageZoom src="/assets/usage-plugin-1.png" :border="true" width="300" />

点击勾选您想要导出的图层和画板，然后点击 **Next** 选择保存位置。点击 保存 后将显示导出进度界面，等待导出完成，您将看到如下的导出成功提示：

<ImageZoom src="/assets/usage-plugin-2.png" :border="true" width="300" />

点击 **Open The Folder** 打开标记文档的所在目录，双击（使用浏览器打开）**index.html** 即可查看标记文档。

## 标记文档

标记文档的布局和功能大致如下图所示，在左侧可以切换与 Sketch 命名相对应的 图层（Layer） 和 画板（Artboards）。中间部分是当前打开的画板。最右侧为附属栏（目前仅有界面设置面板）。

<ImageZoom src="/assets/usage-mark-1.png" :border="true" />

点击画板中的元素，并将鼠标移动到其他元素上，将可以看到选中元素与鼠标指向元素之间的距离关系（如下图所示）。鼠标指向到空白位置时，将显示元素与画板的距离关系。

<ImageZoom src="/assets/usage-mark-2.png" :border="true" />

如果标记线段的颜色与您的设计颜色相似而导致可视程度降低，可以通过右侧的 界面设置面板（UI Settings） 的 主题颜色（Theme Color）更改为其他颜色。如下：

<ImageZoom src="/assets/usage-mark-3.png" :border="true" />

标记文档也会自动检测系统当前是否启用了暗黑模式，而改变页面配色。您也可以通过 界面设置面板（UI Settings）手动控制。如下：

<ImageZoom src="/assets/usage-mark-4.png" :border="true" />
