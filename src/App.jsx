import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import IdeationPage from "./pages/IdeationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { BoardProvider } from "./context/BoardContext";
import { SidebarProvider } from "./context/SidebarContext";
import { LanguageProvider } from "./context/LanguageContext";
import NavigateToSocialHubPage from "./pages/NavigateToSocialHubPage";
import HomePage from "./pages/HomePage";
import LoadingScreen from "./components/LoadingScreen";

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const ProtectedLoginRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isDevelopment = import.meta.env.VITE_ENVIORNMENT === "development";

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return isDevelopment ? <LoginPage /> : <NavigateToSocialHubPage />;
};

const AuthenticatedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/ideation/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/ideation"
        element={
          <ProtectedLayout>
            <IdeationPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/ideation/:boardId"
        element={
          <ProtectedLayout>
            <IdeationPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedLayout>
            <HomePage />
          </ProtectedLayout>
        }
      />{" "}
      {/* <Route path="/api" element={<ProtectedLayout><ApiPage /></ProtectedLayout>} /> */}
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BoardProvider>
        <SidebarProvider>
          <LanguageProvider>
            <HashRouter>
              <Routes>
                <Route path="/ideation/login" element={<ProtectedLoginRoute />} />
                <Route path="/*" element={<AuthenticatedRoutes />} />
              </Routes>
              <Toaster position="top-right" />
            </HashRouter>
          </LanguageProvider>
        </SidebarProvider>
      </BoardProvider>
    </AuthProvider>
  );
}
