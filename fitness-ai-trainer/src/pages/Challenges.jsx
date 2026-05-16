import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const GOALS = ['Cardio', 'Muscle Gain', 'Weight Loss', 'Strength Training'];

const GOAL_ICONS = {
  'Cardio': '🏃',
  'Muscle Gain': '💪',
  'Weight Loss': '⚡',
  'Strength Training': '🏋️',
};

const challenges = {
  'Cardio': [
    'Run 5 kilometres in under 30 minutes',
    'Complete 100 jumping jacks in one session',
    'Cycle 20 kilometres this week',
    'Perform a 20-minute HIIT cardio workout',
    'Jump rope for 10 minutes without stopping',
    'Run 10 flights of stairs 5 times',
    'Complete a 3-mile power walk in under 45 minutes',
    'Do 50 burpees in one session',
    'Swim 500 metres without stopping',
    'Dance for 30 minutes straight',
  ],
  'Muscle Gain': [
    'Perform 50 push-ups in one session',
    'Deadlift your body weight 10 times',
    'Complete 3 sets of 15 bicep curls with heavy weights',
    'Do 20 pull-ups in one session',
    'Bench press your body weight 8 times',
    'Perform 3 sets of 12 squats with added weight',
    'Complete 25 dips without stopping',
    'Do a plank with a 20-pound weight for 2 minutes',
    'Perform 15 shoulder presses with heavy dumbbells',
    'Complete 3 sets of 10 lat pulldowns with your max weight',
  ],
  'Weight Loss': [
    'Walk 10,000 steps in one day',
    'Burn 500 calories in a single workout',
    'Complete a 30-minute bodyweight circuit',
    'Do 100 mountain climbers in one session',
    'Hold a plank for 3 minutes straight',
    'Complete 20 minutes of high-intensity cardio',
    'Perform 3 sets of 20 kettlebell swings',
    'Skip rope for 15 minutes without stopping',
    'Finish a 45-minute yoga flow session',
    'Burn 300 calories with a dance workout',
  ],
  'Strength Training': [
    'Squat your body weight 12 times',
    'Complete 3 sets of 10 deadlifts with heavy weights',
    'Perform 15 bench presses with your max weight',
    'Do 20 kettlebell snatches in one session',
    'Complete 3 sets of 12 barbell rows',
    'Hold a wall sit with added weight for 90 seconds',
    'Perform 10 overhead presses with heavy dumbbells',
    'Do 3 sets of 8 pull-ups with added resistance',
    'Complete 15 lunges per leg with dumbbells',
    'Finish 3 sets of 10 power cleans with your max weight',
  ],
};

function Challenges() {
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  const generateRandomChallenge = (goal) => {
    const list = challenges[goal];
    setChallenge(list[Math.floor(Math.random() * list.length)]);
    setCompleted(false);
  };

  const handleGoalSelect = (goal) => {
    setFitnessGoal(goal);
    generateRandomChallenge(goal);
  };

  const handleCompleteChallenge = async () => {
    if (!user || !challenge) return;
    const challengeId = `${fitnessGoal}-${new Date().toISOString()}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'challenges', challengeId), {
        challenge,
        fitnessGoal,
        completed: true,
        timestamp: new Date().toISOString(),
        reward: 'Gold Medal',
      });
      setCompleted(true);
    } catch {
      // silently fail
    }
  };

  if (!user) return <div className="challenges-page"><p style={{ color: 'var(--text-muted)' }}>Redirecting…</p></div>;

  return (
    <div className="challenges-page">
      <div className="challenges-header-section">
        <div className="dashboard-greeting">Challenges</div>
        <h1 className="dashboard-title">
          Take on a <span className="gradient-text">Challenge</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Pick a fitness goal below to get a randomised challenge. Complete it to earn a reward!
        </p>

        <div className="goal-pills">
          {GOALS.map((g) => (
            <button
              key={g}
              className={`goal-pill${fitnessGoal === g ? ' active' : ''}`}
              onClick={() => handleGoalSelect(g)}
            >
              {GOAL_ICONS[g]} {g}
            </button>
          ))}
        </div>
      </div>

      {!fitnessGoal && (
        <div className="no-challenge-prompt">
          <div className="prompt-icon">🎯</div>
          <p>Select a fitness goal above to receive your personalised challenge.</p>
        </div>
      )}

      {fitnessGoal && challenge && (
        <div className="challenge-card">
          <div className="challenge-badge">
            {GOAL_ICONS[fitnessGoal]} {fitnessGoal}
          </div>

          {completed ? (
            <>
              <div className="reward-display">
                <span className="medal">🏅</span>
                <p>Challenge complete! You've earned a Gold Medal!</p>
              </div>
              <div className="challenge-actions">
                <button className="btn-primary" onClick={() => generateRandomChallenge(fitnessGoal)}>
                  Next Challenge →
                </button>
                <button className="btn-secondary" onClick={() => { setFitnessGoal(''); setChallenge(null); }}>
                  Change Goal
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="challenge-text">{challenge}</p>
              <div className="challenge-actions">
                <button className="btn-green" onClick={handleCompleteChallenge}>
                  ✓ Mark as Completed
                </button>
                <button className="btn-secondary" onClick={() => generateRandomChallenge(fitnessGoal)}>
                  Skip Challenge
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Challenges;
