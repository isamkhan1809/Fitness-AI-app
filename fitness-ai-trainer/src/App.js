import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Challenges from './pages/Challenges';

import './App.css';

function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const initials = user?.email ? user.email[0].toUpperCase() : '?';
  const shortEmail = user?.email?.split('@')[0];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-fit">Fit</span>
        <span className="brand-ai">AI</span>
      </Link>

      <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
        {user ? (
          <>
            <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
            <li><NavLink to="/challenges" onClick={() => setMenuOpen(false)}>Challenges</NavLink></li>
            <li><NavLink to="/progress" onClick={() => setMenuOpen(false)}>Progress</NavLink></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink></li>
            <li><NavLink to="/register" onClick={() => setMenuOpen(false)}>Register</NavLink></li>
          </>
        )}
      </ul>

      <div className="navbar-right">
        {user && (
          <>
            <div className="user-badge">
              <div className="user-avatar">{initials}</div>
              <span>{shortEmail}</span>
            </div>
            <button className="btn-logout-nav" onClick={handleLogout}>Logout</button>
          </>
        )}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u || null));
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
        <Navbar user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2025 <span>FitAI</span> — Powered by Artificial Intelligence</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
