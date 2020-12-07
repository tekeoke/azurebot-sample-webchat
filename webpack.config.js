const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, { mode = 'development' }) => {
  const config = {
    mode,
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: {
            // node_modulesの中のモジュールを除外対象とする。
            include: /node_modules/,
            // microsoft-cognitiveservices-speech-sdkを除外対象から除外する。
            exclude: /node_modules\/microsoft-cognitiveservices-speech-sdk/,
          },
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      ie: '11',
                    },
                    useBuiltIns: 'usage',
                    corejs: { version: 3 },
                    modules: "commonjs", //これがないとexports is not definedエラーが出る
                  },
                ],
                [
                  '@babel/preset-typescript',
                  {
                    targets: {
                      ie: '11',
                    },
                    corejs: { version: 3 },
                    useBuiltIns: 'usage',
                  },
                ],
                [
                  '@babel/preset-react',
                  {
                    targets: {
                      ie: '11',
                    },
                    corejs: { version: 3 },
                    useBuiltIns: 'usage',
                  },
                ],
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                ['@babel/plugin-proposal-class-properties', { loose: true }],
              ],
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        },
        {
          test: /\.css/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { url: false },
            },
          ],
        },
      ],
    },
    devServer: {
      port: 3000,
      disableHostCheck: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, 'dist/index.html'),
        template: path.resolve(__dirname, 'src/public', 'index.html'),
      }),
    ],
  }
  return config
}
