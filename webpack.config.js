const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 그냥 복붙 해서 사용
const TerserPlugin = require("terser-webpack-plugin");//기본이 터서 사용이기 때문에 


module.exports = {
    mode:'production',
    entry:"./src/index.js",
    output:{
        path:path.resolve(__dirname, 'build'),
        filename:'[name].[chunkhash].js'
    },
    module:{
        rules:[
            {
                test:/\.css/i,
                use:[
                    {
                        loader:MiniCssExtractPlugin.loader // style-loader를 대체 한다.
                    },
                    // {
                    //     loader:'style-loader',
                    //     options:{
                    //         injectType:'singletonStyleTag' //tag를 하나로 함칠 수 있다
                    //     }
                    // },
                    {
                        loader:'css-loader',
                        options:{
                            modules:true
                        }
                    }
                ]
            },{
                test:/\.hbs/i,
                use:['handlebars-loader']
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'[contenthash].css'
        }),
        new HTMLWebpackPlugin({
            title:'Hello World',
            template:path.resolve(__dirname,'index.hbs'), //트정파일 기준으로 html파일 생성
            meta:{
                viewport:"width=device-width, initial-scale=1.0"
            },
            minify:{
                collapseWhitespace:true,
                removeComments:true,
                useShortDoctype:true,
                removeScriptTypeAttributes:true
            }
        }),
        new CleanWebpackPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        })
    ],
    optimization:{
        runtimeChunk:{
            name:'runtime'
        },
        splitChunks:{
            cacheGroups:{
                defaultVendors:{
                    test:/[\\/]node_modules[\\/]/i,
                    chunks: 'all',
                    name:'vender'
                }
            }
        },
        minimize:true,// TerserWebpackPlugin
        minimizer:[new TerserPlugin({
            
        })] //uglyfi나 다른거를 사용하려면 여기에 터서말고 다른거 넣어 주면됩니다.
    }
    
}