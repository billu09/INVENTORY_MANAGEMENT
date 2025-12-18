import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import CategoryList from "./pages/categories/CategoryList";
import CategoryForm from "./pages/categories/CategoryForm";
import SalesList from "./pages/sales/SalesList";
import PurchaseList from "./pages/purchase/PurchaseList";
import CompanyRegister from "./pages/companies/CompanyRegister";
import AdminPanel from "./pages/admin/AdminPanel";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import Products from "./pages/products/Products";
import CompaniesList from "./pages/companies/CompaniesList";
import ActivityLogs from "./pages/admin/ActivityLogs";

// ================= LAYOUT =================
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ================= AUTH GUARD =================
function RequireAuth({ children, role }) {
  const user = useSelector((state) => state.auth?.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
  const userRole = user.role?.toLowerCase().includes("admin")


  if (!userRole || !userRole.includes(role.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }
}


  return children;
}


export default function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/companies/register" element={<CompanyRegister />} />

      {/* ===== PROTECTED ROUTES ===== */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <AppLayout>
              <Profile />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/products"
        element={
          <RequireAuth>
            <AppLayout>
              <Products />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/categories"
        element={
          <RequireAuth>
            <AppLayout>
              <CategoryList />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/categories/new"
        element={
          <RequireAuth>
            <AppLayout>
              <CategoryForm />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/categories/edit/:id"
        element={
          <RequireAuth>
            <AppLayout>
              <CategoryForm />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/sales"
        element={
          <RequireAuth>
            <AppLayout>
              <SalesList />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/purchase"
        element={
          <RequireAuth>
            <AppLayout>
              <PurchaseList />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* ===== ADMIN ONLY ===== */}
      <Route
        path="/companies"
        element={
          <RequireAuth role="admin">
            <AppLayout>
              <CompaniesList />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/activity-logs"
        element={
          <RequireAuth role="admin">
            <AppLayout>
              <ActivityLogs />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <AppLayout>
              <AdminPanel />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
