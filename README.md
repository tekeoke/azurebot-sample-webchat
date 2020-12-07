# TypeScript + React + BotFramework-WebChatでIE11表示に対応したボットを表示させる

# 用意するもの

* Azureアカウント
* Azure上に構築したEchoBot（DirectLine有効化済）

# TypeScript + React + Webpack 5 + Babel 7 のプロジェクトを作成する

[サンプルコード](https://github.com/tekeoke/azurebot-sample-webchat)を参照。

create-react-app（CRA）で作らなかったのは、ejectしないとwebpackやBabelの設定を弄れないため。
また、CRAはdependenciesにproductionで不要なモジュールが多数記載されているのが、個人的にあまり気にくわないのもあります。

# IE11への対応

TypeScript（ts-loader）とBabel（babel-loader）のどちらかでIE11に対応した構文（ES5）にトランスパイルすることになります。

BabelがTypeScript対応のトランスパイルが可能であること、`useBuiltins: 'usage'`でソースコードにBabelのPolyfillを記載しなくてよい点からBabelによるトランスパイルを選択しています。

以下にIE11対応するにあたって苦労したポイントについて記載していきます。

## node_modules以下の特定プロジェクトをBabelに含める

BotFramework-WebChatをIE11で使うためにBabelでトランスパイルします。

通常、node_modules以下のフォルダはIE11で処理できるよう既にトランスパイルされていることが殆どですが、たまにトランスパイルされておらず構文エラーが起きることがあります。

BotFramework-WebChatの依存関係では、「microsoft-cognitiveservices-speech-sdk」がトランスパイルされておらずIE11では使えないclass構文やアロー関数が含まれたままになっていました。

そこで、以下のコードのようにexcludeの中で該当のモジュールだけBabelのトランスパイル対象に含めるように設定します。

なお、node_modules全体をBabelしようとすると二重でトランスパイルされることになり上手く動作しませんでした。

構文エラーが起きた場合、「yarn start」で開発者モードでコードを追いやすくしつつ、IEの「F12開発者ツール」のコンソールとデバッガーから頑張って対象のモジュールを探していきました。

トランスパイル対象のモジュールを見つけるのに1週間かかってしまったので、ここに記載して同じ犠牲者が出ないことを祈ります…

```
{
  test: /\.(js|jsx|tsx|ts)$/,
  //exclude: /node_modules/,
  exclude: {
    // node_modulesの中のモジュールを除外対象とする。
    include: /node_modules/,
    // microsoft-cognitiveservices-speech-sdkを除外対象から除外する。
    exclude: /node_modules\/microsoft-cognitiveservices-speech-sdk/,
  },
  use: {
    loader: 'babel-loader',
    options: {
      ...
    },
  },
},
```

## @babel/preset-envの設定

トランスパイル後のコードで「exports is not defined」と出ることがありました。

この場合、modules: "commonjs"と指定することでエラーが出なくなります。


```
presets: [
  [
    '@babel/preset-env',
    {
      targets: {
        ie: "11",
      },
      useBuiltIns: 'entry',
      corejs: { version: 3 },
      modules: "commonjs", //これがないとexports is not definedエラーが出る
    },
  ],
  ...
]
```

## 追加のPolyfill

@babel/preset-envでuseBuiltIns: 'usage'を指定すると、ソースコード中にPolyfillのimportを書く必要がなくなります。

ただ、react-app-polyfillは入れないと「catch ステートメントでは適用されますが、throw ステートメントでは適用されません。」 というエラーが出たので居れています。

`npm i -S react-app-polyfill`を実行後、index.tsxの先頭に以下のコードを追加します。

```
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
```

## IE11でSecurityErrorが出る場合

ローカルで実行するアプリでWebSocketを利用しようとすると、IEはSecurityErrorを返します。

SecurityErrorを出さないようにするには、IEの設定を変更する必要があります。

* [ツール]> [インターネットオプション]> [セキュリティ]> [ローカルイントラネット]> [サイト]> [詳細]から、全てのチェックボックスのチェックを外す