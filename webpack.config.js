const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + "/src/index.html",
  filename: "index.html"
});

const ExtractTextPluginConfig = new ExtractTextPlugin({
    filename: "dayPicker.bundle.css"
});

module.exports = {
    entry: [
        "./src/index.ts",
        "./src/styles/index.scss"
    ],
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "dayPicker.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"]
                })
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".scss"]
    },
    plugins: [
        HTMLWebpackPluginConfig,
        ExtractTextPluginConfig
    ]
};