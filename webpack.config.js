const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',
  node: {
    __dirname: false
  },
  entry: {
    'src/functions/articles/bundle': path.resolve(__dirname, './src/functions/articles/index.ts'),
    'src/functions/media/bundle': path.resolve(__dirname, './src/functions/media/index.ts'),
    'src/functions-edge/http-headers/bundle': path.resolve(__dirname, './src/functions-edge/http-headers/index.ts'),
    'src/functions-edge/check-auth/bundle': path.resolve(__dirname, './src/functions-edge/check-auth/index.ts'),
    'src/functions-edge/parse-auth/bundle': path.resolve(__dirname, './src/functions-edge/parse-auth/index.ts'),
    'src/functions-edge/refresh-auth/bundle': path.resolve(__dirname, './src/functions-edge/refresh-auth/index.ts'),
    'src/functions-edge/sign-out/bundle': path.resolve(__dirname, './src/functions-edge/sign-out/index.ts')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  externals: [
    /^aws-sdk/ // Don't include the aws-sdk in bundles as it is already present in the Lambda runtime
  ],
  performance: {
    hints: 'error',
    maxAssetSize: 1048576, // Max size of deployment bundle in Lambda@Edge Viewer Request
    maxEntrypointSize: 1048576, // Max size of deployment bundle in Lambda@Edge Viewer Request
  },
  optimization: {
    minimizer: [new TerserPlugin({
      cache: true,
      parallel: true,
      extractComments: true,
    })],
  },
}
