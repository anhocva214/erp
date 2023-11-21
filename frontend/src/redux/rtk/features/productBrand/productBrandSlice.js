import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  brand: null,
  error: "",
  loading: false,
};

// ADD_PRODUCT_BRAND
export const addProductBrand = createAsyncThunk(
  "productBrand/addProductBrand",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `product-brand/`,
        data: {
          ...values,
        },
      });
      toast.success("Product Brand Added");
      return { ...data, message: "success" };
    } catch (error) {
      toast.error("Error in adding product Brand try again");
      console.log(error.message);
    }
  }
);

// DELETE_PRODUCT_BRAND
export const deleteProductBrand = createAsyncThunk(
  "productBrand/DeleteProductBrand",
  async (id) => {
    try {
      const resp = await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `product-brand/${id}`,
        data: {
          status: false,
        },
      });

      return resp.data.id;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// PRODUCT_BRAND_DETAILS
export const loadSingleProductBrand = createAsyncThunk(
  "productBrand/loadSingleProductBrand",
  async (id) => {
    try {
      const data = await axios.get(`product-brand/${id}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// PRODUCT_BRANDS
export const loadAllProductBrand = createAsyncThunk(
  "productBrand/loadAllProductBrand",
  async (arg) => {
    try {
        const query = queryGenerator(arg);
      const { data } = await axios.get(`product-brand?${query}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const productBrandSlice = createSlice({
  name: "productBrand",
  initialState,
  reducers: {
    clearBrand: (state) => {
      state.brand = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllProductBrand ======

    builder.addCase(loadAllProductBrand.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllProductBrand.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action?.payload?.getAllProductBrand;
      state.total = action?.payload?.totalProductBrand;
    });

    builder.addCase(loadAllProductBrand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addProductBrand ======

    builder.addCase(addProductBrand.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addProductBrand.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload);
      state.list = list;
    });

    builder.addCase(addProductBrand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleProductBrand ======

    builder.addCase(loadSingleProductBrand.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSingleProductBrand.fulfilled, (state, action) => {
      state.loading = false;
      state.brand = action.payload.data;
    });

    builder.addCase(loadSingleProductBrand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deleteProductBrand ======

    builder.addCase(deleteProductBrand.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteProductBrand.fulfilled, (state, action) => {
      state.loading = false;
      const filtercategory = state.list.filter(
        (brand) => brand.id !== parseInt(action.payload) && brand
      );

      state.list = filtercategory;
    });

    builder.addCase(deleteProductBrand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default productBrandSlice.reducer;
export const { clearBrand } = productBrandSlice.actions;
