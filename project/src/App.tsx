import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { DoctorList } from './components/doctors/DoctorList';
import { AppointmentList } from './components/appointments/AppointmentList';
import { AuthProvider } from './context/AuthContext';
import { Home } from './components/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/appointments" element={<AppointmentList />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;