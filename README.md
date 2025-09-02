# 📐 Shelf Spacing Calculator (Offline PWA)

This is a simple **Progressive Web App (PWA)** that calculates even shelf spacing for cabinetry or furniture making.  
It works **offline** once installed on your iPhone/iPad or desktop.

---

## 🚀 How to Use

1. **Download & Unzip**
   - Unzip this project (contains `index.html`, `app.js`, `style.css`, icons, etc.).

2. **Upload to GitHub**
   - Create a new **public** repository on GitHub (e.g., `shelf-spacing`).
   - Upload all files from this project, including `.nojekyll`.

3. **Enable GitHub Pages**
   - Go to your repo → **Settings** → **Pages**.
   - Under *Build and deployment*, set Source to **Deploy from a branch**.
   - Choose branch: **main**, folder: **/** (root).
   - Click **Save**.
   - After ~1 minute, your app will be live at:  
     `https://<username>.github.io/<repo-name>/`

4. **Install on iPhone/iPad**
   - Open the URL in **Safari**.
   - Tap **Share → Add to Home Screen**.
   - Open from your home screen. It will now work **offline**.

---

## ⚙️ Features

- Calculates equal spacing for “middle shelves only” (no shelf at top/bottom).  
- Outputs:
  - Equal gap size (top, bottom, between shelves).
  - Each shelf’s **bottom position** and **centre line**.  
- Supports **mm or inches**.  
- Generates a **drilling template PNG** for marking out holes.  
- Works fully **offline** (PWA with service worker).

---

## 🛠 Files Included

- `index.html` → main app page  
- `app.js` → calculation + template generator  
- `style.css` → styling  
- `manifest.webmanifest` → PWA config  
- `sw.js` → service worker for offline use  
- `icon192.png`, `icon512.png` → app icons  
- `.nojekyll` → prevents GitHub Pages from altering files  

---

✅ Free to host on GitHub Pages.  
📱 Installable on iPhone, iPad, or desktop for offline use.  
