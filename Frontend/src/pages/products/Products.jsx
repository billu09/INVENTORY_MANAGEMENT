import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../stores/slices/categorySlice";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../stores/slices/productSlice";
import toast from "react-hot-toast";

export default function Products() {
  const dispatch = useDispatch();

  const { list: categories = [] } = useSelector((s) => s.categories);
  const { list: products = [], loading } = useSelector((s) => s.products);

  // ===== PRODUCT FORM STATE =====
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ===== LOAD DATA =====
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // ===== SUBMIT PRODUCT =====
  const submitProduct = async (e) => {
    e.preventDefault();

    if (!name || !categoryId || !sku || !price || !qty) {
      toast.error("Fill all required fields");
      return;
    }

    const payload = {
      name: name.trim(),
      categoryId: Number(categoryId),
      sku: sku.trim(),
      price: Number(price),
      qty: Number(qty),
      desc: desc.trim(),
    };

    try {
      if (editingId) {
        await dispatch(
          updateProduct({ id: editingId, data: payload })
        ).unwrap();
        toast.success("Product updated");
        setEditingId(null);
      } else {
        await dispatch(addProduct(payload)).unwrap();
        toast.success("Product added");
      }

      resetForm();
    } catch (err) {
      toast.error(err || "Failed to save product");
    }
  };

  // ===== EDIT =====
  const startEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setCategoryId(p.categoryId);
    setSku(p.sku);
    setPrice(String(p.price));
    setQty(String(p.qty));
    setDesc(p.desc || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== DELETE =====
  const removeProductById = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setSku("");
    setPrice("");
    setQty("");
    setDesc("");
  };

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ===== PRODUCT FORM ===== */}
      <section className="lg:col-span-1 bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={submitProduct} className="space-y-3">
          <input className="border p-2 rounded w-full"
            placeholder="Product name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category *</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input className="border p-2 rounded w-full"
            placeholder="SKU *"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />

          <input type="number" className="border p-2 rounded w-full"
            placeholder="Price *"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input type="number" className="border p-2 rounded w-full"
            placeholder="Quantity *"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <input className="border p-2 rounded w-full"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <div className="flex gap-2 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); resetForm(); }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
            )}
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              {editingId ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </section>

      {/* ===== PRODUCTS LIST ===== */}
      <section className="lg:col-span-2 bg-white p-4 rounded-lg shadow border">
        <h3 className="font-semibold mb-3">Products</h3>

        {loading && <p>Loading products...</p>}

        <ul className="space-y-3">
          {products.length === 0 && <li>No products yet</li>}

          {products.map((p) => (
            <li key={p.id} className="p-4 border rounded flex justify-between">
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-gray-600">
                  {getCategoryName(p.categoryId)} • SKU: {p.sku}
                </div>
                <div className="text-sm">
                  ₹{p.price} × {p.qty}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="px-3 py-1 bg-yellow-400 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProductById(p.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
