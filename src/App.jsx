import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import IdeationPage from "./pages/IdeationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { BoardProvider } from "./context/BoardContext";
import { SidebarProvider } from './context/SidebarContext';

import HomePage from "./pages/HomePage";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  </div>
);

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const AuthenticatedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/ideation" replace />} /> */}
      {/* <Route path="/dashboard" element={<ProtectedLayout><PostFormPage /></ProtectedLayout>} /> */}
      {/* <Route path="/content" element={<ProtectedLayout><ContentListPage /></ProtectedLayout>} /> */}
      {/* <Route path="/content/:id" element={<ProtectedLayout><ContentDetailsPage /></ProtectedLayout>} /> */}
      {/* <Route path="/content/search" element={<ProtectedLayout><ContentSearchPage /></ProtectedLayout>} /> */}
      {/* <Route path="/ideation" element={<ProtectedLayout><IdeationPage /></ProtectedLayout>} /> */}
      <Route path="/" element={<Navigate to="/ideation" replace />} />
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
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<AuthenticatedRoutes />} />
            </Routes>
            <Toaster position="top-right" />
          </BrowserRouter>
        </SidebarProvider>
      </BoardProvider>
    </AuthProvider>
  );
}
