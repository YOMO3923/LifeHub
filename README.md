# React + TypeScript + Vite テンプレート

## セットアップ

1. `npm install`
2. `npm run dev`

## 品質チェック用スクリプト

- `npm run format`: Prettier でコード整形
- `npm run format:check`: フォーマット崩れの検出
- `npm run lint`: ESLint 実行
- `npm run typecheck`: TypeScript 型チェック
- `npm run build`: 本番ビルド

## ルールファイル

開発時は [.github/instructions/template.instructions.md](.github/instructions/template.instructions.md) を参照してください。

## src 構成

```text
src/
	assets/
	components/
		ui/
		common/
	features/
		counter/
			api/
			components/
			hooks/
			types/
			index.ts
	pages/
		home-page/
		not-found/
	routes/
		AppRouter.tsx
	hooks/
	lib/
	types/
	App.tsx
	main.tsx
```

このテンプレートは、`pages` が `features` を組み合わせる構成を基準にしています。

## features 雛形ルール

新しい機能を追加する場合は、次の最小構成を作成します。

```text
src/features/[feature-name]/
	api/
	components/
	hooks/
	types/
	index.ts
```

- `components/`: その機能だけで使う表示部品
- `hooks/`: その機能だけの状態・ロジック
- `types/`: その機能専用の型
- `api/`: その機能専用の通信処理
- `index.ts`: `pages` から使う公開 API の窓口

## routes 運用ルール

- ルート定義は `src/routes/AppRouter.tsx` に集約します。
- `src/App.tsx` は `RouterProvider` と全体 Provider のみを持ちます。
- `src/main.tsx` は `App` の描画だけを担当します。
- 404 は `path: '*'` で `pages/not-found/NotFoundPage.tsx` を表示します。

## 依存脆弱性の運用方針

- `npm audit` の結果は、配布前に確認します。
- 重大度が `high` 以上で修正可能なものは、原則対応してから配布します。
- すぐに直せない場合は、README または Issue に「影響範囲」と「対応予定」を明記します。

## テンプレート配布前チェックリスト

- [ ] `npm run format:check` が通る
- [ ] `npm run lint` が通る
- [ ] `npm run typecheck` が通る
- [ ] `npm run build` が通る
- [ ] `/` と存在しないURL（404）の表示を確認
- [ ] README と `.github/instructions/template.instructions.md` の内容が最新
- [ ] 新規フォルダへ複製して `npm install` と `npm run build` が再現
