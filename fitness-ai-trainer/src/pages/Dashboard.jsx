import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPlans, setTotalPlans] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      try {
        const plansSnap = await getDocs(collection(db, 'users', user.uid, 'workoutPlans'));
        setTotalPlans(plansSnap.size);
        const completedSnap = await getDocs(collection(db, 'users', user.uid, 'completedWorkouts'));
        setCompletedCount(completedSnap.size);
      } catch {
        // non-critical
      }
    };
    fetchCounts();
  }, [user]);

  const generateWorkoutPlan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, duration, intensity }),
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      if (data.plan) {
        setWorkoutPlan(data.plan);
        setTotalPlans((prev) => prev + 1);
        if (user) {
          await setDoc(doc(db, 'users', user.uid, 'workoutPlans', new Date().toISOString()), {
            plan: data.plan,
            timestamp: new Date(),
          });
        }
        toast.success('Workout plan generated successfully!');
      } else {
        toast.error('Failed to generate a workout plan. Please try again.');
      }
    } catch {
      toast.error('Could not reach the AI server. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = user?.email?.split('@')[0];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <p className="dashboard-greeting">Dashboard</p>
        <h1 className="dashboard-title">
          Welcome back, <span>{displayName}</span> 👋
        </h1>
      </div>

      {/* Quick stats */}
      <div className="quick-stats">
        <div className="stat-mini">
          <div className="stat-mini-value">{totalPlans}</div>
          <div className="stat-mini-label">Plans Generated</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-value">{completedCount}</div>
          <div className="stat-mini-label">Workouts Completed</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Form card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">🤖</div>
            <div>
              <div className="card-title">Generate AI Plan</div>
              <div className="card-subtitle">Customise and generate your workout</div>
            </div>
          </div>

          <form className="generate-form" onSubmit={generateWorkoutPlan}>
            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select
                className="form-input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              >
                <option value="">Select your goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Cardio">Cardio</option>
                <option value="Strength Training">Strength Training</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sessions per week</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 3"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                min="1"
                max="7"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Intensity Level</label>
              <select
                className="form-input"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                required
              >
                <option value="">Select intensity</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Generating…
                </>
              ) : '⚡ Generate Plan'}
            </button>
          </form>
        </div>

        {/* Output card */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>📋</div>
            <div>
              <div className="card-title">Your Workout Plan</div>
              <div className="card-subtitle">AI-generated and ready to go</div>
            </div>
          </div>

          {isLoading && (
            <div className="loading-indicator">
              <span className="spinner" />
              AI is building your personalised plan…
            </div>
          )}

          {!isLoading && !workoutPlan && (
            <div className="empty-state">
              <div className="empty-icon">🏋️</div>
              <p>Fill in the form and hit <strong>Generate Plan</strong> to get your personalised AI workout.</p>
            </div>
          )}

          {workoutPlan && !isLoading && (
            <div className="workout-plan-output">
              <h4>Your Plan</h4>
              <p>{workoutPlan}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
