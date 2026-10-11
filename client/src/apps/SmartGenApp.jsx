import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/smartgen/Layout';
import AuthLayout from '../components/layout/auth/Layout';
import HomePage from '../pages/smartgen/HomePage';
import TemplatesPage from '../pages/smartgen/TemplatesPage';
import EditorPage from '../pages/smartgen/EditorPage';
import DocumentsPage from '../pages/smartgen/DocumentsPage';
import SettingsPage from '../pages/smartgen/SettingsPage';
import LoginPage from '../pages/smartgen/LoginPage';
import RegisterPage from '../pages/smartgen/RegisterPage';
import VerifyPage from '../pages/smartgen/VerifyPage';
import ForgotPasswordPage from '../pages/smartgen/ForgotPasswordPage';
import ResetPasswordPage from '../pages/smartgen/ResetPasswordPage';
import NotFoundPage from '../pages/smartgen/NotFoundPage';

export default function SmartGenApp() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify" element={<VerifyPage />} />
        <Route path="forgot" element={<ForgotPasswordPage />} />
        <Route path="reset" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="editor/:templateId?" element={<EditorPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}