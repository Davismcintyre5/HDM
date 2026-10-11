import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HdmProvider } from './context/HdmContext';
import { SmartGenProvider } from './context/SmartGenContext';
import HdmApp from './apps/HdmApp';
import SmartGenApp from './apps/SmartGenApp';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route
              path="/smartgen/*"
              element={
                <SmartGenProvider>
                  <SmartGenApp />
                </SmartGenProvider>
              }
            />
            <Route
              path="/*"
              element={
                <HdmProvider>
                  <HdmApp />
                </HdmProvider>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}