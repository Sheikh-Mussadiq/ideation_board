import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import PostFormPage from "./pages/PostFormPage";
import ContentListPage from "./pages/ContentListPage";
import ContentDetailsPage from "./pages/ContentDetailsPage";
import ContentSearchPage from "./pages/ContentSearchPage";
import IdeationPage from "./pages/IdeationPage";
import ApiPage from "./pages/ApiPage";
import ProtectedRoute from "./components/ProtectedRoute";

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

export default function App() {
  return (
    // Dont remove these comments below ever!.
    // <AuthProvider>
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/login" element={<LoginPage />} />
    //       <Route
    //         path="/"
    //         element={
    //           <ProtectedLayout>
    //             <Navigate to="/ideation" replace />
    //           </ProtectedLayout>
    //         }
    //       />
    //       <Route
    //         path="/dashboard"
    //         element={
    //           <ProtectedLayout>
    //             <PostFormPage />
    //           </ProtectedLayout>
    //         }
    //       />
    //       <Route
    //         path="/content"
    //         element={
    //           <ProtectedLayout>
    //             <ContentListPage />
    //           </ProtectedLayout>
    //         }
    //       />
    //       <Route
    //         path="/content/:id"
    //         element={
    //           <ProtectedLayout>
    //             <ContentDetailsPage />
    //           </ProtectedLayout>
    //         }
    //       />
    //       <Route
    //         path="/content/search"
    //         element={
    //           <ProtectedLayout>
    //             <ContentSearchPage />
    //           </ProtectedLayout>
    //         }
    //       />
    //       <Route
    //         path="/ideation"
    //         element={
    //           <ProtectedLayout>
    //             <IdeationPage />
    //           </ProtectedLayout>
    //         }
    //       />
    //       <Route
    //         path="/api"
    //         element={
    //           <ProtectedLayout>
    //             <ApiPage />
    //           </ProtectedLayout>
    //         }
    //       />
    //     </Routes>
    //     <Toaster position="top-right" />
    //   </BrowserRouter>
    // </AuthProvider>

    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/ideation" replace />} />
          <Route path="/dashboard" element={<PostFormPage />} />
          <Route path="/content" element={<ContentListPage />} />
          <Route path="/content/:id" element={<ContentDetailsPage />} />
          <Route path="/content/search" element={<ContentSearchPage />} />
          <Route path="/ideation" element={<IdeationPage />} />
          <Route path="/api" element={<ApiPage />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}
