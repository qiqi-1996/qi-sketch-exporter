const sketch = require("sketch/dom");

var mock = {
    path: '/Users/thomas/Downloads/qi-sketch-exporter',
    selected: [
        '0C42C566-1EF4-42FF-B056-99F61D644F77',
        '79DBB6A4-04AC-4AF5-AE77-C98DDA6A4567'
    ]
}

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

function duang(args, context) {
    var savepath = mock.path;
    var selectedArtboards = mock.selected;
    var document = sketch.getSelectedDocument();

    if (!NSFileManager.defaultManager().fileExistsAtPath(savepath)) {
        NSFileManager.defaultManager().createDirectoryAtPath_withIntermediateDirectories_attributes_error(savepath, true, nil, nil);
        return;
    }

    var result = [];
    var LayerExportList = []

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

    function extractLayer(layer) {
        let currentResult = {
            id: layer.id,
            type: layer.type,
            name: layer.name,
            x: layer.frame.x,
            y: layer.frame.y,
            width: layer.frame.width,
            height: layer.frame.height,
            assets: [],
            layers: []
        }

        if (layer.type == "Artboard") {
            LayerExportList.push({
                layer: layer,
                option: {
                    output: savepath + "/assets",
                    formats: "png",
                    scales: "2",
                    "use-id-for-name": true
                }
            })

            currentResult.assets.push(`${layer.id}@2x.png`);
        }

        if (layer.exportFormats.length) {
            for (let i in layer.exportFormats) {
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

                // currentResult.assets.push(`${layer.id}@2x.png`);
            }
        }

        if (layer.layers.length) {
            for (let i in layer.layers) {
                let sublayer = layer.layers[i];
                if (!sublayer.id) {
                    continue;
                }
                let extracted = extractLayer(sublayer);
                if (extracted) {
                    currentResult.layers.push(extracted);
                }
            }
        }

        return currentResult;
    }

    selectedArtboards.forEach((artboardID) => {
        var currentArtboard = document.getLayerWithID(artboardID);
        var currentPage = currentArtboard.parent;
        var currentResult = findResult(currentPage.id);
        var currentExport = extractLayer(currentArtboard);

        currentResult.layers.push(currentExport);
    });

    writeFile({
        content: JSON.stringify(result),
        path: savepath,
        fileName: "manifest.json"
    });
}

duang();