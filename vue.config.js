const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const tsImportPluginFactory = require('ts-import-plugin')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');

module.exports = {
    devServer: {
        proxy: 'http://192.168.20.157:8092',
        disableHostCheck: true
    },
    pages: {
        mobile: {
            entry: 'src/pages/mobile/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ["chunk-vendors", "chunk-common", "mobile"]
        },
        bm: {
            entry: 'src/pages/pc/main.ts',
            template: 'public/bm.html',
            filename: 'bm.html',
            chunks: ["chunk-vendors", "chunk-common", "bm"]
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtoviewport({
                        viewportWidth: 375,
                        viewportHeight: 568,
                        selectorBlackList: ['van-circle__layer'],
                        exclude: [/element-ui/, /pc/],
                        unitPrecision: 5,
                        viewportUnit: 'vw',
                        propList: ['*'],
                        minPixelValue: 1,
                        mediaQuery: false

                    })

                ]
            }
        }
    },
    parallel: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@com', resolve('src/components'))
            .set('@img', resolve('src/assets/images'))
            .set('@pcViews', resolve('src/pages/pc/views'))
            .set('@appViews', resolve('src/pages/mobile/views'))
        config.module
            .rule('ts')
            .use('ts-loader')
            .tap(options => {
                options = merge(options, {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: 'vant',
                                libraryDirectory: 'es',
                                style: true
                            })
                        ]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                });
                return options;
            });
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // Provide path to the file with resources
                    //   resources: './path/to/resources.scss',
                    // Or array of paths
                    resources: ['./src/assets/css/standard.scss']
                })
                .end()
        })
        // config.module.rule('css').use('postcss-loader').loader('postcss-loader').tap(options => {
        //     console.log(options);
        //     return options
        // })
    }
}