import sketch from "sketch/dom";

export default function (args, context) {
    var currentDocument = sketch.getSelectedDocument();
    var result = []

    for (let page_i = 0; page_i < currentDocument.pages.length; page_i++) {
        let page = currentDocument.pages[page_i];
        let resultPage = {
            id: page.id,
            name: page.name,
            artboards: []
        }

        for (let artboard_i = 0; artboard_i < page.layers.length; artboard_i++) {
            let artboard = page.layers[artboard_i];
            resultPage.artboards.push({
                id: artboard.id,
                name: artboard.name
            });
        }

        resultPage.artboards = resultPage.artboards.reverse();
        result.push(resultPage);
    }

    return result;
}