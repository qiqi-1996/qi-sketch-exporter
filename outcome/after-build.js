var path = require("path");
var fs = require("fs");

var CopyFilesList = [];
var outputAssets = path.resolve(__dirname, "../assets");

fs.readdirSync(__dirname + "/dist").forEach((item) => {
    if (item === "index.js" || item === "manifest.json" || item === "assets" || item.indexOf(".map") !=-1 ) {
        return;
    }
    CopyFilesList.push(__dirname + "/dist/" + item);
})

fs.readdirSync(outputAssets).forEach((filename) => {
    if (filename != "icon.png") {
        fs.unlinkSync(path.resolve(outputAssets, filename));
    }
})

CopyFilesList.forEach(item => {
    fs.copyFileSync(item, path.resolve(outputAssets, path.basename(item)));
})