# Ifrah Naeem — Interactive 3D Game Developer Portfolio

A full-stack interactive 3D portfolio featuring a custom Blender character model rendered in Three.js, an AI-powered RAG Portfolio Assistant (FastAPI + Gemini), inline gameplay video previews, and a validated SMTP email contact system.

* **Live Portfolio URL:** `https://YOUR_LIVE_URL.onrender.com` *(update after Render deployment)*
* **GitHub Repository:** `https://github.com/YOUR_USERNAME/ifrah-portfolio` *(update with your repo link)*

---

## Screenshots

| Hero & 3D Blender Avatar | Projects & Gameplay Preview |
| :---: | :---: |
| ![Hero Section](screenshots/hero.png) | ![Projects Modal](screenshots/projects.png) |

| RAG AI Portfolio Assistant | Contact Form & Theme Toggle |
| :---: | :---: |
| ![RAG Chatbot](screenshots/chatbot.png) | ![Contact Form](screenshots/contact.png) |

---

## Project Structure

```text
├── index.html                    # Main page layout, modal & chatbot markup
├── styles.css                    # Frosted Light Mode & Dark Mode themes, responsive layout
├── js/
│   ├── data.js                   # Portfolio content, project descriptions, video & build links
│   ├── main.js                   # Three.js 3D scene, avatar controls, modals & contact form
│   └── chatbot.js                # Frontend widget for the FastAPI RAG chatbot
├── assets/
│   ├── models/
│   │   ├── BossEnemy.blend       # Original Blender source file
│   │   └── BossEnemy.glb         # Exported glTF 2.0 3D avatar model
│   └── video/
│       ├── seeds.mp4             # Gameplay preview: The Seeds (Unreal Engine)
│       ├── masketeer.mp4         # Gameplay preview: Masketeer (GGJ 48h)
│       └── crimson.mp4           # Gameplay preview: Crimson Bastion (Unity)
├── server/
│   └── server.js                 # Node.js + Express server (static hosting & /api/contact)
├── api.py                        # FastAPI server exposing the /chat endpoint
├── main.py                       # RAG retrieval & Gemini response synthesis logic
├── knowledge/
│   └── knowledge.md              # Structured knowledge base (CV, games, skills, education)
├── screenshots/                  # Screenshots demonstrating major modules
├── package.json                  # Node.js dependencies
└── requirements.txt              # Python FastAPI & Google GenAI dependencies