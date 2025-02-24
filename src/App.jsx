import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ErrorScreen from './screens/ErrorScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProtectedRoute from './Components/ProtectedRoute';
import HomeScreen from './screens/HomeScreen';
import CreateWorkspaceScreen from './screens/CreateWorkspaceScreen';
import WorkspaceScreen from './screens/WorkspaceScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import './app.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/error" element={<ErrorScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/workspace/new" element={<CreateWorkspaceScreen />} />
        <Route path="/workspace/:workspace_id" element={<WorkspaceScreen />} />
        <Route path="/workspace/:workspace_id/:channel_id" element={<WorkspaceScreen />} />
        <Route path="/profile" element={<UserInfoScreen />} />
      </Route>

    </Routes>
  );
};

export default App;
