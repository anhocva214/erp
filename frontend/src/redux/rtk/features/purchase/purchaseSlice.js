import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: null,
  information: null,
  purchase: null,
  error: "",
  loading: false,
};

export const addPurchase = createAsyncThunk(
  "purchase/addPurchase",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `purchase-invoice/`,
        data: {
          ...values,
        },
      });

      toast.success("New Product Purchased");
      const respData = {
        newData: {
          ...data.createdInvoice,
          supplier: data.supplier,
        },
        createdInvoiceId: data.createdInvoice.id,
        message: "success",
      };

      return respData;
    } catch (error) {
      console.log(error.message);
      return {
        message: "error",
      };
    }
  }
);

export const deletePurchase = createAsyncThunk(
  "purchase/deletePurchase",
  async (id) => {
    try {
      const resp = await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `purchase-invoice/${id}`,
        data: {
          status: false,
        },
      });
      return resp.data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const loadSinglePurchase = createAsyncThunk(
  "purchase/loadSinglePurchase",
  async (id) => {
    try {
      const data = await axios.get(`purchase-invoice/${id}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const loadAllPurchase = createAsyncThunk(
  "purchase/loadAllPurchase",
  async (arg) => {
    try {
        const query = queryGenerator(arg);
      const { data } = await axios.get(`purchase-invoice?${query}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    clearPurchase: (state) => {
      state.purchase = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllPurchase ======

    builder.addCase(loadAllPurchase.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllPurchase.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.allPurchaseInvoice;
      state.total = action.payload?.aggregations?._count?.id;
      state.information = action.payload?.aggregations?._sum;
    });

    builder.addCase(loadAllPurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addPurchase ======

    builder.addCase(addPurchase.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addPurchase.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload.newData);
      state.list = list;
    });

    builder.addCase(addPurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSinglePurchase ======

    builder.addCase(loadSinglePurchase.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSinglePurchase.fulfilled, (state, action) => {
      state.loading = false;
      state.purchase = action.payload?.data;
    });

    builder.addCase(loadSinglePurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deletePurchase ======

    builder.addCase(deletePurchase.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deletePurchase.fulfilled, (state, action) => {
      state.loading = false;
      const filterPurchase = state.list.filter(
        (purchase) => purchase.id !== parseInt(action.payload.id) && purchase
      );
      state.list = filterPurchase;
    });

    builder.addCase(deletePurchase.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default purchaseSlice.reducer;
export const { clearPurchase } = purchaseSlice.actions;
