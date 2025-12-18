import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../stores/slices/companySlice";
import { fetchCategories } from "../stores/slices/categorySlice";
import { fetchSales } from "../stores/slices/salesSlice";
import { fetchPurchases } from "../stores/slices/purchaseSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  // ===== AUTH =====
  const user = useSelector((state) => state.auth?.user);
  const role = user?.role?.toLowerCase() || "";

  const isAdmin = role.includes("admin");
  const isCompany = role.includes("company");

  // ===== DATA =====
  const categories = useSelector((state) => state.categories.list);
  const companies = useSelector((state) => state.companies.list);
  const sales = useSelector((state) => state.sales.list);
  const purchases = useSelector((state) => state.purchases.list);

  // ===== LOAD DATA =====
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchCompanies());
    }

    if (isCompany) {
      dispatch(fetchCategories());
      dispatch(fetchSales());
      dispatch(fetchPurchases());
    }
  }, [dispatch, isAdmin, isCompany]);

  // ===== DERIVED METRICS =====
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.active).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* ===== COMPANY DASHBOARD ===== */}
      {isCompany && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Categories" value={categories.length} />
          <StatCard title="Sales" value={sales.length} />
          <StatCard title="Purchases" value={purchases.length} />
        </div>
      )}

      {/* ===== ADMIN DASHBOARD ===== */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Companies" value={totalCompanies} />
          <StatCard title="Active Companies" value={activeCompanies} />
        </div>
      )}
    </div>
  );
}

// ===== REUSABLE CARD =====
function StatCard({ title, value }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-3xl mt-3">{value}</p>
    </div>
  );
}
