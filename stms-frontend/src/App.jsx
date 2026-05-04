import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SearchProvider } from './context/SearchContext';
import RoleGuard from './components/RoleGuard';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <SearchProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/verify-otp" element={<VerifyOTP />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />

                            <Route path="/teacher/*" element={
                                <RoleGuard requiredRole="Teacher">
                                    <TeacherDashboard />
                                </RoleGuard>
                            } />

                            <Route path="/student/*" element={
                                <RoleGuard requiredRole="Student">
                                    <StudentDashboard />
                                </RoleGuard>
                            } />
                        </Routes>
                    </BrowserRouter>
                </SearchProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
