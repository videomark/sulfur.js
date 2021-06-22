const path = require("path");

module.exports = (env, opt) => {
  const mode = opt.mode === undefined ? "production" : "development";
  const isDev = mode === "development";

  const conf = {
    mode,
    entry: "./src/index.ts",
    output: {
      path: path.join(__dirname, "/dist"),
      filename: isDev ? "sulfur.dev.js" : "sulfur.js",
      libraryTarget: "umd",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
  };

  if (isDev) conf.devtool = "inline-source-map";

  return conf;
};
