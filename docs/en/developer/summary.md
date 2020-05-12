# Source Summary

This article explains the content related to the source code, so that contributors in the open source community can quickly understand and start to modify the project code. This article assumes that readers have relevant experience in front-end development.

## Directory Structure

```
.
├── assets      -   Sketch plugin resources (Do not modify the content because it will be automatically generated and overwritten)
├── design      -   Plugin interface design source files
├── docs        -   This document
├── interface   -   Plugin front-end code
├── outcome     -   Marked Document front-end code
├── resources   -   Sketch plugin code files (Do not modify the content because it will be automatically generated and overwritten)
├── src         -   Sketch main source code
├── publish.js  -   Automated publish script
├── fix-css-url-loader.js
└── webpack.skpm.config.js
```

## Startup Project

The essence of the Sketch plugin is similar to Electron, including the rendering thread of the display interface and the main thread of execution logic. In order to better develop and maintain, the project has separated the various parts, namely interface (rendering thread front-end code), src (main thread logic code), and outcome (output Marked Document front-end code). Their startup commands are as follows:

```
npm run start:interface
# Start the front-end development environment of the rendering thread
npm run start:outcome
# Start the front-end development environment of the Marked Document
npm run start
# Start the plugin main thread development environment

npm run docs
# Start the local HTTP service of the current document
```

### Attentions and Common Problems

* Install dependencies before starting: `npm install`
* Before starting the plugin main thread (npm start), you need to compile the `rendering thread front-end` and` Marked Document front-end` so that the interface changes can be applied to the plugin. The commands are `npm run build:interface` and` npm run build:outcome` (the order of execution is irrelevant).
* After starting the plugin, if it's does not appear in the Sketch plugin list (or the plugin cannot be hot updated). Please try to delete this plugin from Sketch plugin manager (if any) and `qi-sketch-exporter.sketchplugin` (if any) in the project directory, then close Sketch, execute `npm run postinstall`, and finally reopen Sketch.

## Compile and Publish the Project

```
npm run build:interface
# Compile the rendering thread front end
npm run build:outcome
# Compilation Marked Document front end
npm run build
# Compile the plugin main thread
```

After that, you will get `qi-sketch-exporter.sketchplugin` in the project directory. Double-click to install to Sketch, make sure you first delete the plugins generated in the development environment from the Sketch plugin manager.

If you plan to release a new version, you can also directly execute the release command:

```
npm run publish -- [version]
# For example: npm run publish -- 1.0.0
```

After executing this command, it will automatically modify the version number in `package.json` and` global.js` in the document, and then compile, compress, package the result ... After the command is completed and there is no problem, you can proceed Git commit.