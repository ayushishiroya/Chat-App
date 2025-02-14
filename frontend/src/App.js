import React, { useEffect } from 'react';
import './App.css'
import SignIn from './components/SignIn';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('token')) && JSON.parse(localStorage.getItem('token')) !== null) {
      navigate('/dashboard')
    } else {
      navigate('/sign-in')
    }
  }, [])

  return (
    <div>
      <Routes>
        <Route path='*' element={<SignIn />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;