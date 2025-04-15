import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import { useContext, useMemo } from "react";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
// import Admin from './pages/Admin'
import AdminLogin from "./pages/adminlogin";
// import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import Logout from "./pages/Logout";
import Bookings from "./pages/Bookings";
import ProtectedRoute from "./components/ProtectedRoute";
import Book from "./pages/Book";
import Reports from "./pages/Reports";
import Setting from "./pages/Setting";
import AdminVehicleCategory from "./pages/AdminVehicleCategory";
import AdminBookings from "./pages/AdminBookings";
import AdminManageVehicle from "./pages/AdminManageVehicle";
import AdminReports from "./pages/AdminReports";
import AdminParkingLot from "./pages/AdminParkingLot";
import { ConfigProvider, theme as antdtheme } from "antd";
import { Toaster } from "react-hot-toast";
import AdminregUser from "./pages/AdminregUser";
import AdminBook from "./pages/AdminBook";
import AdminSetting from "./pages/AdminSetting";
import NotFound from "./pages/NotFound";
// import AdminBookregUser from "./pages/AdminBookregUser";

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
        },
      }),
    [isDark]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ConfigProvider
        theme={
          theme == "dark"
            ? {
                algorithm: antdtheme.darkAlgorithm,
              }
            : {}
        }
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: isDark ? "#333" : "#fff",
              color: isDark ? "#fff" : "#000",
            },
          }}
        />
        <CssBaseline />
        <ThemeSwitcher />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute redirectPath="/login">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/category"
              element={
                <ProtectedRoute>
                  <AdminVehicleCategory />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/admin/users"
              element={
                <ProtectedRoute >
                  <AdminBookregUser />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings/:id"
              element={
                <ProtectedRoute>
                  <AdminBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicle"
              element={
                <ProtectedRoute>
                  <AdminManageVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSetting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/parkinglot"
              element={
                <ProtectedRoute>
                  <AdminParkingLot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/registered-users"
              element={
                <ProtectedRoute>
                  <AdminregUser />
                </ProtectedRoute>
              }
            />

            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute redirectPath="/login">
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute redirectPath="/login">
                  <Book />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute redirectPath="/login">
                  <Setting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute redirectPath="/login">
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </MuiThemeProvider>
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
