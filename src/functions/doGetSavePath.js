import path from "path";
import sketch from "sketch/dom";

export default function (args, context) {
    var currentDocument = sketch.getSelectedDocument();
    var name = path.basename(currentDocument.path, ".sketch");
    var savePanel = NSSavePanel.savePanel();

    savePanel.setTitle("Export");
    savePanel.setNameFieldLabel("Export to:");
    savePanel.setNameFieldStringValue(name);
    savePanel.setPrompt("Export");
    savePanel.setCanCreateDirectories(true);

    if (savePanel.runModal() != NSOKButton) {
        return { path: "" };
    }
    
    let result = Object.assign({},{
        path: new String(savePanel.URL().path())
        // Don't know why the string of result.path will be gone after JSON.stringify(), maybe it's an Apple security problem?
    });
    
    return result;
}