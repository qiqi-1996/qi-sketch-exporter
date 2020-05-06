import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'

import functions from "./functions/index.js";

const webviewIdentifier = 'qi-sketch-plugin.webview'

export default function () {
    const options = {
        identifier: webviewIdentifier,
        width: 350,
        // height: 550,
        frame: false,
        transparent: true,
        show: false,

        useContentSize: true,
        alwaysOnTop: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
    }

    const win = new BrowserWindow(options)

    // only show the window when the page has loaded to avoid a white flash
    win.once('ready-to-show', () => {
        win.show()
    })

    const webContents = win.webContents

    const context = {
        webContents,
        webviewIdentifier
    }

    webContents.on("doResizeWindow", function (width, height) {
        var bound = win.getBounds()
        if (width) {
            bound.width = width;
        }
        if (height) {
            bound.height = height;
        }
        console.log(bound);
        win.setSize(bound.width, bound.height);
        win.setBounds(bound)
    })

    webContents.on('doExit', () => {
        const existingWebview = getWebview(webviewIdentifier)
        if (existingWebview) {
            existingWebview.close()
        }
    })

    webContents.on('doHide', () => {
        win.hide();
    })

    webContents.on('doShow', () => {
        win.show();
    })

    for (let key in functions) {
        webContents.on(key, function() {
            try {
                console.log(key, arguments);
                let result = functions[key](arguments, context);
                if (typeof result == "object") {
                    result = JSON.stringify(result);
                }
                if (result) {
                    webContents.executeJavaScript(`${key}(${result})`);
                }
            } catch (e) {
                console.log(e);
            }
        })
    }

    win.loadURL(require('../resources/index.html'))
}

export function onShutdown() {
    const existingWebview = getWebview(webviewIdentifier)
    if (existingWebview) {
        existingWebview.close()
    }
}