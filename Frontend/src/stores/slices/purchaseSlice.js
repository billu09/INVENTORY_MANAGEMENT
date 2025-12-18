import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================= FETCH =================
export const fetchPurchases = createAsyncThunk(
  "purchases/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/purchases");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load purchases"
      );
    }
  }
);

// ================= ADD =================
export const addPurchase = createAsyncThunk(
  "purchases/add",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/purchases", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to add purchase"
      );
    }
  }
);

// ================= UPDATE =================
export const updatePurchase = createAsyncThunk(
  "purchases/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/purchases/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update purchase"
      );
    }
  }
);

// ================= DELETE =================
export const deletePurchase = createAsyncThunk(
  "purchases/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/purchases/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete purchase"
      );
    }
  }
);

const purchaseSlice = createSlice({
  name: "purchases",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== FETCH =====
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD =====
      .addCase(addPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE =====
      .addCase(updatePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== DELETE =====
      .addCase(deletePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default purchaseSlice.reducer;
