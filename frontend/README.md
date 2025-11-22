# 🤖 ACCSTORAGE AI Chat Application

Modern AI-powered chat application with Firebase backend and N8N integration.

## ✨ Features

- 💬 Real-time AI chat with N8N webhook integration
- 🔥 Firebase Firestore for chat history
- 📱 Fully responsive design (Mobile/Tablet/Desktop)
- 🎨 Modern UI with Tailwind CSS
- 🔗 Auto-linkify URLs in messages
- 📊 Admin dashboard with analytics
- 🔐 Protected admin routes
- 💾 Session management
- 📤 Export chat functionality
- ⚡ Lightning fast with Vite

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- Firebase account
- N8N webhook endpoint

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/chat-blogger
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Create production build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🔧 Vercel Deployment

### Option 1: Via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (if not at root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   Go to Settings → Environment Variables and add:
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_DATABASE_URL
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID
   VITE_N8N_WEBHOOK_URL
   ```

5. **Deploy:** Click "Deploy"

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatMessage.jsx  # Message rendering with auto-link
│   │   ├── Header.jsx       # App header
│   │   ├── Sidebar.jsx      # Session sidebar
│   │   └── TypingIndicator.jsx
│   ├── contexts/            # React Context
│   │   └── AuthContext.jsx  # Authentication
│   ├── pages/               # Route pages
│   │   ├── AdminDashboard.jsx
│   │   └── AdminLogin.jsx
│   ├── utils/               # Helper functions
│   │   └── userSession.js
│   ├── App.jsx              # Main chat component
│   ├── AppRouter.jsx        # Routing logic
│   ├── firebase.js          # Firebase config
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── .env                     # Environment variables (gitignored)
├── .env.example             # Template for env vars
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind CSS config
```

## 🎨 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Routing:** React Router 6
- **Backend:** Firebase Firestore
- **AI Integration:** N8N Webhook
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts
- **Markdown:** React Markdown
- **Date:** date-fns

## 🔐 Admin Access

Default admin credentials:
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change these in production! Edit `src/contexts/AuthContext.jsx`

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Protected admin routes
- ✅ Firebase security rules configured
- ✅ External links open with `rel="noopener noreferrer"`
- ✅ Input sanitization via React

## 📊 Features

### User Features
- Real-time AI chat
- Session management (New/Switch/History)
- Auto-save to Firebase
- Message history per user
- Export chat functionality
- Suggested quick replies
- **Auto-clickable links** ✨
- Responsive design
- Dark mode theme
- Typing indicator
- Markdown support

### Admin Features
- Protected routes
- Real-time dashboard
- User grouping
- Message search & filter
- Date range filtering
- Analytics charts
- CSV export
- Session tracking

## 🐛 Troubleshooting

### Build fails on Vercel

**Issue:** Environment variables not set
**Solution:** Add all `VITE_*` variables in Vercel Settings → Environment Variables

### Firebase error: "Firebase App named '[DEFAULT]' already exists"

**Issue:** Multiple Firebase initializations
**Solution:** Clear browser cache and reload

### N8N webhook not responding

**Issue:** Webhook URL incorrect or CORS
**Solution:** Check `VITE_N8N_WEBHOOK_URL` and enable CORS in N8N

### Admin panel shows "No data"

**Issue:** Real-time listener not working
**Solution:** Check Firebase Firestore rules and internet connection

## 📝 Environment Variables

All environment variables must be prefixed with `VITE_` for Vite to expose them to the client.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | Firebase Database URL | `https://project.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `my-project-123` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123:web:abc` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics ID | `G-XXXXXXXXXX` |
| `VITE_N8N_WEBHOOK_URL` | N8N Webhook Endpoint | `https://n8n.app/webhook/chat` |

## 🚀 Performance

- ⚡ Optimized React renders with `useMemo`
- 🔄 Efficient Firebase queries with pagination
- 📦 Code splitting via React Router
- 🗜️ Optimized bundle size (tree-shaking)
- 💾 Local session management

## 📄 License

Private - All rights reserved

## 👨‍💻 Support

For issues or questions, contact the development team.

---

**Made with ❤️ using React + Vite + Firebase**
