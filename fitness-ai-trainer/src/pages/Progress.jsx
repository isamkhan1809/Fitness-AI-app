import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../App.css';

function Progress() {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [rewardsEarned, setRewardsEarned] = useState(0);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [lastLoggedTime, setLastLoggedTime] = useState(null);
  const navigate = useNavigate();

  const motivationalMessages = [
    "You've got this! Keep pushing forward! 💪",
    "Every workout brings you closer to your goals! 🚀",
    "Stay consistent — you're doing amazing! 🌟",
    "One more workout, one step closer to success! 🏋️",
    "Don't stop now — your hard work is paying off! 🔥",
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    if (!user) return;

    const workoutPlansSnap = await getDocs(collection(db, 'users', user.uid, 'workoutPlans'));
    const plans = workoutPlansSnap.docs.map((d) => ({ id: d.id, plan: d.data().plan, timestamp: d.data().timestamp }));
    setWorkouts(plans);

    const completedSnap = await getDocs(collection(db, 'users', user.uid, 'completedWorkouts'));
    const completedIds = completedSnap.docs.map((d) => d.data().workoutId);
    setCompletedWorkouts(completedIds);

    const challengesSnap = await getDocs(collection(db, 'users', user.uid, 'challenges'));
    const done = challengesSnap.docs.filter((d) => d.data().completed);
    setCompletedChallenges(done.length);
    setRewardsEarned(done.filter((d) => d.data().reward).length);

    setMotivationalMessage(completedIds.length, plans.length);

    const remaining = plans.length - completedIds.length;
    if (remaining > 0) {
      toast.info(`You have ${remaining} workout${remaining === 1 ? '' : 's'} left to log!`, { autoClose: 4000 });
    } else if (plans.length > 0) {
      toast.success('All workouts completed! Generate more on the Dashboard! 🎉', { autoClose: 4000 });
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const remaining = workouts.length - completedWorkouts.length;
      if (remaining > 0) {
        const timeSinceLast = lastLoggedTime ? (Date.now() - lastLoggedTime) / 1000 : Infinity;
        if (timeSinceLast >= 30) {
          const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
          toast.info(`${remaining} workout${remaining === 1 ? '' : 's'} remaining! ${msg}`, { autoClose: 5000 });
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user, workouts, completedWorkouts, lastLoggedTime]);

  const setMotivationalMessage = (completedCount, total) => {
    if (total === 0) {
      setMessage('No workouts yet — head to the Dashboard to generate your first plan!');
    } else if (completedCount === 0) {
      setMessage("Log your first workout today and kick off your progress!");
    } else if (completedCount === total) {
      setMessage("You've completed all your workouts! Time to generate more challenges!");
    } else {
      setMessage(`Great work! ${completedCount} of ${total} workouts done — keep it up!`);
    }
  };

  const handleLogWorkout = async (workoutId, plan) => {
    if (!user || completedWorkouts.includes(workoutId)) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'completedWorkouts', workoutId), {
        workoutId,
        plan,
        timestamp: new Date().toISOString(),
        completed: true,
      });
      setCompletedWorkouts((prev) => [...prev, workoutId]);
      setLastLoggedTime(Date.now());
      toast.success('Workout logged! Great work! 💪');
      await fetchData();
    } catch {
      toast.error('Failed to log workout. Please try again.');
    }
  };

  if (!user) return <div className="progress-page"><p style={{ color: 'var(--text-muted)' }}>Redirecting…</p></div>;

  const progressPercent = workouts.length > 0 ? Math.round((completedWorkouts.length / workouts.length) * 100) : 0;

  return (
    <div className="progress-page">
      <div className="dashboard-header">
        <p className="dashboard-greeting">Progress</p>
        <h1 className="dashboard-title">
          Your <span className="gradient-text">Fitness Journey</span>
        </h1>
      </div>

      {/* Stats row */}
      <div className="progress-stats-row">
        <div className="stat-card">
          <div className="stat-card-icon">🏋️</div>
          <div className="stat-card-value">{completedWorkouts.length}</div>
          <div className="stat-card-label">Workouts Logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🏆</div>
          <div className="stat-card-value">{completedChallenges}</div>
          <div className="stat-card-label">Challenges Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🥇</div>
          <div className="stat-card-value">{rewardsEarned}</div>
          <div className="stat-card-label">Rewards Earned</div>
        </div>
      </div>

      {/* Motivational banner */}
      <div className="motivational-banner">
        <span className="emoji">💬</span>
        <p>{message}</p>
      </div>

      {/* Overall progress bar */}
      {workouts.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Overall Progress</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--accent-blue)', fontWeight: 700 }}>{progressPercent}%</span>
          </div>
          <div className="progress-bar-track" style={{ height: '10px' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%`, transition: 'width 0.6s ease' }}
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {completedWorkouts.length} of {workouts.length} workouts completed
          </p>
        </div>
      )}

      {/* Workouts list */}
      <div className="workouts-card">
        <div className="card-header">
          <div className="card-icon">📋</div>
          <div>
            <div className="card-title">Your Workouts</div>
            <div className="card-subtitle">{workouts.length} plan{workouts.length !== 1 ? 's' : ''} generated</div>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏃</div>
            <p>No workouts yet. Head to the Dashboard to generate your first AI plan!</p>
          </div>
        ) : (
          <ul className="workouts-list">
            {workouts.map((workout) => {
              const done = completedWorkouts.includes(workout.id);
              return (
                <li key={workout.id} className={`workout-row${done ? ' completed' : ''}`}>
                  <span className="workout-text">{workout.plan}</span>
                  {done ? (
                    <FaCheckCircle className="check-icon" size={20} />
                  ) : (
                    <button
                      className="btn-green"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                      onClick={() => handleLogWorkout(workout.id, workout.plan)}
                    >
                      Mark Done
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Progress;
