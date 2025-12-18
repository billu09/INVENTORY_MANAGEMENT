import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================= FETCH =================
export const fetchSales = createAsyncThunk(
  "sales/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/sales");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load sales"
      );
    }
  }
);

// ================= ADD =================
export const addSale = createAsyncThunk(
  "sales/add",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/sales", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to add sale"
      );
    }
  }
);

// ================= UPDATE =================
export const updateSale = createAsyncThunk(
  "sales/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/sales/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update sale"
      );
    }
  }
);

// ================= DELETE =================
export const deleteSale = createAsyncThunk(
  "sales/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/sales/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete sale"
      );
    }
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== FETCH =====
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD =====
      .addCase(addSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSale.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE =====
      .addCase(updateSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== DELETE =====
      .addCase(deleteSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default salesSlice.reducer;
