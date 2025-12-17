import React from 'react';
import { BrowserRouter as Router, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navLinkClass = ({ isActive }) =>
  `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-white text-primary fw-semibold shadow-sm' : 'text-white-50'}`;

const logoSrc = `${process.env.PUBLIC_URL}/octofitapp-small.png`;

function App() {
  return (
    <Router>
      <div className="app-surface pb-5">
        <header className="pt-4">
          <div className="container">
            <nav className="navbar navbar-dark bg-primary rounded-4 shadow-sm px-3 py-3">
              <div className="d-flex flex-wrap align-items-center w-100 gap-3">
                <NavLink to="/activities" className="navbar-brand mb-0 fw-bold text-white d-flex align-items-center gap-2">
                  <img src={logoSrc} alt="OctoFit Tracker logo" className="logo-mark" />
                  <span>OctoFit Tracker</span>
                </NavLink>
                <div className="d-flex flex-wrap gap-2 ms-auto">
                  <NavLink to="/activities" className={navLinkClass}>
                    Activities
                  </NavLink>
                  <NavLink to="/leaderboard" className={navLinkClass}>
                    Leaderboard
                  </NavLink>
                  <NavLink to="/teams" className={navLinkClass}>
                    Teams
                  </NavLink>
                  <NavLink to="/users" className={navLinkClass}>
                    Users
                  </NavLink>
                  <NavLink to="/workouts" className={navLinkClass}>
                    Workouts
                  </NavLink>
                </div>
              </div>
            </nav>

            <div className="hero card border-0 rounded-4 shadow-sm mt-3">
              <div className="card-body p-4 p-lg-5 d-flex flex-column flex-lg-row gap-4 align-items-start align-items-lg-center">
                <div className="flex-grow-1">
                  <p className="text-uppercase text-primary fw-semibold small mb-2">Fitness dashboard</p>
                  <h1 className="display-6 fw-bold mb-2">Track, compete, and grow with OctoFit.</h1>
                  <p className="lead text-muted mb-3">
                    Monitor activities, celebrate team wins, and stay motivated with a clean, consistent view powered by
                    Bootstrap components.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <NavLink to="/activities" className="btn btn-light btn-lg">
                      View activities
                    </NavLink>
                    <NavLink to="/leaderboard" className="btn btn-light btn-lg">
                      See leaderboard
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/activities" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
