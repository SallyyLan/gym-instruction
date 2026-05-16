# Gym Equipment Instruction Web App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free, bilingual (繁中/EN), read-only React web app where gym beginners scan a QR code on a machine to see an interactive 3D model, motion demo, and step-by-step instructions for 5 starter machines.

**Architecture:** Static React + Vite SPA with no backend. All machine content lives in a single JSON file. React Router gives each machine a unique URL. Sketchfab embeds handle the interactive 3D viewer; GIFs/images handle motion and callout diagrams. Deployed free to Vercel.

**Tech Stack:** React 18, TypeScript, Vite, React Router v6, react-i18next, Tailwind CSS v3, qrcode.react v3, Vitest, @testing-library/react

---

## File Map

```
gym_instruction/
├── public/
│   ├── images/                      # machine thumbnails + callout diagrams (add manually)
│   └── videos/                      # GIF motion demos (add manually)
├── src/
│   ├── types/
│   │   └── machine.ts               # Machine TypeScript interface
│   ├── data/
│   │   └── machines.json            # all 5 machines content
│   ├── i18n/
│   │   ├── index.ts                 # react-i18next setup + localStorage persistence
│   │   ├── zh.json                  # Traditional Chinese UI strings
│   │   └── en.json                  # English UI strings
│   ├── components/
│   │   ├── LanguageToggle.tsx       # EN/繁中 toggle button
│   │   ├── MuscleTags.tsx           # pill badges for muscle groups
│   │   ├── SketchfabEmbed.tsx       # iframe with loading skeleton
│   │   ├── MotionDemo.tsx           # looping GIF/video
│   │   ├── CalloutDiagram.tsx       # annotated image with shimmer
│   │   ├── StepList.tsx             # numbered instruction steps
│   │   ├── MistakesList.tsx         # common mistakes bullet list
│   │   ├── WarningBox.tsx           # amber warning box
│   │   └── MachineCard.tsx          # card for home page grid
│   ├── pages/
│   │   ├── HomePage.tsx             # 2-column grid of all machine cards
│   │   ├── MachinePage.tsx          # full machine detail page
│   │   ├── QRCodesPage.tsx          # printable QR codes (/admin/qr-codes)
│   │   └── NotFoundPage.tsx         # 404 fallback
│   ├── test-setup.ts                # @testing-library/jest-dom setup
│   ├── App.tsx                      # React Router routes
│   ├── main.tsx                     # entry point + BrowserRouter
│   └── index.css                    # Tailwind directives + body style
├── index.html
├── vite.config.ts                   # Vite + Vitest config
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                      # SPA rewrite rule
└── package.json
```

---

### Task 1: Scaffold Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `src/main.tsx`, `src/index.css`, `src/test-setup.ts`

- [ ] **Step 1: Bootstrap with Vite**

```bash
cd /Users/sally/Documents/Project/sde/gym_instruction
npm create vite@latest . -- --template react-ts
```

Expected: Vite scaffolds the project in the current directory.

- [ ] **Step 2: Install all dependencies**

```bash
npm install react-router-dom react-i18next i18next qrcode.react
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitejs/plugin-react
npx tailwindcss init -p
```

- [ ] **Step 3: Replace `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
})
```

- [ ] **Step 4: Replace `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Noto Sans TC"', '"Microsoft JhengHei"', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-white text-gray-900 font-sans;
}
```

- [ ] **Step 7: Replace `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './i18n/index'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 8: Add test script to `package.json`**

In the `scripts` section, add:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:5173` with default Vite + React page. Press `q` to quit.

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold React + Vite + TypeScript + Tailwind + Vitest project"
```

---

### Task 2: TypeScript Types + Machine Data

**Files:**
- Create: `src/types/machine.ts`
- Create: `src/types/machine.test.ts`
- Create: `src/data/machines.json`

- [ ] **Step 1: Write the failing test**

Create `src/types/machine.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import machines from '../data/machines.json'
import type { Machine } from './machine'

