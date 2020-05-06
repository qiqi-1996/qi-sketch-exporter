const sketch = require("sketch/dom");

function duang(){
  var document = sketch.getSelectedDocument();
  var layer = document.pages[0].layers[0];
  var savepath = "/Users/thomas/Downloads"

  return NSFileManager.defaultManager().fileExistsAtPath(savepath)

  sketch.export(layer, {
    output: savepath,
    formats: "png",
    scales: "2",
    "use-id-for-name": true
  })
}

console.log(duang());