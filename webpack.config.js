var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'source'), // New line
    devServer: {
        contentBase: path.resolve(__dirname, 'source'), // New line
    },
    entry: {
        index: './index.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')

},
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
    },
module: {
    rules: [
        {
            test: /\.tsx?$/,
            loader: 'ts-loader'
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{loader: 'css-loader', options: {modules: true}},]
            })
        },
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [require('autoprefixer')];
                            },
                        },
                    },
                    'sass-loader']
            })
        },
        {
            test: /\.(jpg|jpeg|png|svg)$/,
            // use: ['file-loader'],
            use: [{
                loader: 'file-loader',
                query: {
                    useRelativePath: process.env.NODE_ENV === "production",
                                       publicPath: process.env.NODE_ENV === "production" ? '/' : '/dist/'
}
}],
},
]
},
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new CopyWebpackPlugin([
            {from: 'assets/**/*'},
                    ])
                ,

            new HtmlWebpackPlugin({
                    title: 'Custom template',
                template: 'index.html',
            })
]
};


/*

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PATHS = {
    source: path.join(__dirname, 'source'),
    build: path.join(__dirname, 'build'),
};

module.exports = {
    context: path.resolve(__dirname, 'source'),
    entry: PATHS.source + '/index.js',

    /!*много страничник*!/
    /!*    entry: {
            'index': PATHS.source + '/page/index/index.js'
            'blog': PATHS.source + '/page/blog/blog.js'
        }*!/
    output: {
        path: PATHS.build,
        filename: '[name].js',
        publicPath: './build'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Index-html',
          /!*  filename: 'index.html',*!/
            template: 'index.html',
           /!* chunks: ['main']*!/
        }),
        new ExtractTextPlugin("[name]/styles.css"),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'source'), // New line
    /!*    stats: 'errors-only'*!/
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [require('autoprefixer')];
                                },
                            },
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/,
                use: ['url-loader'],
            },

        ]
    }
    /!*много страничник tempalete используется для pug*!/
    /!*    plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                chunks: ['index'],
                tempalete: PATHS.source + '/pages/index/index.js'
                title: 'Webpack app'
            }), new HtmlWebpackPlugin({
                filename: 'blog.html',
                chunks: ['blog'],
                tempalete: PATHS.source + '/pages/blog/blog.js'
                title: 'Webpack app'
            }),
        ]*!/
};
*/


/*
let webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    context: path.resolve(__dirname, './app'), // New line
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // New line
    },
    entry: {
        main: './ts/main.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './',
        sourceMapFilename: '[file].map',

    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],

    },
    node: {
        fs: "empty"
    },
    module: {

        rules: [
            {
                test: /\.tsx?$/,
                use :["ts-loader"]
            },
            { test: /\.hbs$/, use:["handlebars-loader"]  },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/,
                use: ['url-loader'],
            },
            {

                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [require('autoprefixer')];
                                },
                            },
                        },
                        'sass-loader'
                    ]
                })
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "Tether": 'tether'
        }),
        new CopyWebpackPlugin([
            {from: 'json/!**!/!*'},
        ]),
        new ExtractTextPlugin("[name]/styles.css"),
        new CopyWebpackPlugin([
            {from: 'css/!**!/!*'},
        ]),
        new CopyWebpackPlugin([
            {from: 'libs/!**.*'},
        ]),
        new CopyWebpackPlugin([
            {from: 'template/!**.*'},
        ]),
        new HtmlWebpackPlugin({
            title: 'Index-html',
            filename: 'index.html',
            template: 'index.html',
            chunks: ['main']
        }),
    ]
}*/
