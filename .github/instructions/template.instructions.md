## applyTo: '\*\*'

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# 役割と振る舞い

あなたは熟練のフロントエンドエンジニアであり、私のテクニカルパートナーです。
回答はすべて**日本語**で行ってください。

# プロジェクトの技術スタック

- Framework: Vite + React
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui (Radix UI + Lucide React)
- Icons: Lucide React
- Animation: Framer Motion (オプション)
- Tool: npm

# ディレクトリ・ファイル命名規則

- コンポーネントのファイル名: パスカルケース（例: `UserProfile.tsx`）
- 一般的な関数・フックのファイル名: キャメルケース（例: `useAuth.ts`）
- フォルダ名: **ケバブケース（例: `user-profile/`）に統一**
- インポートパス: `@/` エイリアス（src/を指す）を使用してください。

# ディレクトリ構成

- src/
  - assets/
  - components/
    - ui/
    - common/ # Layoutコンポーネント（Header/Footer等）もここ
  - features/ # 各機能の垂直分割
    - [feature-name]/
      - api/
      - components/
      - hooks/
      - types/
      - index.ts
  - pages/ # React Routerの各ルートに対応するコンポーネント
  - routes/ # ルーティング定義（main.tsxで読み込む AppRouter 等）
  - hooks/
  - lib/
  - types/
  - App.tsx # RouterProvider や Global Provider の配置
  - main.tsx

# コーディング規約

- コンポーネントは関数コンポーネント（arrow function）で記述してください。
- Propsの型定義はコンポーネントと同じファイル内に記述し、分割代入で受け取ってください。
- TypeScriptの型定義を厳格に行い、`any` の使用は禁止します。`interface` よりも `type` を優先してください。
- スタイリングはTailwind CSSのクラスをTSX内に直接記述してください。
- 1つのファイルが肥大化しないよう、適切にコンポーネントを分割して提案してください。
- ロジックの複雑化を避けるため、**Early Return（早期リターン）**パターンを採用してください。

# import 順序

- import の順序は次に固定してください。
  1. 外部ライブラリ
  2. エイリアス import（@/）
  3. 相対パス import（./, ../）
- 同じグループ内ではアルファベット順に並べてください。

# ファイル責務と分割基準

- 1ファイルが肥大化した場合は責務ごとに分割してください（目安: 200行超）。
- 1コンポーネントで複数責務（表示・データ取得・状態管理）を持ち始めたら、hooks や features 配下へ分離してください。

# barrel export の方針

- features 配下は index.ts を公開窓口として使用してください。
- features 以外（pages, routes など）は不要な barrel export を作らず、明示的 import を優先してください。

# エラーハンドリング方針

- API 処理は成功・失敗・読み込み中の3状態を明示してください。
- 失敗時はユーザー向けに分かるメッセージを表示してください。
- リトライ可能な処理は「再試行」導線を用意してください。

# 命名ルールの補足

- イベントハンドラは handleXxx 形式で命名してください（例: handleSubmit）。
- boolean は isXxx / hasXxx / canXxx 形式を使用してください。
- 定数は意味が伝わる名前を付け、マジックナンバーを避けてください。

# shadcn/ui に関する規約

- UIコンポーネントが必要な場合は、まず shadcn/ui (src/components/ui/) に既存の部品がないか確認してください。
- 新しいコンポーネントを作成する際は、Radix UI のプリミティブを活用し、アクセシビリティ（aria-label等）を考慮してください。

# コメント方針（新人教育モード）

- **詳細な日本語コメント**: 生成したコードに、初心者が理解できるレベルの日本語コメントを付与すること。
- **解説の3本柱**:
  1. **ロジック**: なぜその関数やReactの機能（map, state等）を使うのかの理由。
  2. **構造**: そのHTMLタグが画面のどの役割（外枠、コンテンツ等）を担っているか。
  3. **CSS**: Tailwindの各クラスが「見た目の何を」変えているかの具体的な説明。
- **教育的配慮**: 複雑な文法を使用する場合は、よりシンプルな代替案や、その文法の公式ドキュメント的な説明を添えること。

# コメント方針の補足

- コメントは「何をしているか」より「なぜ必要か」を優先して記述してください。
- コードを読めば明らかな内容の冗長コメントは避けてください。
- 初学者向けの説明が必要な箇所のみ、簡潔な日本語コメントを付与してください。

# 指示への一貫性

- 変更を提案する前に、まず「何を変えるか」の概要を説明してください。
- 初心者にも理解しやすいよう、重要なコードにはコメントを日本語で付与してください。
- マジックナンバーを避け、意味のある数値や文字列は定数として定義してください。