describe('machines.json', () => {
  it('has 5 machines', () => {
    expect(machines).toHaveLength(5)
  })

  it('each machine has all required fields', () => {
    const required: (keyof Machine)[] = [
      'id', 'name', 'description', 'thumbnail', 'muscles',
      'sketchfabId', 'gif', 'callout', 'steps', 'mistakes', 'warning',
    ]
    machines.forEach((m: Machine) => {
      required.forEach((field) => {
        expect(m, `machine "${m.id}" missing field "${field}"`).toHaveProperty(field)
      })
    })
  })

  it('each machine has at least 2 steps', () => {
    machines.forEach((m: Machine) => {
      expect(m.steps.length, `machine "${m.id}" needs ≥2 steps`).toBeGreaterThanOrEqual(2)
    })
  })

  it('each machine has at least 1 mistake', () => {
    machines.forEach((m: Machine) => {
      expect(m.mistakes.length, `machine "${m.id}" needs ≥1 mistake`).toBeGreaterThanOrEqual(1)
    })
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/types/machine.test.ts
```

Expected: FAIL — `machine.ts` and `machines.json` don't exist yet.

- [ ] **Step 3: Create `src/types/machine.ts`**

```ts
export interface LocalizedString {
  zh: string
  en: string
}

export interface Machine {
  id: string
  name: LocalizedString
  description: LocalizedString
  thumbnail: string
  muscles: LocalizedString[]
  sketchfabId: string
  gif: string
  callout: string
  steps: LocalizedString[]
  mistakes: LocalizedString[]
  warning: LocalizedString
}
```

- [ ] **Step 4: Create `src/data/machines.json`**

```json
[
  {
    "id": "lat-pulldown",
    "name": { "zh": "滑輪下拉機", "en": "Lat Pulldown Machine" },
    "description": { "zh": "訓練背部與手臂肌肉，適合初學者建立上背力量", "en": "Trains back and arm muscles, great for beginners building upper back strength" },
    "thumbnail": "/images/lat-pulldown-thumb.jpg",
    "muscles": [
      { "zh": "背部", "en": "Back" },
      { "zh": "手臂", "en": "Arms" }
    ],
    "sketchfabId": "PLACEHOLDER_LAT_PULLDOWN",
    "gif": "/videos/lat-pulldown.gif",
    "callout": "/images/lat-pulldown-callout.jpg",
    "steps": [
      { "zh": "調整座墊高度，使大腿貼合固定墊", "en": "Adjust the seat pad so your thighs fit snugly under the pad" },
      { "zh": "站立抓住橫桿後坐下，雙手握距略寬於肩", "en": "Stand, grab the bar slightly wider than shoulder-width, then sit down" },
      { "zh": "選擇重量：初學者建議從體重的 30–40% 開始", "en": "Choose weight: beginners should start at 30–40% of body weight" },
      { "zh": "背部挺直，將橫桿向胸口方向下拉，感受背部用力", "en": "Keep back straight, pull the bar down toward your chest, feel your back engage" },
      { "zh": "緩慢控制讓橫桿回到起始位置", "en": "Slowly let the bar return to the starting position under control" }
    ],
    "mistakes": [
      { "zh": "不要用甩動身體的方式借力拉下橫桿", "en": "Don't swing your body to pull the bar down" },
      { "zh": "不要讓重量快速彈回，保持全程控制", "en": "Don't let the weight snap back — control the return" }
    ],
    "warning": {
      "zh": "若感到肩膀或手肘疼痛請立即停止，重量過重是常見原因",
      "en": "Stop immediately if you feel shoulder or elbow pain — weight is likely too heavy"
    }
  },
  {
    "id": "cable-row",
    "name": { "zh": "坐姿划船機", "en": "Cable Row Machine" },
    "description": { "zh": "訓練背部中段與手臂，幫助改善坐姿與體態", "en": "Trains mid-back and arms, helps improve posture" },
    "thumbnail": "/images/cable-row-thumb.jpg",
    "muscles": [
      { "zh": "背部中段", "en": "Mid Back" },
      { "zh": "手臂", "en": "Arms" },
      { "zh": "核心", "en": "Core" }
    ],
    "sketchfabId": "PLACEHOLDER_CABLE_ROW",
    "gif": "/videos/cable-row.gif",
    "callout": "/images/cable-row-callout.jpg",
    "steps": [
      { "zh": "坐在座墊上，雙腳踩在腳踏板，膝蓋微彎", "en": "Sit on the pad, place feet on the platform with a slight knee bend" },
      { "zh": "身體微微前傾抓住握把，背部打直", "en": "Lean slightly forward to grab the handle, keep your back straight" },
      { "zh": "選擇重量：初學者建議 10–20 公斤開始", "en": "Choose weight: beginners start with 10–20 kg" },
      { "zh": "將握把向肚臍方向拉，手肘靠近身體兩側", "en": "Pull the handle toward your navel, keep elbows close to your sides" },
      { "zh": "緩慢回到起始位置，感受背部伸展", "en": "Slowly return to start and feel the stretch in your back" }
    ],
    "mistakes": [
      { "zh": "不要用甩動背部借力，動作要穩定", "en": "Don't rock your back to pull the weight — keep movement controlled" },
      { "zh": "不要聳肩，保持肩膀向下放鬆", "en": "Don't shrug your shoulders — keep them down and relaxed" }
    ],
    "warning": {
      "zh": "若下背感到不適，請檢查是否過度前傾或重量過重",
      "en": "If your lower back hurts, check if you're leaning too far forward or the weight is too heavy"
    }
  },
  {
    "id": "abdominal-bench",
    "name": { "zh": "腹肌訓練椅", "en": "Abdominal Bench" },
    "description": { "zh": "訓練腹部核心肌群，增強腰腹力量", "en": "Trains core abdominal muscles and strengthens the midsection" },
    "thumbnail": "/images/abdominal-bench-thumb.jpg",
    "muscles": [
      { "zh": "腹部", "en": "Abs" },
      { "zh": "核心", "en": "Core" }
    ],
    "sketchfabId": "PLACEHOLDER_ABDOMINAL_BENCH",
    "gif": "/videos/abdominal-bench.gif",
    "callout": "/images/abdominal-bench-callout.jpg",
    "steps": [
      { "zh": "調整椅背角度：初學者建議接近水平或稍微傾斜", "en": "Set the backrest angle: beginners should start near flat or slightly inclined" },
      { "zh": "坐上後雙腳勾住腳墊，固定下半身", "en": "Sit and hook your feet under the foot pad to secure your lower body" },
      { "zh": "雙手交叉放在胸前或輕扶耳側（不要拉頭）", "en": "Cross arms over chest or lightly place hands beside your head (don't pull your head)" },
      { "zh": "緩慢向後躺下，再用腹部力量坐起", "en": "Slowly lean back, then use your abs to sit back up" },
      { "zh": "不需要完全躺平，到腹部感到緊繃即可回來", "en": "You don't need to lie fully flat — return when you feel your abs fully contract" }
    ],
    "mistakes": [
      { "zh": "不要用脖子或手臂拉力，專注腹部收縮", "en": "Don't pull with your neck or arms — focus on contracting your abs" },
      { "zh": "不要動作過快，慢速才能有效訓練腹肌", "en": "Don't rush — slow movement is more effective for training abs" }
    ],
    "warning": {
      "zh": "若有下背疼痛問題，請先諮詢醫生再使用此器材",
      "en": "If you have lower back issues, consult a doctor before using this equipment"
    }
  },
  {
    "id": "leg-press",
    "name": { "zh": "腿部推蹬機", "en": "Leg Press Machine" },
    "description": { "zh": "訓練大腿與臀部肌肉，適合初學者安全練腿", "en": "Trains thighs and glutes — a safe beginner-friendly leg exercise" },
    "thumbnail": "/images/leg-press-thumb.jpg",
    "muscles": [
      { "zh": "大腿", "en": "Thighs" },
      { "zh": "臀部", "en": "Glutes" },
      { "zh": "小腿", "en": "Calves" }
    ],
    "sketchfabId": "PLACEHOLDER_LEG_PRESS",
    "gif": "/videos/leg-press.gif",
    "callout": "/images/leg-press-callout.jpg",
    "steps": [
      { "zh": "調整座椅距離，使膝蓋彎曲約 90 度", "en": "Adjust the seat so your knees bend to about 90 degrees" },
      { "zh": "雙腳平放在踏板中央，與肩同寬", "en": "Place feet flat on the platform, shoulder-width apart" },
      { "zh": "選擇重量：初學者建議從 20–30 公斤開始", "en": "Choose weight: beginners start with 20–30 kg" },
      { "zh": "推開踏板時扳開安全把手，雙手握住兩側扶把", "en": "Push the platform and release the safety handle, grip the side handles" },
      { "zh": "緩慢彎曲膝蓋讓踏板靠近，再推出去，腳跟保持貼穩", "en": "Slowly bend knees to lower the platform, then push out — keep heels flat" }
    ],
    "mistakes": [
      { "zh": "不要讓膝蓋向內夾，保持與腳趾同方向", "en": "Don't let knees cave inward — keep them aligned with your toes" },
      { "zh": "不要在最高點鎖死膝蓋，保留微彎保護關節", "en": "Don't lock your knees at the top — keep a slight bend to protect your joints" }
    ],
    "warning": {
      "zh": "使用完畢請記得重新鎖上安全把手，避免踏板滑落",
      "en": "Always re-engage the safety lock after use to prevent the platform from dropping"
    }
  },
  {
    "id": "chest-press",
    "name": { "zh": "胸部推舉機", "en": "Chest Press Machine" },
    "description": { "zh": "訓練胸部、肩膀與手臂，初學者友善的推胸動作", "en": "Trains chest, shoulders and arms — beginner-friendly chest exercise" },
    "thumbnail": "/images/chest-press-thumb.jpg",
    "muscles": [
      { "zh": "胸部", "en": "Chest" },
      { "zh": "肩膀", "en": "Shoulders" },
      { "zh": "手臂", "en": "Arms" }
    ],
    "sketchfabId": "PLACEHOLDER_CHEST_PRESS",
    "gif": "/videos/chest-press.gif",
    "callout": "/images/chest-press-callout.jpg",
    "steps": [
      { "zh": "調整座椅高度，使握把與胸口齊平", "en": "Adjust seat height so the handles are level with your chest" },
      { "zh": "背部完全貼合椅背，雙腳平放地面", "en": "Press your back fully against the seat back, feet flat on the floor" },
      { "zh": "選擇重量：初學者建議從 10–15 公斤開始", "en": "Choose weight: beginners start with 10–15 kg" },
      { "zh": "雙手握住握把，向前推出直到手臂幾乎打直", "en": "Grip the handles and push forward until arms are nearly straight" },
      { "zh": "緩慢彎曲手肘回到起始位置，感受胸部伸展", "en": "Slowly bend elbows back to the start position and feel your chest stretch" }
    ],
    "mistakes": [
      { "zh": "不要讓背部離開椅背借力推更重", "en": "Don't arch your back off the seat to push more weight" },
      { "zh": "不要完全鎖死手肘，保留微彎保護關節", "en": "Don't fully lock your elbows — keep a slight bend to protect your joints" }
    ],
    "warning": {
      "zh": "若感到肩膀夾痛，請降低重量或重新調整座椅高度",
      "en": "If you feel shoulder impingement pain, reduce the weight or re-adjust the seat height"
    }
  }
]
```

- [ ] **Step 5: Run test to confirm it passes**

```bash
npm run test:run -- src/types/machine.test.ts
```

Expected: PASS — 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/types/ src/data/
git commit -m "feat: add Machine type and 5-machine JSON dataset with full bilingual content"
```

---

### Task 3: i18n Setup

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/zh.json`
- Create: `src/i18n/en.json`
- Create: `src/i18n/i18n.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/i18n/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import zh from './zh.json'
import en from './en.json'

describe('i18n translation files', () => {
  it('zh and en have identical keys', () => {
    expect(Object.keys(zh).sort()).toEqual(Object.keys(en).sort())
  })

  it('zh has all required UI keys', () => {
    const required = [
      'browseAll', 'steps', 'mistakes', 'warning',
      'notFound', 'backToHome', 'printAll', 'qrPageTitle',
      'loading', 'switchLang',
    ]
    required.forEach((key) => {
      expect(zh, `missing key: ${key}`).toHaveProperty(key)
    })
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/i18n/i18n.test.ts
```

Expected: FAIL — files don't exist yet.

- [ ] **Step 3: Create `src/i18n/zh.json`**

```json
{
  "browseAll": "所有器材",
  "steps": "使用步驟",
  "mistakes": "常見錯誤",
  "warning": "注意事項",
  "notFound": "找不到此器材頁面",
  "backToHome": "回到首頁",
  "printAll": "列印全部 QR Code",
  "qrPageTitle": "器材 QR Code",
  "loading": "載入中...",
  "switchLang": "EN"
}
```

- [ ] **Step 4: Create `src/i18n/en.json`**

```json
{
  "browseAll": "All Equipment",
  "steps": "How to Use",
  "mistakes": "Common Mistakes",
  "warning": "Safety Warning",
  "notFound": "Machine page not found",
  "backToHome": "Back to Home",
  "printAll": "Print All QR Codes",
  "qrPageTitle": "Equipment QR Codes",
  "loading": "Loading...",
  "switchLang": "繁中"
}
```

- [ ] **Step 5: Create `src/i18n/index.ts`**

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import en from './en.json'

const savedLang =
  typeof localStorage !== 'undefined' ? (localStorage.getItem('lang') ?? 'zh') : 'zh'

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lang) => {
  localStorage.setItem('lang', lang)
})

export default i18n
```

- [ ] **Step 6: Run test to confirm it passes**

```bash
npm run test:run -- src/i18n/i18n.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/
git commit -m "feat: add react-i18next setup with zh/en translations, localStorage persistence"
```

---

### Task 4: Content Research — Sketchfab Model IDs

**Files:**
- Modify: `src/data/machines.json` — replace `PLACEHOLDER_*` values with real Sketchfab embed IDs

> This is a content task, not a code task. No tests needed.

- [ ] **Step 1: Search Sketchfab for each machine**

Go to `https://sketchfab.com` and search for each machine using the terms below. Filter by **"Free"** license. Prefer models with high likes and a clean look.

| Machine | Search term |
|---|---|
| Lat Pulldown | `lat pulldown machine gym` |
| Cable Row | `cable row machine gym` |
| Abdominal Bench | `ab bench sit-up bench gym` |
| Leg Press | `leg press machine gym` |
| Chest Press | `chest press machine gym` |

- [ ] **Step 2: Get the embed ID for each model**

On the model page, click **Share → Embed**. Copy the model ID from the iframe `src`:

```
https://sketchfab.com/models/THIS_IS_THE_ID/embed
```

- [ ] **Step 3: Update `src/data/machines.json`**

Replace each `PLACEHOLDER_*` string with the real model ID you found. Example:

```json
"sketchfabId": "a1b2c3d4e5f67890abcdef1234567890"
```

- [ ] **Step 4: Commit**

```bash
git add src/data/machines.json
git commit -m "content: add real Sketchfab model IDs for all 5 machines"
```

---

### Task 5: SketchfabEmbed Component

**Files:**
- Create: `src/components/SketchfabEmbed.tsx`
- Create: `src/components/SketchfabEmbed.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/SketchfabEmbed.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SketchfabEmbed from './SketchfabEmbed'

describe('SketchfabEmbed', () => {
  it('renders an iframe containing the model ID in its src', () => {
    render(<SketchfabEmbed modelId="abc123" title="Test Machine" />)
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeTruthy()
    expect(iframe?.src).toContain('abc123')
  })

  it('shows a loading skeleton before the iframe loads', () => {
    render(<SketchfabEmbed modelId="abc123" title="Test Machine" />)
    expect(document.querySelector('[data-testid="sketchfab-skeleton"]')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/components/SketchfabEmbed.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/components/SketchfabEmbed.tsx`**

```tsx
import { useState } from 'react'

interface Props {
  modelId: string
  title: string
}

export default function SketchfabEmbed({ modelId, title }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      {!loaded && (
        <div
          data-testid="sketchfab-skeleton"
          className="absolute inset-0 bg-gray-100 animate-pulse"
        />
      )}
      <iframe
        title={title}
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=0&ui_theme=light&preload=1`}
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm run test:run -- src/components/SketchfabEmbed.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SketchfabEmbed.tsx src/components/SketchfabEmbed.test.tsx
git commit -m "feat: add SketchfabEmbed with 16:9 aspect ratio and loading skeleton"
```

---

### Task 6: MotionDemo + CalloutDiagram Components

**Files:**
- Create: `src/components/MotionDemo.tsx`
- Create: `src/components/MotionDemo.test.tsx`
- Create: `src/components/CalloutDiagram.tsx`
- Create: `src/components/CalloutDiagram.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/MotionDemo.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import MotionDemo from './MotionDemo'

describe('MotionDemo', () => {
  it('renders an img with the gif src', () => {
    render(<MotionDemo src="/videos/test.gif" alt="Test exercise" />)
    const img = document.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/videos/test.gif')
  })
})
```

Create `src/components/CalloutDiagram.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CalloutDiagram from './CalloutDiagram'

describe('CalloutDiagram', () => {
  it('renders an img with the callout src', () => {
    render(<CalloutDiagram src="/images/callout.jpg" alt="Machine diagram" />)
    const img = document.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/images/callout.jpg')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm run test:run -- src/components/MotionDemo.test.tsx src/components/CalloutDiagram.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/components/MotionDemo.tsx`**

```tsx
interface Props {
  src: string
  alt: string
}

export default function MotionDemo({ src, alt }: Props) {
  return (
    <div className="w-full rounded-lg overflow-hidden bg-gray-50">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/CalloutDiagram.tsx`**

```tsx
interface Props {
  src: string
  alt: string
}

export default function CalloutDiagram({ src, alt }: Props) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-100">
      <img
        src={src}
        alt={alt}
        className="w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm run test:run -- src/components/MotionDemo.test.tsx src/components/CalloutDiagram.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/MotionDemo.tsx src/components/MotionDemo.test.tsx src/components/CalloutDiagram.tsx src/components/CalloutDiagram.test.tsx
git commit -m "feat: add MotionDemo and CalloutDiagram components"
```

---

### Task 7: StepList + MistakesList + WarningBox Components

**Files:**
- Create: `src/components/StepList.tsx`
- Create: `src/components/StepList.test.tsx`
- Create: `src/components/MistakesList.tsx`
- Create: `src/components/MistakesList.test.tsx`
- Create: `src/components/WarningBox.tsx`
- Create: `src/components/WarningBox.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/StepList.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StepList from './StepList'

describe('StepList', () => {
  it('renders each step with its number', () => {
    render(<StepList steps={['First step', 'Second step']} />)
    expect(screen.getByText('First step')).toBeTruthy()
    expect(screen.getByText('Second step')).toBeTruthy()
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
  })
})
```

Create `src/components/MistakesList.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MistakesList from './MistakesList'

describe('MistakesList', () => {
  it('renders each mistake', () => {
    render(<MistakesList mistakes={['Bad form', 'Wrong weight']} />)
    expect(screen.getByText('Bad form')).toBeTruthy()
    expect(screen.getByText('Wrong weight')).toBeTruthy()
  })
})
```

Create `src/components/WarningBox.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WarningBox from './WarningBox'

describe('WarningBox', () => {
  it('renders the warning text', () => {
    render(<WarningBox text="Stop if you feel pain" />)
    expect(screen.getByText('Stop if you feel pain')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm run test:run -- src/components/StepList.test.tsx src/components/MistakesList.test.tsx src/components/WarningBox.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/components/StepList.tsx`**

```tsx
interface Props {
  steps: string[]
}

export default function StepList({ steps }: Props) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center">
            {i + 1}
          </span>
          <span className="text-gray-700 leading-relaxed pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  )
}
```

- [ ] **Step 4: Create `src/components/MistakesList.tsx`**

```tsx
interface Props {
  mistakes: string[]
}

export default function MistakesList({ mistakes }: Props) {
  return (
    <ul className="space-y-2">
      {mistakes.map((mistake, i) => (
        <li key={i} className="flex gap-2 items-start text-gray-700">
          <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="leading-relaxed">{mistake}</span>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 5: Create `src/components/WarningBox.tsx`**

```tsx
interface Props {
  text: string
}

export default function WarningBox({ text }: Props) {
  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start">
      <span className="text-amber-500 text-xl flex-shrink-0" aria-hidden>⚠️</span>
      <p className="text-amber-800 text-sm leading-relaxed">{text}</p>
    </div>
  )
}
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
npm run test:run -- src/components/StepList.test.tsx src/components/MistakesList.test.tsx src/components/WarningBox.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/StepList.tsx src/components/StepList.test.tsx src/components/MistakesList.tsx src/components/MistakesList.test.tsx src/components/WarningBox.tsx src/components/WarningBox.test.tsx
git commit -m "feat: add StepList, MistakesList, and WarningBox components"
```

---

### Task 8: MuscleTags + LanguageToggle Components

**Files:**
- Create: `src/components/MuscleTags.tsx`
- Create: `src/components/MuscleTags.test.tsx`
- Create: `src/components/LanguageToggle.tsx`
- Create: `src/components/LanguageToggle.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/MuscleTags.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MuscleTags from './MuscleTags'

describe('MuscleTags', () => {
  it('renders each muscle tag', () => {
    render(<MuscleTags tags={['背部', '手臂']} />)
    expect(screen.getByText('背部')).toBeTruthy()
    expect(screen.getByText('手臂')).toBeTruthy()
  })
})
```

Create `src/components/LanguageToggle.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageToggle from './LanguageToggle'
import '../i18n/index'

describe('LanguageToggle', () => {
  it('renders a button', () => {
    render(<LanguageToggle />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('toggles language on click without throwing', async () => {
    render(<LanguageToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm run test:run -- src/components/MuscleTags.test.tsx src/components/LanguageToggle.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/components/MuscleTags.tsx`**

```tsx
interface Props {
  tags: string[]
}

export default function MuscleTags({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/LanguageToggle.tsx`**

```tsx
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
    >
      {t('switchLang')}
    </button>
  )
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm run test:run -- src/components/MuscleTags.test.tsx src/components/LanguageToggle.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/MuscleTags.tsx src/components/MuscleTags.test.tsx src/components/LanguageToggle.tsx src/components/LanguageToggle.test.tsx
git commit -m "feat: add MuscleTags and LanguageToggle components"
```

---

### Task 9: MachineCard Component

**Files:**
- Create: `src/components/MachineCard.tsx`
- Create: `src/components/MachineCard.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/MachineCard.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MachineCard from './MachineCard'
import type { Machine } from '../types/machine'
import '../i18n/index'

const mock: Machine = {
  id: 'lat-pulldown',
  name: { zh: '滑輪下拉機', en: 'Lat Pulldown Machine' },
  description: { zh: '訓練背部', en: 'Trains back' },
  thumbnail: '/images/thumb.jpg',
  muscles: [{ zh: '背部', en: 'Back' }],
  sketchfabId: 'abc123',
  gif: '/videos/test.gif',
  callout: '/images/callout.jpg',
  steps: [{ zh: '步驟一', en: 'Step one' }],
  mistakes: [{ zh: '錯誤一', en: 'Mistake one' }],
  warning: { zh: '注意', en: 'Warning' },
}

describe('MachineCard', () => {
  it('renders the machine name in zh by default', () => {
    render(
      <MemoryRouter>
        <MachineCard machine={mock} />
      </MemoryRouter>
    )
    expect(screen.getByText('滑輪下拉機')).toBeTruthy()
  })

  it('links to /machine/lat-pulldown', () => {
    render(
      <MemoryRouter>
        <MachineCard machine={mock} />
      </MemoryRouter>
    )
    expect(document.querySelector('a')?.getAttribute('href')).toBe('/machine/lat-pulldown')
  })

  it('renders the muscle tag', () => {
    render(
      <MemoryRouter>
        <MachineCard machine={mock} />
      </MemoryRouter>
    )
    expect(screen.getByText('背部')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/components/MachineCard.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/components/MachineCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Machine } from '../types/machine'
import MuscleTags from './MuscleTags'

interface Props {
  machine: Machine
}

export default function MachineCard({ machine }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'zh' | 'en'

  return (
    <Link
      to={`/machine/${machine.id}`}
      className="block rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video bg-gray-50 overflow-hidden">
        <img
          src={machine.thumbnail}
          alt={machine.name[lang]}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 space-y-2">
        <h2 className="font-semibold text-sm text-gray-900 leading-snug">{machine.name[lang]}</h2>
        <p className="text-xs text-gray-400 line-clamp-2">{machine.description[lang]}</p>
        <MuscleTags tags={machine.muscles.map((m) => m[lang])} />
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm run test:run -- src/components/MachineCard.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/MachineCard.tsx src/components/MachineCard.test.tsx
git commit -m "feat: add MachineCard component"
```

---

### Task 10: HomePage

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/HomePage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/HomePage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
import '../i18n/index'

describe('HomePage', () => {
  it('renders 5 machine card links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const links = document.querySelectorAll('a[href^="/machine/"]')
    expect(links).toHaveLength(5)
  })

  it('renders the page heading in zh', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('所有器材')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/pages/HomePage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/pages/HomePage.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import machines from '../data/machines.json'
import type { Machine } from '../types/machine'
import MachineCard from '../components/MachineCard'
import LanguageToggle from '../components/LanguageToggle'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{t('browseAll')}</h1>
          <LanguageToggle />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {(machines as Machine[]).map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm run test:run -- src/pages/HomePage.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.test.tsx
git commit -m "feat: add HomePage with 2-column machine grid"
```

---

### Task 11: MachinePage

**Files:**
- Create: `src/pages/MachinePage.tsx`
- Create: `src/pages/MachinePage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/MachinePage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render as rtlRender, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MachinePage from './MachinePage'
import '../i18n/index'

const renderAt = (id: string) =>
  rtlRender(
    <MemoryRouter initialEntries={[`/machine/${id}`]}>
      <Routes>
        <Route path="/machine/:id" element={<MachinePage />} />
      </Routes>
    </MemoryRouter>
  )

describe('MachinePage', () => {
  it('renders the machine name for lat-pulldown in zh', () => {
    renderAt('lat-pulldown')
    expect(screen.getByText('滑輪下拉機')).toBeTruthy()
  })

  it('renders a link back to home', () => {
    renderAt('lat-pulldown')
    expect(document.querySelector('a[href="/"]')).toBeTruthy()
  })

  it('shows the not-found message for an unknown machine id', () => {
    renderAt('unknown-machine-xyz')
    expect(screen.getByText('找不到此器材頁面')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/pages/MachinePage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/pages/MachinePage.tsx`**

```tsx
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import machines from '../data/machines.json'
import type { Machine } from '../types/machine'
import LanguageToggle from '../components/LanguageToggle'
import MuscleTags from '../components/MuscleTags'
import SketchfabEmbed from '../components/SketchfabEmbed'
import MotionDemo from '../components/MotionDemo'
import CalloutDiagram from '../components/CalloutDiagram'
import StepList from '../components/StepList'
import MistakesList from '../components/MistakesList'
import WarningBox from '../components/WarningBox'

export default function MachinePage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'zh' | 'en'

  const machine = (machines as Machine[]).find((m) => m.id === id)

  if (!machine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-500">{t('notFound')}</p>
        <Link to="/" className="text-gray-900 font-medium underline">
          {t('backToHome')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900 truncate pr-4">
            {machine.name[lang]}
          </h1>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <MuscleTags tags={machine.muscles.map((m) => m[lang])} />

        <SketchfabEmbed modelId={machine.sketchfabId} title={machine.name[lang]} />

        <MotionDemo src={machine.gif} alt={machine.name[lang]} />

        <CalloutDiagram src={machine.callout} alt={`${machine.name[lang]} diagram`} />

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">{t('steps')}</h2>
          <StepList steps={machine.steps.map((s) => s[lang])} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">{t('mistakes')}</h2>
          <MistakesList mistakes={machine.mistakes.map((m) => m[lang])} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">{t('warning')}</h2>
          <WarningBox text={machine.warning[lang]} />
        </section>

        <div className="pt-4 pb-10 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 underline">
            {t('browseAll')}
          </Link>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm run test:run -- src/pages/MachinePage.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/MachinePage.tsx src/pages/MachinePage.test.tsx
git commit -m "feat: add MachinePage with full machine detail layout"
```

---

### Task 12: QRCodesPage + NotFoundPage

**Files:**
- Create: `src/pages/NotFoundPage.tsx`
- Create: `src/pages/NotFoundPage.test.tsx`
- Create: `src/pages/QRCodesPage.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/NotFoundPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import '../i18n/index'

describe('NotFoundPage', () => {
  it('renders the not-found message in zh', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    expect(screen.getByText('找不到此器材頁面')).toBeTruthy()
  })

  it('has a link back to /', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    expect(document.querySelector('a[href="/"]')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/pages/NotFoundPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create `src/pages/NotFoundPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-5xl" aria-hidden>🏋️</span>
      <p className="text-gray-500">{t('notFound')}</p>
      <Link to="/" className="text-gray-900 font-medium underline">
        {t('backToHome')}
      </Link>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/QRCodesPage.tsx`**

```tsx
import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import machines from '../data/machines.json'
import type { Machine } from '../types/machine'

export default function QRCodesPage() {
  const { t } = useTranslation()
  const base = window.location.origin

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h1 className="text-xl font-semibold">{t('qrPageTitle')}</h1>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('printAll')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {(machines as Machine[]).map((machine) => (
            <div
              key={machine.id}
              className="flex flex-col items-center gap-3 p-6 border border-gray-100 rounded-xl"
            >
              <QRCodeSVG
                value={`${base}/machine/${machine.id}`}
                size={160}
                level="M"
              />
              <p className="font-semibold text-sm text-center">{machine.name.zh}</p>
              <p className="text-xs text-gray-400 text-center">{machine.name.en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run test to confirm it passes**

```bash
npm run test:run -- src/pages/NotFoundPage.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/NotFoundPage.tsx src/pages/NotFoundPage.test.tsx src/pages/QRCodesPage.tsx
git commit -m "feat: add NotFoundPage and QRCodesPage with printable QR codes"
```

---

### Task 13: App.tsx + Router + Vercel Config

**Files:**
- Modify: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `vercel.json`

- [ ] **Step 1: Write the failing test**

Create `src/App.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import './i18n/index'

describe('App routing', () => {
  it('renders HomePage at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(document.querySelector('a[href^="/machine/"]')).toBeTruthy()
  })

  it('renders NotFoundPage for an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/totally-unknown']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('找不到此器材頁面')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test:run -- src/App.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Replace `src/App.tsx`**

```tsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MachinePage from './pages/MachinePage'
import QRCodesPage from './pages/QRCodesPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/machine/:id" element={<MachinePage />} />
      <Route path="/admin/qr-codes" element={<QRCodesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
```

- [ ] **Step 4: Create `vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

This tells Vercel to serve `index.html` for all paths so React Router handles navigation client-side.

- [ ] **Step 5: Run test to confirm it passes**

```bash
npm run test:run -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Run the full test suite**

```bash
npm run test:run
```

Expected: All tests pass. 0 failures.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx vercel.json
git commit -m "feat: wire up React Router with all pages and add Vercel SPA config"
```

---

### Task 14: Deploy to Vercel + Populate Content

**Files:** No code changes — deployment and content population only.

- [ ] **Step 1: Push to GitHub**

Create a new repository at `github.com` (name it e.g. `gym-instruction`), then:

```bash
git remote add origin https://github.com/<your-username>/gym-instruction.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

1. Go to `https://vercel.com` and sign in with GitHub
2. Click **Add New Project** → import `gym-instruction`
3. Leave all settings as default (Vercel auto-detects Vite)
4. Click **Deploy**

Expected: Vercel provides a live URL like `https://gym-instruction.vercel.app`.

- [ ] **Step 3: Smoke-test on your phone**

Open the live URL on your phone and verify:
- Home page shows 2-column machine grid
- Tapping a card navigates to the machine page
- Sketchfab embed loads and is rotatable by finger
- Language toggle switches between 繁中 and EN and persists on refresh
- `/admin/qr-codes` shows 5 printable QR codes
- Scanning a QR code with your phone camera opens the correct machine page
- An unknown URL (e.g., `/machine/fake`) shows the 404 page with a link home

- [ ] **Step 4: Add real content assets**

Once you have your GIFs and callout images, place them in `public/`:

```
public/images/lat-pulldown-thumb.jpg
public/images/lat-pulldown-callout.jpg
public/images/cable-row-thumb.jpg
public/images/cable-row-callout.jpg
public/images/abdominal-bench-thumb.jpg
public/images/abdominal-bench-callout.jpg
public/images/leg-press-thumb.jpg
public/images/leg-press-callout.jpg
public/images/chest-press-thumb.jpg
public/images/chest-press-callout.jpg
public/videos/lat-pulldown.gif
public/videos/cable-row.gif
public/videos/abdominal-bench.gif
public/videos/leg-press.gif
public/videos/chest-press.gif
```

Then push — Vercel auto-deploys every push to `main`:

```bash
git add public/
git commit -m "content: add machine thumbnails, callout diagrams, and GIFs"
git push
```

---

## Content Asset Guide

### Finding GIFs / Videos

Free sources for exercise motion demos:
- **Giphy** — search `lat pulldown exercise`, `cable row exercise`, etc.
- **GFYCAT** — similar search
- **ExRx.net** — has exercise animations (right-click → save)

### Creating Callout Diagrams

The fastest approach: take a photo of the real machine, open it in **Canva** (free), and add arrows + text labels pointing to the adjustable parts (seat height lever, weight pin, handle grips). Export as JPG.

### Recommended Image Sizes

| Asset | Recommended size |
|---|---|
| Thumbnail | 600×400px JPG |
| Callout diagram | 800×600px JPG |
| GIF | Max 5MB, 480px wide |
