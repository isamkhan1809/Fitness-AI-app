<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,18,24&height=200&section=header&text=Fitness+AI&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=35&desc=AI-Powered%20Workout%20Plans%20%E2%80%94%20Trained%20on%20You%2C%20Built%20for%20You&descAlignY=60&descSize=20" width="100%"/>

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0D0D0D)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-API-FF6B35?style=for-the-badge&logo=flask&logoColor=white&labelColor=0D0D0D)](https://flask.palletsprojects.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black&labelColor=0D0D0D)](https://firebase.google.com)
[![GPT-2](https://img.shields.io/badge/GPT--2-Fine--Tuned-7B2FBE?style=for-the-badge&logo=openai&logoColor=white&labelColor=0D0D0D)](https://huggingface.co)
[![License](https://img.shields.io/badge/License-MIT-00C851?style=for-the-badge&labelColor=0D0D0D)](LICENSE)

<br/>

<a href="https://github.com/isamkhan1809/Fitness-AI-app">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=22&pause=1000&color=FF6B35&center=true&vCenter=true&width=750&lines=Generate+Personalized+Workout+Plans+with+AI;Track+Progress.+Log+Workouts.+Crush+Challenges.;Fine-Tuned+GPT-2+%E2%80%94+Running+100%25+Locally;React+%2B+Flask+%2B+Firebase+%2B+PyTorch" alt="Typing SVG" />
</a>

</div>

---

<br/>

<div align="center">

```
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║   Most fitness apps give everyone the same plan.             ║
  ║   Fitness AI reads your goals and builds yours from          ║
  ║   scratch — powered by a locally-running GPT-2 model.        ║
  ║                                                              ║
  ║       Your data. Your goals. Your plan.                      ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
```

</div>

<br/>

## `>_ The Story`

> *Most fitness apps hand you a generic 12-week program and call it personalization.*
>
> *Fitness AI is different. A fine-tuned GPT-2 model runs locally on your machine, ingests your fitness profile — goals, intensity, experience — and generates a workout plan built entirely around you.*
>
> *No subscriptions. No third-party AI APIs. Just your data, a local model, and real results.*

<br/>

## `>_ What It Does`

<table>
<tr>
<td width="50%">

**Tell it your goals:**
```
goal:      muscle_gain
intensity: high
frequency: 4x per week
level:     intermediate
```

</td>
<td width="50%">

**Get a plan built for you:**
```
Day 1 — Chest & Triceps
  Bench Press      4×8
  Incline DB Press 3×10
  Cable Flyes      3×12
  Tricep Dips      3×Failure
```

</td>
</tr>
</table>

<br/>

## `>_ The Pipeline`

```
┌──────────────────────────────────────────────────────────────────┐
│                      FITNESS AI ENGINE                           │
│                                                                  │
│  ┌──────────────┐     ┌───────────────┐     ┌────────────────┐   │
│  │ User Profile │────▶│  React Form   │────▶│  Flask /gen-   │   │
│  │ (Firestore)  │     │  goal+inten-  │     │  erate API     │   │
│  │              │     │  sity+freq    │     │                │   │
│  └──────────────┘     └───────────────┘     └───────┬────────┘   │
│                                                     │            │
│                                       ┌─────────────▼──────┐     │
│                                       │  Fine-Tuned GPT-2  │     │
│                                       │  HuggingFace +     │     │
│                                       │  PyTorch (local)   │     │
│                                       └─────────────┬──────┘     │
│                                                     │            │
│                                       ┌─────────────▼──────┐     │
│                                       │  Validation Layer  │     │
│                                       │  Keyword check +   │     │
│                                       │  Fallback plans    │     │
│                                       └─────────────┬──────┘     │ 
│                                                     │            │
│                                       ┌─────────────▼──────┐     │
│                                       │  Firestore Storage │     │
│                                       │  Plans · Workouts  │     │
│                                       │  Challenges · Stats│     │
│                                       └────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

<br/>

## `>_ Features`

| Feature | Description |
|---|---|
| **AI Plan Generation** | Fine-tuned GPT-2 produces unique plans based on goal, intensity, and frequency |
| **Progress Tracking** | Log completed workouts, view stats, and monitor your streak |
| **Challenges System** | 40+ goal-specific fitness challenges with completion rewards |
| **Data Visualization** | React Google Charts dashboard for workout history and analytics |
| **Firebase Auth** | Secure email/password login with full user profile management |
| **Motivational Engine** | Dynamic reminders every 30 seconds when you have outstanding workouts |
| **Responsive UI** | Mobile-first dark theme with animations, gradients, and hamburger nav |

<br/>

## `>_ Get Running`

```bash
# 1. Clone the repo
git clone https://github.com/isamkhan1809/Fitness-AI-app.git
cd Fitness-AI-app/fitness-ai-trainer

# 2. Install frontend dependencies
npm install

# 3. Install Python backend dependencies
cd ml-api
pip install -r requirements.txt

# 4. Start the Flask ML server
python app.py
# Running on http://localhost:5000

# 5. In a new terminal, start the React app
cd ..
npm start
# Running on http://localhost:3000
```

> **Note:** The fine-tuned GPT-2 model must be present at `ml-model/fine-tuned-model/`. The model weights are excluded from this repo due to size — see setup docs for download instructions.

<br/>

## `>_ Tech Stack`

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, React Hook Form |
| **Styling** | CSS3 (custom properties, animations, dark theme) |
| **Charts** | React Google Charts |
| **HTTP Client** | Axios |
| **Backend** | Python 3 + Flask + Flask-CORS |
| **ML Model** | GPT-2 fine-tuned via HuggingFace Transformers |
| **ML Engine** | PyTorch (local inference, no external API) |
| **Auth & DB** | Firebase Authentication + Firestore |
| **Notifications** | React Toastify |

</div>

<br/>

## `>_ Project Structure`

```
Fitness-AI-app/
├── fitness-ai-trainer/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page & feature showcase
│   │   │   ├── Dashboard.jsx     # AI plan generation + quick stats
│   │   │   ├── Progress.jsx      # Workout logging + analytics
│   │   │   ├── Challenges.jsx    # Goal-based challenge tracker
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.js                # Root component + routing + navbar
│   │   ├── firebase.js           # Firebase config & exports
│   │   └── App.css               # Global styles & animations
│   ├── ml-api/
│   │   ├── app.py                # Flask server — /generate endpoint
│   │   └── requirements.txt
│   └── ml-model/
│       ├── fine-tuned-model/     # GPT-2 weights (not in repo)
│       └── workout_data.csv      # Training reference data
└── package.json
```

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,18,24&height=120&section=footer&animation=twinkling" width="100%"/>

<br/>

*Your goals are personal. Your workout plan should be too.*
*Local AI. Real progress. No paywalls.*

<br/>

[![GitHub](https://img.shields.io/badge/github-isamkhan1809-FF6B35?style=for-the-badge&logo=github&logoColor=white&labelColor=0D0D0D)](https://github.com/isamkhan1809)

</div>
