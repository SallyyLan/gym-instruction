# Gym Equipment Instruction Web App — Design Spec
**Date:** 2026-05-16  
**Status:** Approved

---

## 1. Problem & Goal

Gym beginners — especially women who are new to weight training — have no one to ask when there's no coach available. Paper instructions on machines are static and unclear. This app replaces paper with an interactive, bilingual, scan-and-learn experience that shows exactly how to use, adjust, and safely operate each machine.

**Non-goals:** Not a fitness tracker. Not a coaching platform. Not a user account system. Read-only reference tool only.

---

## 2. Target Users

- Gym beginners, especially women new to weight training
- People who want to learn on their own without hiring a coach
- Users who are on their phone in a gym, likely with weak WiFi

---

## 3. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Fast build, lightweight output |
| Routing | React Router v6 | Clean URL per machine |
| i18n | react-i18next | EN / 繁中 toggle, no page reload |
| 3D viewer | Sketchfab embed | No asset processing needed, interactive rotate/zoom built in |
| Motion demo | Looping GIF / short MP4 | Simple, no 3D asset pipeline |
| Callout diagrams | Static annotated images | One image per machine, arrows pointing to adjustable parts |
| Data | Local JSON file | No backend, fully static |
| Hosting | Vercel (free tier) | Push to GitHub → auto deploy |
| QR codes | qrcode.react (in-browser) | No third party, printable from app |

---

## 4. Routes

| Path | Description |
|---|---|
| `/` | Home — browse all machines |
| `/machine/:id` | Machine detail page |
| `/admin/qr-codes` | Hidden page to print QR codes |
| `*` | 404 fallback page |

---

## 5. Pages

### 5.1 Home Page (`/`)

- Grid of machine cards (2 columns on mobile)
- Each card: thumbnail image, machine name (繁中 primary, EN secondary), muscle group tags, short one-line description
- Tapping a card navigates to the machine page
- Language toggle (繁中 / EN) in top-right corner — defaults to 繁中

### 5.2 Machine Page (`/machine/:id`)

Top to bottom layout (mobile-first):

1. **Header** — machine name + language toggle (繁中 default)
2. **Muscle group tags** — e.g., `背部` `手臂` — shows what you're training
3. **Sketchfab embed** — interactive 3D model, rotate/zoom with finger or mouse. Shows a loading skeleton while the iframe loads.
4. **Motion demo** — looping GIF or short MP4 of a person performing the exercise
5. **Callout diagram** — annotated image with arrows pointing to: seat height adjuster, weight pin, handle/grip position, footrest, etc.
6. **Step-by-step instructions** — numbered steps covering:
   - How to adjust the machine (seat, weight, height)
   - Correct starting posture
   - How to perform the movement
7. **Common mistakes** — 1–2 bullet points on what NOT to do
8. **Warning box** — machine-specific safety tip (styled distinctly, e.g., amber background)
9. **"Browse all machines"** link at the very bottom

### 5.3 QR Code Page (`/admin/qr-codes`)

- Not linked from anywhere in the public UI
- Lists all machines with name + generated QR code
- "Print All" button triggers browser print with all QR codes laid out cleanly
- Each QR code links to the machine's full URL (e.g., `https://gymguide.vercel.app/machine/lat-pulldown`)

### 5.4 404 Page

- Friendly message: "找不到此器材頁面" / "Machine page not found"
- Link back to home page
- Shown when QR code is broken or URL is wrong

---

## 6. Data Structure

All content lives in `src/data/machines.json`. Adding a new machine = add one JSON entry.

```json
{
  "id": "lat-pulldown",
  "name": { "zh": "滑輪下拉機", "en": "Lat Pulldown Machine" },
  "description": { "zh": "訓練背部與手臂肌肉", "en": "Trains back and arm muscles" },
  "thumbnail": "/images/lat-pulldown-thumb.jpg",
  "muscles": [
    { "zh": "背部", "en": "Back" },
    { "zh": "手臂", "en": "Arms" }
  ],
  "sketchfabId": "SKETCHFAB_EMBED_ID",
  "gif": "/videos/lat-pulldown.gif",
  "callout": "/images/lat-pulldown-callout.jpg",
  "steps": [
    { "zh": "調整座椅高度至髖骨位置", "en": "Adjust seat height to hip level" },
    { "zh": "雙手握住橫桿，與肩同寬", "en": "Grip the bar shoulder-width apart" }
  ],
  "mistakes": [
    { "zh": "不要用力甩動身體借力", "en": "Don't swing your body to pull the weight" },
    { "zh": "不要聳肩", "en": "Don't shrug your shoulders" }
  ],
  "warning": {
    "zh": "選擇適合自己的重量，初學者建議從輕重量開始",
    "en": "Choose a weight appropriate for your level. Beginners should start light."
  }
}
```

---

## 7. Starter Machines (5)

| ID | 繁中 | English |
|---|---|---|
| `lat-pulldown` | 滑輪下拉機 | Lat Pulldown Machine |
| `cable-row` | 坐姿划船機 | Cable Row Machine |
| `abdominal-bench` | 腹肌訓練椅 | Abdominal Bench |
| `leg-press` | 腿部推蹬機 | Leg Press Machine |
| `chest-press` | 胸部推舉機 | Chest Press Machine |

---

## 8. i18n

- Default language: **Traditional Chinese (繁中)**
- Secondary: **English (EN)**
- Toggle button in top-right corner of every page
- Language preference stored in `localStorage` so it persists between sessions
- All UI strings, step text, warnings, mistakes, and machine names switch instantly on toggle

---

## 9. Mobile-First Design

- All layouts designed for phone screens first (320px–430px wide)
- Sketchfab embed: full width, 16:9 aspect ratio, touch-friendly rotate
- GIF/video: full width, autoplay, muted, loop
- Minimum tap target: 44px
- Font: system font stack for fast load; ensure CJK characters render correctly

---

## 10. Loading & Error States

- **Sketchfab embed:** Show a grey skeleton placeholder while the iframe loads
- **GIF/image:** Show a subtle loading shimmer
- **Unknown machine ID:** Redirect to 404 page
- **No JS fallback:** Not required (target users have modern smartphones)

---

## 11. Style

- **Theme:** Clean and minimal — white/off-white background, light grey borders
- **Typography:** Simple, readable; Chinese text at least 16px
- **Warning box:** Amber/yellow background to stand out from instructional content
- **Muscle tags:** Small pill/badge style, muted colour
- **No dark mode** for v1 — keep it simple

---

## 12. QR Code Strategy

- Each machine has a fixed, permanent URL
- URL format: `https://<domain>/machine/<id>`
- QR codes generated client-side using `qrcode.react`
- Gym operator visits `/admin/qr-codes`, prints, laminates, and attaches to machines
- No QR code tracking or scan analytics in v1

---

## 13. Out of Scope (v1)

- User accounts or login
- Favourites or progress tracking
- Video hosting (use external GIF/video URLs or `/public` folder)
- Native mobile app
- Backend / database
- Analytics
- Dark mode
- More than 5 machines at launch
- Full combined 3D scene (human + machine in one model)
