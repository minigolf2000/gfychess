const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function (env = "development") {
  let exports = {
    context: path.resolve(__dirname),
    entry: {
      gfychess: "./app/gfychess.tsx",
    },
    output: {
      filename: "bundle-[name].js",
      path: __dirname + "/dist"
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
      'isomorphic-fetch': 'fetch',
    },
  };

  if (env == "development") {
    exports = merge(exports, {
      devtool: 'source-map',
      // devtool: 'inline-source-map',
      devServer: {
        historyApiFallback: true
      }
    });
  } else {
    exports = merge(exports, {
      plugins: [
        new MinifyPlugin({}, {}),
        new webpack.DefinePlugin({ // https://stackoverflow.com/a/36285479
          "process.env": {
             NODE_ENV: JSON.stringify("production")
           }
        }),
      ],
    });
  }

  if (env == "bundle-analyzer") {
    exports = merge(exports, {
      plugins: [new BundleAnalyzerPlugin()],
    });
  }

  return exports;

};
