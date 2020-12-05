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
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
              ],
            },
          },
        },
        {
          loader: 'source-map-loader',
          test: /\.js$/,
          exclude: /node_modules/,
          enforce: 'pre',
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
