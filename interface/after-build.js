var path = require("path");
var fs = require("fs");

var compiledFiles = fs.readdirSync(__dirname + "/dist");
var outputResources = path.resolve(__dirname, "../resources");
var outputIndexHtml = path.resolve(outputResources, "index.html");
var outputIndexJs = path.resolve(outputResources, compiledFiles.filter((value) => { return (path.extname(value) == ".js") })[0]);
var outputIndexCss = path.resolve(outputResources, compiledFiles.filter((value) => { return (path.extname(value) == ".css") })[0]);

// 清理插件资源

fs.rmdirSync(outputResources, { recursive: true });
fs.mkdirSync(outputResources);

// 复制编译结果
for (var i in compiledFiles) {
    var name = compiledFiles[i];
    var extname = path.extname(name);
    var f = path.resolve(__dirname, "dist", compiledFiles[i]);
    if (extname == ".map") {
        continue;
    }else {
        fs.copyFileSync(f, path.resolve(outputResources, path.basename(f)));
    }
}

// 修改编译结果

var indexHtmlContent = fs.readFileSync(outputIndexHtml).toString();
var maches = indexHtmlContent.match(/\/src\..*\.(css|js)/g);
maches.forEach((val) => {
    if (val.indexOf(".js")!=-1) {
        indexHtmlContent = indexHtmlContent.replace(val, val.replace(".", "_").replace("/", "../resources_"));
    } else {
        indexHtmlContent = indexHtmlContent.replace(val, val.replace("/", "./"));
    }
})
fs.writeFileSync(outputIndexHtml, indexHtmlContent);

var indexJsContent = fs.readFileSync(outputIndexJs).toString();
indexJsContent = indexJsContent.replace("return nodeRequire(name);", "return");
fs.writeFileSync(outputIndexJs, indexJsContent);

var indexCssContent = fs.readFileSync(outputIndexCss).toString();
indexCssContent = indexCssContent.replace(/url\(\//g, "url(");
fs.writeFileSync(outputIndexCss, indexCssContent);