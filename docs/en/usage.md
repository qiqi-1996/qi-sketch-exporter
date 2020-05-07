# Usage

Please [install](./README.md#Install) before use.

## Export

> This paragraph is about the usage instructions of the plugin. If you are looking for Marked Document, checkout [Marked Document](#marked-document)

After installing the plugin, find **Plugin** -> **Qi Sketch Exporter** -> **Export** in the menu section of the Sketch App.At this point, you will see the export interface as follows(The plugin will determine whether the system is enabled with dark mode and uses a different color scheme, so you may see a different interface than the screenshot, but the method of use is the same):

<ImageZoom :src="`${URL_PREFIX}/assets/usage-plugin-1.png`" :border="true" width="300" />

Click to check the layers and artboards you want to export, and then click **Next** to select the save location. After clicking Save, the export progress interface will be displayed. Wait for the export to complete, and you will see the following export success prompt:

<ImageZoom :src="`${URL_PREFIX}/assets/usage-plugin-2.png`" :border="true" width="300" />

Click **Open The Folder** to open the directory where the Marked Document is located, and double-click (open with a browser) **index.html** to view the Marked Document.

## Marked Document

The layout and functions of the Marked Document are roughly as shown in the following screenshot. On the left side, you can switch the layer and artboard corresponding to the Sketch's named. The middle part is the currently open artboard. On the far right is the auxiliary column (currently only the interface settings panel).

<ImageZoom :src="`${URL_PREFIX}/assets/usage-mark-1.png`" :border="true" />

Click on the element in the artboard, and move the mouse to other elements, you can see the distance relationship between the selected element and the element pointed by the mouse (as shown below). When the mouse points to a blank position, the distance relationship between the element and the artboard will be displayed.

<ImageZoom :src="`${URL_PREFIX}/assets/usage-mark-2.png`" :border="true" />

If the color of the marked line is similar to the color of your design and the visibility is not well, you can change it to a different color through the Theme Color of the UI Settings panel on the right. as follows:

<ImageZoom :src="`${URL_PREFIX}/assets/usage-mark-3.png`" :border="true" />

Marked Document will also automatically detect whether the system is currently enabled for Dark Mode, and change the page color. You can also control it manually through the UI Settings panel. as follows:

<ImageZoom :src="`${URL_PREFIX}/assets/usage-mark-4.png`" :border="true" />
