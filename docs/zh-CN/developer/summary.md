# 源码概述

本文阐述了源码相关的内容，以供开源社区的贡献者们可以快速了解并上手修改项目代码。本文假设读者已有前端开发的相关经验。

## 目录结构

```
.
├── assets      -   Sketch 插件打包资源（不要修改其中的内容因为会自动生成并覆盖）
├── design      -   插件界面设计源文件
├── docs        -   当前所看的文档
├── interface   -   插件前端代码
├── outcome     -   标记文档前端代码
├── resources   -   Sketch 插件代码文件（不要修改其中的内容因为会自动生成并覆盖）
├── src         -   插件主体源码
├── publish.js  -   自动化发布脚本
├── fix-css-url-loader.js   -   Webpack URL 修正 loader
└── webpack.skpm.config.js  -   Sketch 插件 Webpack 配置
```

## 启动项目

Sketch 插件的本质与 Electron 类似，包含显示界面的渲染线程和执行逻辑的主线程。为了更好地进行开发与维护，项目对各部分进行了分离，即 interface（渲染线程前端代码）、src（主体主线程逻辑代码）、outcome（产出的标记文档前端代码）。它们的启动命令分别如下：

### 启动命令

```
npm run start:interface
# 启动渲染线程前端开发环境
npm run start:outcome
# 启动标记文档前端开发环境
npm run start
# 启动插件主体开发环境

npm run docs
# 启动当前文档的本地 HTTP 服务
```

### 注意事项与常见问题

* 启动前先安装依赖：`npm install`
* 启动插件主体前（npm start），需要先编译 `渲染线程前端` 和 `标记文档前端` 以使前端界面变更得以应用到插件上。命令分别为 `npm run build:interface` 和 `npm run build:outcome` （执行顺序无关）。
* 启动插件主体后，如果 Sketch 插件列表中没有出现该插件（或插件不能热更新）。请尝试将本插件从 Sketch 插件管理器中删除（如果有）以及项目目录中的 `qi-sketch-exporter.sketchplugin`（如果有），然后关闭 Sketch，执行 `npm run postinstall`，最后重新打开 Sketch。

## 编译与发布项目

```
npm run build:interface
# 编译渲染线程前端
npm run build:outcome
# 编译标记文档前端
npm run build
# 编译插件主体
```

之后，您将在项目目录下得到 `qi-sketch-exporter.sketchplugin` 双击即可安装到 Sketch，前提是先将开发环境中产生的插件从 Sketch 插件管理器中删除。

如果您打算发布新版本，也可以直接执行发布命令：

```
npm run publish -- [版本号]
# 例如：npm run publish -- 1.0.0
```

执行该命令后，将会自动修改 `package.json` 和 文档中 `global.js` 中的版本号、然后进行编译、压缩打包编译结果……，带命令结束并检查没问题后，即可进行 Git 提交。