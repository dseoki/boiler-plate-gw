import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from './components/views/LendingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Routes>
          <Route exact path="/" element={Auth(LandingPage, null, true)} />
          <Route exact path="/login" element={Auth(LoginPage, false)} />
          <Route exact path="/register" element={Auth(RegisterPage, false)} />
        </Routes>
      </div>
    </Router>
  )
}

export default App