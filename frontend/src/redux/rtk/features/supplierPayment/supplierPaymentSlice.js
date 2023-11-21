import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: null,
  supplierPayment: null,
  error: "",
  loading: false,
};

// ADD_SUPPLIER_PAYMENT
export const addSupplierPayment = createAsyncThunk(
  "supplierPayment/addSupplierPayment",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `payment-purchase-invoice/`,
        data: {
          ...values,
        },
      });
      return {
        data,
        message: "success",
      };
    } catch (error) {
      console.log(error.message);
    }
  }
);

// DELETE_SUPPLIER_PAYMENT
export const deleteSupplierPayment = createAsyncThunk(
  "supplierPayment/deleteSupplierPayment",
  async (id) => {
    try {
      const resp = await axios({
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `transaction/${id}`,
      });

      return resp.data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// SUPPLIER_DETAILS_PAYMENT
export const loadSupplierSinglePayment = createAsyncThunk(
  "supplierPayment/loadSupplierSinglePayment",
  async (id) => {
    try {
      const data = await axios.get(`transaction/${id}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// SUPPLIERS_PAYMENT
export const loadSupplierAllPayment = createAsyncThunk(
  "supplierPayment/loadSupplierAllPayment",
  async (arg) => {
    try {
        const query = queryGenerator(arg);
      const { data } = await axios.get(`transaction?${query}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const supplierPaymentSlice = createSlice({
  name: "supplierPayment",
  initialState,
  extraReducers: (builder) => {
    // 1) ====== builders for loadSupplierAllPayment ======

    builder.addCase(loadSupplierAllPayment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSupplierAllPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.getAllPaymentPurchaseInvoice;
      state.total = action.payload?.totalPaymentPurchaseInvoice;
    });

    builder.addCase(loadSupplierAllPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addSupplierPayment ======

    builder.addCase(addSupplierPayment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addSupplierPayment.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload);
      state.list = list;
    });

    builder.addCase(addSupplierPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSupplierSinglePayment ======

    builder.addCase(loadSupplierSinglePayment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSupplierSinglePayment.fulfilled, (state, action) => {
      state.loading = false;

      state.supplier = action.payload.data;
    });

    builder.addCase(loadSupplierSinglePayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deleteSupplierPayment ======

    builder.addCase(deleteSupplierPayment.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSupplierPayment.fulfilled, (state, action) => {
      state.loading = false;

      const filterSupplierPayment = state.list.filter(
        (sup) => sup.id !== parseInt(action.payload) && sup
      );

      state.list = filterSupplierPayment;
    });

    builder.addCase(deleteSupplierPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default supplierPaymentSlice.reducer;
