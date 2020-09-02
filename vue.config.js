module.exports = {
    pluginOptions: {
        devServer: {
            host: "localhost",
        },
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                productName: "Picnel.io 2",
                directories: {
                    output: "build",
                },
                nsis: {
                    oneClick: false,
                    allowElevation: true,
                    allowToChangeInstallationDirectory: true,
                    installerIcon: "./build/icon/pic2.ico",
                    uninstallerIcon: "./build/icon/pic2.ico",
                    installerHeaderIcon: "./build/icon/pic2.ico",
                    createDesktopShortcut: true,
                    createStartMenuShortcut: true,
                    shortcutName: "Picnel.io 2",
                },
                win: {
                    icon: "build/icon/pic2.ico",
                    target: [
                        {
                            target: "nsis",
                        },
                    ],
                },
                mac: {
                    icon: "build/icon/pic2.icns",
                    category: "your.app.category.type",
                },
                linux: {
                    icon: "build/icon",
                },
            },
        },
    },
};
