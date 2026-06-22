import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

// Lazy-loaded pages
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const DashboardPage = React.lazy(() => import("./pages/Dashboard"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;