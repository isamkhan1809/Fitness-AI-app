import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, addDoc, collection } from '../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pw) => {
    const valid = pw.length >= 8;
    setIsPasswordValid(valid);
    if (pw.length === 0) {
      setPasswordMessage('');
    } else if (valid) {
      setPasswordMessage('Password meets the criteria!');
    } else {
      setPasswordMessage('Must be at least 8 characters.');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please ensure your password meets the criteria.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email,
        age,
        weight,
        height,
        fitnessGoal,
        experienceLevel,
      });
      navigate('/dashboard');
    } catch {
      setError('Failed to create account. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="auth-icon">🏋️</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Start your personalised fitness journey today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
            />
            {passwordMessage && (
              <span className={`password-hint ${isPasswordValid ? 'valid' : 'invalid'}`}>
                {isPasswordValid ? '✓ ' : '✗ '}{passwordMessage}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="10"
                max="100"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select
                className="form-input"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                required
              >
                <option value="">Select goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="cardio">Cardio</option>
                <option value="strength_training">Strength Training</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience</label>
              <select
                className="form-input"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                required
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!isPasswordValid || loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creating account…
              </>
            ) : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')}>Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
