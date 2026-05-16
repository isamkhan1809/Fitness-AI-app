# 🏋️ Fitness AI App

A full-stack AI-powered fitness application that generates **personalised workout plans** using a fine-tuned GPT-2 language model. Built with React on the frontend, Flask on the backend, and Firebase for authentication and data storage.

---

## 🚀 Live Features

- 🤖 **AI Workout Generation** — Fine-tuned GPT-2 model generates personalised plans based on user input (runs locally via Flask)
- 🔐 **User Authentication** — Secure login and registration via Firebase Auth
- 📊 **Progress Tracking** — Completed workouts and challenges stored in Firebase Firestore
- 🏆 **Challenges System** — Users can take on fitness challenges tracked in real time
- 📈 **Data Visualisation** — Workout history and stats rendered with React Google Charts
- 🔔 **Toast Notifications** — Smooth UX feedback with React Toastify
- 📱 **Responsive Design** — Flexbox/Grid layout with custom CSS animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI component framework |
| React Router DOM v7 | Client-side routing |
| React Hook Form | Form state management |
| React Google Charts | Data visualisation |
| React Toastify | Toast notifications |
| React Icons | Icon components |
| Axios | HTTP requests to Flask API |
| CSS3 | Custom properties, animations, flexbox/grid |
| Google Fonts (Inter) | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Python 3 / Flask | REST API server (localhost:5000) |
| Flask-CORS | Cross-origin request handling |
| HuggingFace Transformers | GPT-2 model loading & inference |
| PyTorch | ML model engine |
| Pandas | Workout data handling (CSV) |

### Services & Data
| Service | Purpose |
|---|---|
| Firebase Authentication | User login, registration, sessions |
| Firebase Firestore | Stores profiles, plans, workouts, challenges |
| GPT-2 (fine-tuned) | AI workout plan generation |
| workout_data.csv | Training/reference data for the ML model |

### ML Details
- **Model:** GPT-2 fine-tuned on workout data
- **Generation strategy:** Beam search + nucleus sampling (5 beams, temp 0.7, top-p 0.9)
- **Tokenizer:** GPT2Tokenizer via HuggingFace

---

## 📁 Project Structure

```
Fitness-AI-app/
├── public/
│   └── index.html          # App shell
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Route-level pages
│   ├── firebase.js         # Firebase config
│   └── App.js              # Root component + routing
├── backend/
│   ├── app.py              # Flask server + API routes
│   ├── workout_data.csv    # ML training/reference data
│   └── model/              # Fine-tuned GPT-2 model files
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- A Firebase project (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/isamkhan1809/Fitness-AI-app.git
cd Fitness-AI-app
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Set up Firebase
Create a `.env` file in the root with your Firebase config:
```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

### 4. Install backend dependencies
```bash
cd backend
pip install flask flask-cors transformers torch pandas
```

### 5. Run the Flask backend
```bash
python app.py
# Runs on http://localhost:5000
```

### 6. Run the React frontend
```bash
# From the root directory
npm start
# Runs on http://localhost:3000
```

---

## 🧠 How the AI Works

1. The user fills in their fitness goals, experience level, and available equipment
2. The React frontend sends a POST request to the Flask API
3. Flask feeds the input into a **fine-tuned GPT-2 model** using HuggingFace Transformers
4. The model generates a structured workout plan using beam search + nucleus sampling
5. The plan is returned to the frontend and saved to Firestore

---

## 🔮 Future Plans

- [ ] Swap GPT-2 for OpenAI API for improved generation quality
- [ ] Add nutrition/meal plan generation
- [ ] Mobile app version (React Native)
- [ ] Social features — share workouts with friends

---

## 👤 Author

**Isam Khan**  
[GitHub](https://github.com/isamkhan1809)
