import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span>⚡</span> AI-Powered Fitness
            </div>
            <h1 className="hero-title">
              Your Personal{' '}
              <span className="gradient-text">AI Trainer</span>{' '}
              is Here
            </h1>
            <p className="hero-subtitle">
              Generate personalised workout plans in seconds. Track your progress,
              complete challenges, and unlock rewards — all tailored to your goals
              by advanced AI.
            </p>
            <div className="hero-cta-group">
              <Link to="/register" className="btn-primary">
                Get Started Free →
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-number">AI</div>
                <div className="hero-stat-label">Generated Plans</div>
              </div>
              <div>
                <div className="hero-stat-number">4+</div>
                <div className="hero-stat-label">Fitness Goals</div>
              </div>
              <div>
                <div className="hero-stat-number">40+</div>
                <div className="hero-stat-label">Challenges</div>
              </div>
            </div>
          </div>

          {/* Decorative visual cards */}
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-label">AI Plan Status</div>
              <div className="hero-card-value">
                <span className="dot" />
                Generating Plan…
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: '72%' }} />
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-label">Weekly Goal</div>
              <div className="hero-card-value">💪 Muscle Gain — Day 4/5</div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-label">Challenge Streak</div>
              <div className="hero-card-value">🏅 3 Challenges Completed</div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: '60%', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-header">
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Features</span>
          <h2 className="section-title">Everything you need to <span className="gradient-text">crush your goals</span></h2>
          <p>Built with the latest AI technology to give you a truly personalised fitness experience.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">🤖</div>
            <h3 className="feature-title">AI Workout Plans</h3>
            <p className="feature-desc">Tell us your goal and intensity — our AI generates a fully personalised workout plan tailored just for you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon cyan">📊</div>
            <h3 className="feature-title">Progress Tracking</h3>
            <p className="feature-desc">Log completed workouts and watch your progress grow. Visual stats keep you motivated every step of the way.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">🏆</div>
            <h3 className="feature-title">Challenges & Rewards</h3>
            <p className="feature-desc">Take on daily challenges matched to your fitness goal. Earn medals and rewards as you hit new milestones.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple">🔒</div>
            <h3 className="feature-title">Secure Accounts</h3>
            <p className="feature-desc">Your data is stored securely using Firebase — plans and progress are saved and synced across sessions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon orange">⚡</div>
            <h3 className="feature-title">Instant Generation</h3>
            <p className="feature-desc">No waiting around. Plans are generated in real-time so you can get straight to training.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">🎯</div>
            <h3 className="feature-title">Goal-Based Training</h3>
            <p className="feature-desc">Weight Loss, Muscle Gain, Cardio, or Strength — every plan is built around your specific objective.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <span className="badge badge-green" style={{ marginBottom: '1rem' }}>How it works</span>
          <h2 className="section-title">Up and running in <span className="gradient-text">3 steps</span></h2>
        </div>
        <div className="how-grid">
          <div className="how-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create your account</h3>
            <p className="step-desc">Sign up with your email and tell us about your fitness background — age, weight, height, and experience level.</p>
          </div>
          <div className="how-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Generate your plan</h3>
            <p className="step-desc">Choose your fitness goal and workout intensity. Our AI will instantly build a customised plan for you.</p>
          </div>
          <div className="how-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Track & earn rewards</h3>
            <p className="step-desc">Log your workouts, take on challenges, and earn medals as you progress toward your goals.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
