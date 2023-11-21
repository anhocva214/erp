import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: 0,
  category: null,
  error: "",
  loading: false,
};

// ADD_PRODUCT_CATEGORY
export const addProductCategory = createAsyncThunk(
  "productCategory/addProductCategory",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `product-category/`,
        data: {
          ...values,
        },
      });
      toast.success("product category Added");
      return { ...data, message: "success" };
    } catch (error) {
      toast.error("Error in adding product category try again");
      console.log(error.message);
    }
  }
);

// DELETE_PRODUCT_CATEGORY
export const deleteProductCategory = createAsyncThunk(
  "productCategory/deleteProductCategory",
  async (id) => {
    try {
      const resp = await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `product-category/${id}`,
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

// PRODUCT_CATEGORY_DETAILS
export const loadSingleProductCategory = createAsyncThunk(
  "productCategory/loadSingleProductCategory",
  async (id) => {
    try {
      const data = await axios.get(`product-category/${id}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// PRODUCT_CATEGORYS
export const loadAllProductCategory = createAsyncThunk(
  "productCategory/loadAllProductCategory",
  async (arg) => {
    try {
        const query = queryGenerator(arg);
      const { data } = await axios.get(`product-category?${query}`);

      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const productCategorySlice = createSlice({
  name: "productCategory",
  initialState,
  reducers: {
    clearCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllProductCategory ======

    builder.addCase(loadAllProductCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllProductCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.getAllProductCategory;
      state.total = action.payload?.totalProductCategory;
    });

    builder.addCase(loadAllProductCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addProductCategory ======

    builder.addCase(addProductCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addProductCategory.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload);
      state.list = list;
    });

    builder.addCase(addProductCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingleProductCategory ======

    builder.addCase(loadSingleProductCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSingleProductCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action.payload.data;
    });

    builder.addCase(loadSingleProductCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deleteProductCategory ======

    builder.addCase(deleteProductCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteProductCategory.fulfilled, (state, action) => {
      state.loading = false;
      const filterCategory = state.list.filter(
        (category) => category.id !== parseInt(action.payload) && category
      );
      state.list = filterCategory;
    });

    builder.addCase(deleteProductCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default productCategorySlice.reducer;
export const { clearCategory } = productCategorySlice.actions;
