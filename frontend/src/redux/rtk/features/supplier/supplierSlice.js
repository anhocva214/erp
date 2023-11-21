import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: null,
  supplier: null,
  error: "",
  loading: false,
};

export const loadSuppliers = createAsyncThunk(
  "supplier/loadSuppliers",
  async (arg) => {
    try {
        const query = queryGenerator(arg);
      const { data } = await axios.get(`supplier?${query}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const addSupplier = createAsyncThunk(
  "supplier/addSupplier",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `supplier/`,
        data: {
          ...values,
        },
      });
      toast.success("Supplier Added");
      const respData = {
        ...data,
        message: "success",
      };
      return respData;
      // return {
      //   message: 'success',
      // };
    } catch (error) {
      console.log(error.message);
      toast.error("Error : Supplier already exists");
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (id) => {
    try {
      const resp = await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `supplier/${id}`,
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

export const loadSupplier = createAsyncThunk(
  "supplier/loadSupplier",
  async (id) => {
    try {
      const data = await axios.get(`supplier/${id}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearSupplier: (state) => {
      state.supplier = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadSuppliers ======

    builder.addCase(loadSuppliers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSuppliers.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.getAllSupplier;
      state.total = action.payload?.totalSupplier;
    });

    builder.addCase(loadSuppliers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addSupplier ======

    builder.addCase(addSupplier.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addSupplier.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload);
      state.list = list;
    });

    builder.addCase(addSupplier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for deleteSupplier ======

    builder.addCase(deleteSupplier.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSupplier.fulfilled, (state, action) => {
      state.loading = false;

      const filterSupplier = state.list.filter(
        (sup) => sup.id !== parseInt(action.payload.id) && sup
      );

      state.list = filterSupplier;
    });

    builder.addCase(deleteSupplier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for loadSupplier ======

    builder.addCase(loadSupplier.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSupplier.fulfilled, (state, action) => {
      state.loading = false;
      state.supplier = action.payload.data;
    });

    builder.addCase(loadSupplier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default supplierSlice.reducer;
export const { clearSupplier } = supplierSlice.actions