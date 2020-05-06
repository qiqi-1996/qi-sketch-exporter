const path = require("path");
const process = require("process");
const sketch = require("sketch/dom");

var mock = {
    path: '/Users/thomas/Downloads/qi-sketch-exporter',
    selected: [
        '0C42C566-1EF4-42FF-B056-99F61D644F77',
        '79DBB6A4-04AC-4AF5-AE77-C98DDA6A4567'
    ]
}

// sketch.export(layer, {
//     output: "/Users/thomas/Downloads",
//     formats: "png",
//     scales: "2",
//     "use-id-for-name": true
// })

// layer.type - SymbolInstance（组件）、Group（组）
// layer.id - 0C42C566-1EF4-42FF-B056-99F61D644F77
// layer.name - 图层名
// layer.frame - { x: 256, y: 120, width: 350, height: 550 }
// layer.exportFormats - 
// {
//     type: 'ExportFormat',
//     fileFormat: 'png',
//     suffix: '',
//     size: '2x'
// }

function toJSString(str){
    return new String(str).toString();
}

function writeFile(options) {
    var options = Object.assign({
            content: "Type something!",
            path: toJSString(NSTemporaryDirectory()),
            fileName: "temp.txt"
        }, options),
        content = NSString.stringWithString(options.content),
        savePathName = [];

    NSFileManager
        .defaultManager()
        .createDirectoryAtPath_withIntermediateDirectories_attributes_error(options.path, true, nil, nil);

    savePathName.push(
        options.path,
        "/",
        options.fileName
    );
    savePathName = savePathName.join("");

    content.writeToFile_atomically_encoding_error(savePathName, false, 4, null);
}

