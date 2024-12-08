import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorRegisterPage from './pages/DoctorRegisterPage';
import PatientRegisterPage from './pages/PatientRegisterPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import PatientLoginPage from './pages/PatientLoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute';
import GuestLayout from './components/common/GuestLayout';
import DoctorLayout from './components/common/DoctorLayout';
import PatientLayout from './components/common/PatientLayout';
import DoctorForgotPasswordPage from './pages/DoctorForgotPasswordPage';
import DoctorResetPasswordPage from './pages/DoctorResetPasswordPage';
import PatientForgotPasswordPage from './pages/PatientForgotPasswordPage';
import PatientResetPasswordPage from './pages/PatientResetPasswordPage';
import PatientBookAppointmentPage from './pages/PatientBookAppointmentPage';
import LandingPage from './pages/LandingPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import PatientProfilePage from './pages/PatientProfilePage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/doctor/login"
          element={
            <GuestLayout>
              <GuestRoute redirectTo="/doctor/dashboard">
                <DoctorLoginPage />
              </GuestRoute>
            </GuestLayout>
          }
        />
        <Route
          path="/doctor/forgot-password"
          element={
            <GuestLayout>
              <DoctorForgotPasswordPage />
            </GuestLayout>
          }
        />
        <Route
          path="/doctor/reset-password"
          element={
            <GuestLayout>
              <DoctorResetPasswordPage />
            </GuestLayout>
          }
        />
        <Route
          path="/doctor/register"
          element={
            <GuestLayout>
              <GuestRoute redirectTo="/doctor/dashboard" >
                <DoctorRegisterPage />
              </GuestRoute>
            </GuestLayout>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <DoctorLayout>
              <ProtectedRoute redirectTo="/doctor/login" allowedRoles={['doctor']}>
                <DoctorDashboardPage />
              </ProtectedRoute>
            </DoctorLayout>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <DoctorLayout>
              <ProtectedRoute redirectTo="/doctor/login" allowedRoles={['doctor']}>
                <DoctorProfilePage />
              </ProtectedRoute>
            </DoctorLayout>
          }
        />
        <Route
          path="/patient/login"
          element={
            <GuestLayout>
              <GuestRoute redirectTo="/patient/dashboard">
                <PatientLoginPage />
              </GuestRoute>
            </GuestLayout>
          }
        />
        <Route
          path="/patient/forgot-password"
          element={
            <GuestLayout>
              <PatientForgotPasswordPage />
            </GuestLayout>
          }
        />
        <Route
          path="/patient/reset-password"
          element={
            <GuestLayout>
              <PatientResetPasswordPage />
            </GuestLayout>
          }
        />
        <Route
          path="/patient/register"
          element={
            <GuestLayout>
              <GuestRoute redirectTo="/patient/dashboard">
                <PatientRegisterPage />
              </GuestRoute>
            </GuestLayout>
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            <PatientLayout>
              <ProtectedRoute redirectTo="/patient/login" allowedRoles={['patient']}>
                <PatientDashboardPage />
              </ProtectedRoute>
            </PatientLayout>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <PatientLayout>
              <ProtectedRoute redirectTo="/patient/login" allowedRoles={['patient']}>
                <PatientProfilePage />
              </ProtectedRoute>
            </PatientLayout>
          }
        />
        <Route
          path="/patient/book-appointment/:doctorId"
          element={
            <PatientLayout>
              <ProtectedRoute redirectTo="/patient/login" allowedRoles={['patient']}>
                <PatientBookAppointmentPage />
              </ProtectedRoute>
            </PatientLayout>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <PatientLayout>
              <ProtectedRoute redirectTo="/patient/login" allowedRoles={['patient']}>
                <PatientAppointmentsPage />
              </ProtectedRoute>
            </PatientLayout>
          }
        />
      </Routes>
    </Router >
  );
};

export default App;
