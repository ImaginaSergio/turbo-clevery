module.exports = {
  // webpack will transpile TS and JS files
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
    ],
  },
};
