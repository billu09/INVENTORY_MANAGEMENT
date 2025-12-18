import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSales,
  addSale,
  updateSale,
  deleteSale,
} from "../../stores/slices/salesSlice";
import toast from "react-hot-toast";

export default function SalesList() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector(
    (state) => state.sales
  );

  // ===== ADD FORM =====
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  // ===== EDIT FORM =====
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  // ===== ADD =====
  const submitSale = async () => {
    if (!item || !qty || !price) {
      toast.error("All fields required");
      return;
    }

    try {
      await dispatch(
        addSale({
          item: item.trim(),
          qty: Number(qty),
          price: Number(price),
          total: Number(qty) * Number(price),
        })
      ).unwrap();

      setItem("");
      setQty("");
      setPrice("");
      toast.success("Sale added");
    } catch {
      toast.error("Failed to add sale");
    }
  };

  // ===== EDIT =====
  const startEdit = (s) => {
    setEditingId(s.id);
    setEditItem(s.item);
    setEditQty(String(s.qty));
    setEditPrice(String(s.price));
  };

  const saveEdit = async () => {
    if (!editItem || !editQty || !editPrice) {
      toast.error("All fields required");
      return;
    }

    try {
      await dispatch(
        updateSale({
          id: editingId,
          data: {
            item: editItem.trim(),
            qty: Number(editQty),
            price: Number(editPrice),
            total: Number(editQty) * Number(editPrice),
          },
        })
      ).unwrap();

      setEditingId(null);
      toast.success("Sale updated");
    } catch {
      toast.error("Failed to update sale");
    }
  };

  // ===== DELETE =====
  const remove = async (id) => {
    if (!window.confirm("Delete sale?")) return;

    try {
      await dispatch(deleteSale(id)).unwrap();
      toast.success("Sale deleted");
    } catch {
      toast.error("Failed to delete sale");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales</h1>

      {/* ===== ADD ===== */}
      <div className="p-4 bg-white rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Sale</h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            disabled={loading}
          />
          <input
            type="number"
            className="border px-3 py-2 rounded"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            disabled={loading}
          />
          <input
            type="number"
            className="border px-3 py-2 rounded"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          onClick={submitSale}
          disabled={loading}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Add Sale
        </button>
      </div>

      {/* ===== LIST ===== */}
      <ul className="space-y-3">
        {list.length === 0 && !loading && (
          <li className="text-gray-500">No sales yet</li>
        )}

        {list.map((sale) => (
          <li key={sale.id} className="bg-white p-4 rounded shadow border">
            {editingId === sale.id ? (
              <div className="flex gap-3">
                <input
                  className="border p-2 rounded flex-1"
                  value={editItem}
                  onChange={(e) => setEditItem(e.target.value)}
                />
                <input
                  type="number"
                  className="border p-2 rounded w-24"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                />
                <input
                  type="number"
                  className="border p-2 rounded w-24"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{sale.item}</div>
                  <div className="text-sm text-gray-500">
                    Qty: {sale.qty} • Price: ₹{sale.price}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(sale)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(sale.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
