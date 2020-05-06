export default function(args, context) {
    var exportpath = args[0];
    NSWorkspace.sharedWorkspace().openFile_withApplication(exportpath, "Finder");
}