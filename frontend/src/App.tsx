import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import AdminLogin from "./pages/admin/adminlogin";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster as ShadToaster } from "@/components/ui/sonner";
import { ConfigProvider, theme as antdtheme } from "antd";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./pages/admin/AdminRoutes";
import Settings from "./pages/Setting";
import Bookings from "./pages/Bookings";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import Book from "./pages/Book";
import UserLayout from "./pages/UserLayout";
import BookingStatus from "./pages/BookingStatus";

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={
        theme == "dark"
          ? {
              algorithm: antdtheme.darkAlgorithm,
            }
          : {}
      }
    >
      <ShadToaster />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#000",
          },
        }}
      />

      <ThemeSwitcher />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute redirectPath="/admin/login">
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectPath="/login">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<Book />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
          <Route
            path="/booking-status"
            element={
              <ProtectedRoute redirectPath="/login">
                <BookingStatus />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
