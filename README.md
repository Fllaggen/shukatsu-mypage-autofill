# Shukatsu MyPage Autofill

企業ごとの新卒採用マイページ新規登録フォームを、Chrome 拡張機能のポップアップに保存したプロフィールから自動入力します。

## できること

- i-webs の登録フォーム例: `kname1`, `yname1`, `gyubin1`, `gken`, `account1` などに対応
- SNAR の登録フォーム例: `tbx_name1`, `tbx_kana1`, `ddl_birthY`, `tbx_zip1`, `ddl_ken` などに対応
- その他の企業マイページでも、入力欄の `name` / `id` / `autocomplete` / ラベル / placeholder / 周辺テキストから項目を推定
- 氏名1枠、氏名の姓/名分割、カナ分割、郵便番号分割、住所1枠、電話番号1枠/3分割に対応
- 現在ページ内の「新規登録」「エントリー」「同意する」など登録入口候補を表示
- 保存データは `chrome.storage.local` のみを使用

## しないこと

- 登録確定、送信、次へ、同意ボタンの自動クリック
- 外部サーバーへのプロフィール送信
- 外部ナビサイト経由のログイン代行

## インストール

1. Chrome で `chrome://extensions` を開く
2. 右上の「デベロッパー モード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」を押す
4. このフォルダを選ぶ

```text
C:\Users\drrrs\Downloads\New project-20260418T091550Z-3-001\New project\chrome_shukatsu_autofill
```

この版は企業ごとのマイページに広く対応するため、通常の `http/https` ページで動く権限を使います。入力はポップアップのボタンを押した時だけ行い、登録確定ボタンは押しません。

## 使い方

1. 拡張機能のポップアップを開く
2. 名前、住所、メール、学校情報を入力して「保存」
3. 企業マイページの新規登録フォームを開く
4. 「入力欄チェック」で検出状況を見る
5. 「現在ページに入力」を押す
6. 内容を必ず目視確認してから、サイト側の次へ/登録を自分で押す

## 直リンク探索のメモ

- i-webs は企業別コードの後ろに `/applicant/entry/index/entrycd/` が付く入口が多いです。
  - 例: `https://mypage.3030.i-webs.jp/hitachi-solutions2027/applicant/entry/index/entrycd/`
  - JSOL 例: `https://mypage.3010.i-webs.jp/jsol2027/`
  - JSOL 規約ページ例: `https://mypage.3010.i-webs.jp/jsol2027/applicant/entry/regulation/.../entrycd/`
- SNAR は `index.aspx` にあるエントリーボタンから `jobboard/apply.aspx` へ進むことが多いです。ASP.NET の状態管理を使うため、企業によっては単純な URL 直打ちでは対象募集が選ばれない場合があります。
- その他の企業マイページは URL パターンがばらばらなので、対象ページを開いた上で「登録入口を探す」または「入力欄チェック」を使ってください。

## GitHub に上げるとき

このフォルダだけを新規リポジトリとして上げるのがおすすめです。

```powershell
cd "C:\Users\drrrs\Downloads\New project-20260418T091550Z-3-001\New project\chrome_shukatsu_autofill"
git init
git add .
git commit -m "Add shukatsu mypage autofill extension"
git branch -M main
git remote add origin https://github.com/<your-name>/<repo-name>.git
git push -u origin main
```
