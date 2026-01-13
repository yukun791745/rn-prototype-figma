# HaiMirai Triathlon AI Coach - React統合版

トライアスロントレーニングのためのAIコーチングアプリ。既存のNetlify Functions APIと新しいReact UIを統合したモバイルファースト設計。

## 🎯 プロジェクト概要

- **UI**: React + TypeScript + Tailwind CSS
- **API**: Netlify Functions（既存システムを踏襲）
- **スタイル**: HaiMiraiブランドカラー
- **デザイン**: モバイルファースト、レスポンシブ対応

## 📁 プロジェクト構造

```
triathlon-ai-coach/
├── src/
│   ├── app/
│   │   ├── App.tsx                      # メインアプリケーション
│   │   └── components/
│   │       ├── dashboard/               # ダッシュボードコンポーネント
│   │       │   ├── AICoachCard.tsx
│   │       │   ├── FitnessMetricsCard.tsx
│   │       │   ├── RecentActivityCard.tsx
│   │       │   ├── UpcomingRacesCard.tsx
│   │       │   └── NewsCard.tsx
│   │       ├── ai-coach/                # AIコーチコンポーネント
│   │       │   ├── ChatMessage.tsx
│   │       │   ├── ChatInput.tsx
│   │       │   └── FileAttachment.tsx
│   │       └── navigation/              # ナビゲーションコンポーネント
│   │           ├── BottomNav.tsx
│   │           └── Header.tsx
│   ├── types/                           # TypeScript型定義
│   │   ├── metrics.ts
│   │   ├── activity.ts
│   │   ├── race.ts
│   │   ├── news.ts
│   │   └── api.ts
│   ├── lib/                             # ユーティリティとAPI
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── config/                          # 設定ファイル
│   │   └── metrics-data.ts
│   ├── hooks/                           # カスタムフック
│   │   ├── useFitnessMetrics.ts
│   │   ├── useActivities.ts
│   │   ├── useRaces.ts
│   │   ├── useNews.ts
│   │   └── useAIChat.ts
│   └── styles/                          # スタイル
│       ├── index.css
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
├── netlify/
│   └── functions/                       # 既存のNetlify Functions
│       ├── openai.js
│       ├── ai-coach-comment.js
│       ├── strava-*.js
│       ├── fetch-races.js
│       └── news.js
└── netlify.toml                         # Netlify設定
```

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして、必要な値を設定：

```bash
cp .env.example .env
```

```.env
# Strava API設定
VITE_STRAVA_CLIENT_ID=your_strava_client_id_here
VITE_STRAVA_CLIENT_SECRET=your_strava_client_secret_here

# OpenAI API設定
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 🔗 API統合

### モックデータの使用（開発時）

デフォルトではモックデータを使用します：

```typescript
import { useFitnessMetrics } from '../hooks/useFitnessMetrics';

function Dashboard() {
  // useMock: true で モックデータを使用
  const { metrics, loading } = useFitnessMetrics({ useMock: true });
  
  return <div>CTL: {metrics?.ctl}</div>;
}
```

### 実際のAPIへの切り替え

Netlify Functionsが利用可能になったら、`useMock: false`に変更：

```typescript
import { useFitnessMetrics } from '../hooks/useFitnessMetrics';

function Dashboard() {
  // useMock: false で 実際のAPIを使用
  const { metrics, loading, error } = useFitnessMetrics({ useMock: false });
  
  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  
  return <div>CTL: {metrics?.ctl}</div>;
}
```

## 📡 利用可能なAPI

### フィットネスメトリクス

```typescript
import { useFitnessMetrics } from '../hooks/useFitnessMetrics';

const { metrics, loading, error, refetch } = useFitnessMetrics({
  useMock: false,
  autoFetch: true,
  days: 90
});
```

### アクティビティ

```typescript
import { useActivities } from '../hooks/useActivities';

const { activities, loading, error, refetch } = useActivities({
  useMock: false,
  autoFetch: true,
  limit: 10
});
```

### レース

```typescript
import { useRaces } from '../hooks/useRaces';

const { races, loading, error, refetch } = useRaces({
  useMock: false,
  autoFetch: true
});
```

### ニュース

```typescript
import { useNews } from '../hooks/useNews';

const { news, loading, error, refetch } = useNews({
  useMock: false,
  autoFetch: true,
  limit: 10
});
```

### AIチャット

```typescript
import { useAIChat } from '../hooks/useAIChat';

const { messages, loading, error, sendMessage, clearMessages } = useAIChat();

// メッセージ送信
await sendMessage('今日のトレーニングは何がいいですか？', undefined, {
  ctl: 87,
  atl: 62,
  tsb: 25
});
```

## 🎨 ブランドカラー

HaiMiraiブランドカラーは`/src/lib/constants.ts`で定義：

```typescript
export const BRAND_COLORS = {
  navy: { dark: '#1a1f4d', base: '#2d3561', light: '#4a5078' },
  blue: { dark: '#3b82f6', base: '#6666FF', light: '#93c5fd' },
  lightBlue: { dark: '#0ea5e9', base: '#38bdf8', light: '#7dd3fc' },
  pink: { dark: '#ec4899', base: '#FF33CC', light: '#f9a8d4' },
  lightPink: { dark: '#f472b6', base: '#fda4c8', light: '#fce7f3' },
  white: { base: '#ffffff', soft: '#fafafa', muted: '#f5f5f5' }
};
```

カラーを調整する場合は、このファイルを編集してください。

## 📦 ビルド

```bash
npm run build
```

## 🚢 デプロイ

### Netlifyへのデプロイ

1. Netlifyアカウントにログイン
2. GitHubリポジトリを接続
3. ビルド設定:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 環境変数を設定（上記の`.env`の内容）
5. デプロイ

既存の`netlify.toml`設定がそのまま使用されます。

## 🔧 既存プロジェクトとの統合手順

### 1. 既存リポジトリにマージ

```bash
# 既存リポジトリをクローン
git clone https://github.com/yukun791745/triathlon-ai-coach.git
cd triathlon-ai-coach

# 新しいReactファイルを追加
# (このFigma Makeプロジェクトの内容をコピー)

# 既存のnetlify/functionsはそのまま保持
```

### 2. package.jsonの統合

既存の`package.json`に以下を追加：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "tailwindcss": "latest"
  }
}
```

### 3. 既存の静的HTMLファイルを段階的に移行

- `index.html` → React版に移行
- `home.html` → `App.tsx`のダッシュボード画面
- 既存のJavaScriptロジックは`/src/lib/api.ts`に統合済み

### 4. Netlify Functions は変更不要

既存の`netlify/functions/`内のファイルはそのまま使用できます。

## 📝 注意事項

- **モバイルファースト**: スマートフォンでの使用を前提に設計
- **レスポンシブ**: タブレット・デスクトップでも動作
- **API認証**: Strava OAuthフローは既存の実装を踏襲
- **型安全**: TypeScriptで完全な型定義を実装

## 🤝 サポート

質問や問題がある場合は、GitHubのIssuesで報告してください。
