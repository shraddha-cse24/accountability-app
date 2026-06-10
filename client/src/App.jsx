import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import GroupDetailsPage from "./pages/GroupDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ProfilePage
  from "./pages/ProfilePage";
import GroupHistoryPage
  from "./pages/GroupHistoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/group/:groupId/history"
        element={
          <ProtectedRoute>
            <GroupHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <GroupDetailsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;