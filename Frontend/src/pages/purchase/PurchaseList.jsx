import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
} from "../../stores/slices/purchaseSlice";
import toast from "react-hot-toast";

export default function PurchaseList() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector(
    (state) => state.purchases
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

  // ===== LOAD =====
  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  // ===== ADD =====
  const submit = async () => {
    if (!item || !qty || !price) {
      toast.error("All fields required");
      return;
    }

    try {
      await dispatch(
        addPurchase({
          item: item.trim(),
          qty: Number(qty),
          price: Number(price),
          total: Number(qty) * Number(price),
        })
      ).unwrap();

      setItem("");
      setQty("");
      setPrice("");
      toast.success("Purchase added");
    } catch {
      toast.error("Failed to add purchase");
    }
  };

  // ===== EDIT =====
  const startEdit = (p) => {
    setEditingId(p.id);
    setEditItem(p.item);
    setEditQty(String(p.qty));
    setEditPrice(String(p.price));
  };

  const saveEdit = async () => {
    if (!editItem || !editQty || !editPrice) {
      toast.error("All fields required");
      return;
    }

    try {
      await dispatch(
        updatePurchase({
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
      toast.success("Purchase updated");
    } catch {
      toast.error("Failed to update purchase");
    }
  };

  // ===== DELETE =====
  const remove = async (id) => {
    if (!window.confirm("Delete purchase?")) return;

    try {
      await dispatch(deletePurchase(id)).unwrap();
      toast.success("Purchase deleted");
    } catch {
      toast.error("Failed to delete purchase");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Purchases</h1>

      {/* ===== ADD ===== */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-medium mb-3">Add Purchase</h2>

        <div className="grid grid-cols-3 gap-3">
          <input
            placeholder="Item"
            className="border p-2 rounded"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            disabled={loading}
          />
          <input
            placeholder="Qty"
            type="number"
            className="border p-2 rounded"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            disabled={loading}
          />
          <input
            placeholder="Price"
            type="number"
            className="border p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Add Purchase
        </button>
      </div>

      {/* ===== LIST ===== */}
      <ul className="space-y-3">
        {list.length === 0 && !loading && (
          <li className="text-gray-500">No purchases yet</li>
        )}

        {list.map((p) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            {editingId === p.id ? (
              <div className="flex gap-2 w-full">
                <input
                  className="border p-2 rounded flex-1"
                  value={editItem}
                  onChange={(e) => setEditItem(e.target.value)}
                />
                <input
                  className="border p-2 rounded w-20"
                  type="number"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                />
                <input
                  className="border p-2 rounded w-24"
                  type="number"
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
              <>
                <div>
                  <div className="font-semibold">{p.item}</div>
                  <div className="text-sm text-gray-500">
                    Qty: {p.qty} • Price: ₹{p.price}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
