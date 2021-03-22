const HtmlWebpackPlugin = require("html-webpack-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const path = require("path")

module.exports = (env, argv) => {
    console.log({ env, argv })
    const production = argv.mode === "production"
    return {
        mode: argv.mode ?? "development",
        entry: "./src/index.tsx",
        devtool: "cheap-module-source-map",
        output: {
            filename: "[name].js",
            path: __dirname + "/dist",
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
            plugins: [new TsconfigPathsPlugin({})],
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        // {
                        //     loader: "babel-loader",
                        //     options: {
                        //         rootMode: "upward",
                        //     },
                        // },
                        {
                            loader: "ts-loader",
                            options: production
                                ? {
                                      compilerOptions: {
                                          jsx: "react-jsx",
                                          noEmit: false,
                                      },
                                  }
                                : { compilerOptions: { noEmit: false } },
                        },
                        { loader: "linaria/loader", options: { displayName: true } },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                    },
                },
                // {
                //     test: /\.(woff|woff2|ttf|otf|eot)$/,
                //     loader: "file-loader",
                //     include: [/fonts/],
                // },
            ],
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: "src/index.html",
            }),
        ],
    }
}
