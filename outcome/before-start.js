var fs = require("fs");

var path_manifest = __dirname + "/mockdata/manifest.js";
var path_assets = fs.readdirSync(__dirname + "/mockdata/assets");

if (!fs.existsSync(__dirname + "/dist")) {
    fs.mkdirSync(__dirname + "/dist");
}
if (!fs.existsSync(__dirname + "/dist/assets")) {
    fs.mkdirSync(__dirname + "/dist/assets");
}

fs.copyFileSync(path_manifest, __dirname + "/dist/manifest.js");
path_assets.forEach((filename) => {
    fs.copyFileSync(__dirname + "/mockdata/assets/" + filename, __dirname + "/dist/assets/" + filename);
})