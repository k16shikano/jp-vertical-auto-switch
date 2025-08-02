# JP Vertical Auto-Switch

日本語の縦書き自動切り替えブラウザ拡張機能です。

## 機能

- テキスト要素（段落、見出し、リスト項目など）を監視
- 文字が行幅を埋めている場合、自動的に縦書きフォントに切り替え
- ページのリサイズやDOM変更をリアルタイムで監視

## インストール方法

### Chrome/Edge の場合

1. このフォルダをダウンロード
2. ブラウザで `chrome://extensions/` を開く
3. 「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. このフォルダを選択

### Firefox の場合

1. このフォルダをダウンロード
2. ブラウザで `about:debugging` を開く
3. 「この Firefox」タブをクリック
4. 「一時的な拡張機能を読み込む」をクリック
5. `manifest.json` ファイルを選択

## 使用方法

拡張機能をインストールすると、自動的にすべてのウェブページで動作します。

- 段落（`<p>`）、見出し（`<h1>`-`<h6>`）、リスト項目（`<li>`）、`<span>`要素などを監視
- 文字幅が要素の幅の80%を超える場合、自動的に縦書きフォントに切り替え
- ページのリサイズや新しいコンテンツの追加にも対応
- ポップアップUIで有効/無効の切り替えや統計情報の確認が可能

## 技術仕様

- Manifest V3対応
- ResizeObserver と MutationObserver を使用したリアルタイム監視
- YuMinchoフォントの縦書き機能を活用

## 開発・貢献

### セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/jp-vertical-auto-switch.git
cd jp-vertical-auto-switch
```

2. 拡張機能をブラウザに読み込み
   - Chrome/Edge: `chrome://extensions/` → デベロッパーモード → パッケージ化されていない拡張機能を読み込む
   - Firefox: `about:debugging` → この Firefox → 一時的な拡張機能を読み込む

### ビルド・パッケージング

```bash
# 拡張機能をZIPファイルにパッケージ
zip -r jp-vertical-auto-switch.zip . -x "*.git*" "node_modules/*" "*.DS_Store"
```

## ライセンス

MIT License 