export default function (args, context) {
    var { webContents } = context;

    var savepath = args[0].path;
    var selectedArtboards = args[0].selected;
    var document = sketch.getSelectedDocument();

    var FileManager = NSFileManager.defaultManager()
    if (!FileManager.fileExistsAtPath(savepath)) {
        FileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(savepath, true, nil, nil);
    }

    var result = [];
    var LayerExportList = []
    var extractCurrent = 0;
    var extractTotal = 0;

    function executeJavaScript(key, data) {
        if (typeof data == "object") {
            data = JSON.stringify(data);
        }
        webContents.executeJavaScript(`${key}(${data})`);
    }

    function findResult(pageID) {
        for (let i in result) {
            if (result[i].id == pageID) {
                return result[i];
            }
        }
        let page = document.getLayerWithID(pageID);
        let currentResult = {
            id: page.id,
            name: page.name,
            layers: []
        }
        result.push(currentResult);
        return currentResult;
    }

    function extractLayer(layer, basisArtboard) {

        if (layer.hidden) {
            return null;
        }

        if (layer.layers) {
            extractTotal += layer.layers.length;
        }

        executeJavaScript("doProgress", {
            progress: (extractCurrent/extractTotal)/2,
            description: "Parsing " + layer.name
        });

        let currentResult = {
            id: layer.id,
            type: layer.type,
            name: layer.name,

            x: layer.frame.x,
            y: layer.frame.y,
            width: layer.frame.width,
            height: layer.frame.height,
            shapeType: layer.frame.shapeType,

            properties: {
                sharedStyleId: layer.style.sharedStyleId,
                
                /*******  *******/
                
                text: layer.text,

                /*******  *******/

                opacity: layer.style.opacity,
                // 1
                blendingMode: layer.style.blendingMode,
                // Normal
                rotation: layer.transform.rotation,
                // 0
                flippedHorizontally: layer.transform.flippedHorizontally,
                // false
                flippedVertically: layer.transform.flippedVertically,
                // false
                borderDashPattern: layer.style.borderOptions.dashPattern,
                // []

                fills: layer.style.fills,
                /*
                    [
                        {
                            fillType: "Color",
                            color: "#d8d8d8ff",
                            gradient: {
                                gradientType: 'Linear',
                                from: { x: 0.5, y: 0 },
                                to: { x: 0.5, y: 1 },
                                aspectRatio: 0,
                                stops: [ { position: 0, color: '#ffffffff' }, { position: 1, color: '#000000ff' } ] 
                            },
                            pattern: { patternType: 'Fill', image: null, tileScale: 1 },
                            enabled: true
                        }
                    ]
                */
                borders: layer.style.borders,
                /* 
                    [
                        {
                            fillType: 'Color',
                            position: 'Center',
                            color: '#979797ff',
                            gradient: {
                                gradientType: 'Linear',
                                from: { x: 0.5, y: 0 },
                                to: { x: 0.5, y: 1 },
                                aspectRatio: 0,
                                stops: [ { position: 0, color: '#ffffffff' }, { position: 1, color: '#000000ff' } ] 
                            },
                            thickness: 1,
                            enabled: true
                        }
                    ]
                */

                textColor: layer.style.textColor,
                alignment: layer.style.alignment,
                verticalAlignment: layer.style.verticalAlignment,
                lineHeight: layer.style.lineHeight,
                kerning: layer.style.kerning,
                paragraphSpacing: layer.style.paragraphSpacing,
                fontSize: layer.style.fontSize,
                textTransform: layer.style.textTransform,
                fontFamily: layer.style.fontFamily,
                fontWeight: layer.style.fontWeight,
                fontAxes: layer.style.fontAxes,
                lineSpacing: layer.lineSpacing,
                fixedWidth: layer.fixedWidth,
                // (Text)
            },

            assets: [],
            layers: []
        }

        if (!basisArtboard) {
            basisArtboard = layer
        } else {
            let rect = layer.frame.changeBasis({
                from: layer.parent,
                to: basisArtboard
            });
            currentResult.x = rect.x
            currentResult.y = rect.y
        }

        if (layer.type == "Artboard") {
            // 导出画板预览图
            LayerExportList.push({
                layer: layer,
                option: {
                    output: savepath + "/assets",
                    formats: "png",
                    scales: "0.2,2",
                    "use-id-for-name": true
                }
            })

            currentResult.assets.push(`${layer.id}@0.2x.png`);
            currentResult.assets.push(`${layer.id}@2x.png`);
        }

        // for (let i = 0; i < currentResult.properties.fills.length; i++){
        //     let fill = currentResult.properties.fills[0];
        //     if (fill.pattern.image) {
                
        //     }
        // }

        if (layer.exportFormats && layer.exportFormats.length) {
            for (let i = 0; i < layer.exportFormats.length; i++) {
                let format = layer.exportFormats[i];
                LayerExportList.push({
                    type: "artboard",
                    layer: layer,
                    option: {
                        output: savepath + "/assets",
                        formats: format.fileFormat,
                        scales: format.size,
                        "use-id-for-name": true
                    }
                })
                
                currentResult.assets.push(`${layer.id}${format.suffix}.${format.fileFormat}`);

            }
        }

        if (layer.layers) {
            for (let i = 0; i < layer.layers.length; i++) {
                let sublayer = layer.layers[i];
                if (!sublayer.id) {
                    continue;
                }
                let extracted = extractLayer(sublayer, basisArtboard);
                if (extracted) {
                    currentResult.layers.push(extracted);
                }
            }
        }

        extractCurrent += 1;
        return currentResult;
    }

    selectedArtboards.forEach((artboardID) => {
        var currentArtboard = document.getLayerWithID(artboardID);
        var currentPage = currentArtboard.parent;
        var currentResult = findResult(currentPage.id);
        var currentExport = extractLayer(currentArtboard);

        currentResult.layers.push(currentExport);
    });

    LayerExportList.forEach((item, index, array) => {
        sketch.export(item.layer, item.option);
        executeJavaScript("doProgress", {
            progress: 0.5 + (index/(array.length-1))/2,
            description: "Exporting " + item.layer.name
        })
    })

    writeFile({
        content: `window.manifest = ${JSON.stringify(result)}\nwindow.onManifestLoaded(window.manifest);`,
        path: savepath,
        fileName: "manifest.js"
    });

    var outcomeFiles = Array.from(FileManager.contentsOfDirectoryAtPath_error(path.resolve(process.cwd(), "Contents/Resources"), nil));
    outcomeFiles.forEach((filename) => {
        if (filename == "icon.png" || filename == "_webpack_resources" || filename.indexOf("resources") != -1) {
            return
        }
        FileManager.copyItemAtPath_toPath_error(path.resolve(process.cwd(), "Contents/Resources", filename), path.resolve(savepath, filename), nil);
    });

}