# ClickCart Finds - Product Discovery Website

This project is a high-performance, SEO-optimized product discovery website that syncs automatically with a Google Sheet.

## 🚀 How to Deploy to Vercel

### Step 1: Export to GitHub
Since you are using **Google AI Studio Build**, the code needs to be sent to GitHub first:
1. Look at the **top right corner** of this screen.
2. Click on the **Settings (Gear icon)** or the **Three Dots (⋮) Menu**.
3. Select **"Export to GitHub"**.
4. Authenticate with your GitHub account and create a new repository.

### Step 2: Deploy to Vercel
1. Log in to [Vercel.com](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import the repository you just created in Step 1.
4. **Project Settings**:
   - Framework Preset: **Vite** (Detected automatically)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **"Deploy"**.

## 📊 How to Update Data
Your website is connected to your Google Sheet:
- **Sheet Link**: [Google Sheet](https://docs.google.com/spreadsheets/d/1RibaK4uT12Aj_VFwKVY2_PP4ASd6p7CYxF8r2SfVZJFMHR_-RzfFv1jbafw9-5PQTID7xlfvWyhvqS/edit)
- Every time you add or edit a row in the Sheet, the website will update its data automatically within a few minutes.
- You can also click the **Sync (🔄)** button in the website header to force an immediate update.

## 🛠 Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Parsing**: PapaParse (CSV)
- **Deployment**: Vercel ready (`vercel.json` included)

---
*Created for future growth as a Multi-Platform Discovery Site.*
