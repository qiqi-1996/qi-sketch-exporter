module.exports = function (config, entry) {
    config.node = entry.isPluginCommand ? false : {
        setImmediate: false
    };

    config.module.rules.push({
        test: /\.(html)$/,
        use: [{
                loader: "@skpm/extract-loader",
            },
            {
                loader: "html-loader",
                options: {
                    attrs: [
                        'img:src',
                        'link:href'
                    ],
                    interpolate: true,
                },
            },
        ]
    })

    // config.module.rules.push({
    //     test: /\.(svg|eot|ttf|woff|png|jpg|gif)$/,
    //     use: [
    //         {
    //             loader: "@skpm/extract-loader",
    //         },
    //         {
    //             loader: "@skpm/file-loader",
    //             options: {
    //                 publicPath: "./",
    //                 esModule: false
    //             }
    //         }
    //     ]
    // })

    config.module.rules.push({
        test: /\.(css)$/,
        use: [
            {
                loader: require.resolve("./fix-css-url-loader.js")
            },
            {
                loader: "@skpm/extract-loader",
            },
            {
                loader: "css-loader",
            },
        ]
    })
}