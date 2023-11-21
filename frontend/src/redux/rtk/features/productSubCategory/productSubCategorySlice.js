import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
	list: null,
	total: null,
	subCategory: null,
	error: "",
	loading: false,
};

// ADD_SUB_CATEGORY
export const addProductSubCategory = createAsyncThunk(
	"productSubCategory/addProductSubCategory",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `product-sub-category/`,
				data: {
					...values,
				},
			});
			toast.success("product Sub-Category Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Error in adding product Sub-Category try again");
			console.log(error.message);
		}
	}
);

// DELETE_SUB_CATEGORY
export const deleteProductSubCategory = createAsyncThunk(
	"productSubCategory/deleteProductSubCategory",
	async (id) => {
		try {
			const resp = await axios({
				method: "patch",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `product-sub-category/${id}`,
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

// SUB_CATEGORY_DETAILS
export const loadSingleProductSubCategory = createAsyncThunk(
	"productSubCategory/loadSingleProductSubCategory",
	async (id) => {
		try {
			const data = await axios.get(`product-sub-category/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

// loadSingleProductSubCategoryForEcommerceProduct
export const loadSingleProductSubCategoryForEcommerceProduct = createAsyncThunk(
	"productSubCategory/loadSingleProductSubCategoryForEcommerceProduct",
	async (id) => {
		try {
			const data = await axios.get(
				`e-commerce/subcategory/sub-category-details/${id}`
			);

			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

// SUB_CATEGORYS
export const loadAllProductSubCategory = createAsyncThunk(
	"productSubCategory/loadAllProductSubCategory",
	async (arg) => {
		try {
			const query = queryGenerator(arg);
			const { data } = await axios.get(`product-sub-category?${query}`);

			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

// SUB_CATEGORYS for EcommeceProduct

export const loadAllProductSubCategoryForEcommerceProduct = createAsyncThunk(
	"productSubCategory/loadAllProductSubCategoryForEcommerceProduct",
	async () => {
		try {
			const { data } = await axios.get(
				`e-commerce/subcategory/sub-category-details`
			);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

const productSubCategorySlice = createSlice({
	name: "productSubCategory",
	initialState,
	reducers: {
		clearSubCategory: (state) => {
			state.sub_category = null;
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for loadAllProductSubCategory ======

		builder.addCase(loadAllProductSubCategory.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllProductSubCategory.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload?.getAllProductSubCategory;
			state.total = action.payload?.totalProductSubCategory;
		});

		builder.addCase(loadAllProductSubCategory.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for loadAllEcomProductSubCategory ======

		builder.addCase(
			loadAllProductSubCategoryForEcommerceProduct.pending,
			(state) => {
				state.loading = true;
			}
		);

		builder.addCase(
			loadAllProductSubCategoryForEcommerceProduct.fulfilled,
			(state, action) => {
				state.loading = false;
				state.list = action.payload;
			}
		);

		builder.addCase(
			loadAllProductSubCategoryForEcommerceProduct.rejected,
			(state, action) => {
				state.loading = false;
				state.error = action.payload.message;
			}
		);

		// 2) ====== builders for addProductSubCategory ======

		builder.addCase(addProductSubCategory.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addProductSubCategory.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.push(action.payload.data);
			state.list = list;
		});

		builder.addCase(addProductSubCategory.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleProductSubCategory ======

		builder.addCase(loadSingleProductSubCategory.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleProductSubCategory.fulfilled, (state, action) => {
			state.loading = false;
			state.subCategory = action.payload.data;
		});

		builder.addCase(loadSingleProductSubCategory.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleProductSubCategoryForEcommerceProduct ======

		builder.addCase(
			loadSingleProductSubCategoryForEcommerceProduct.pending,
			(state) => {
				state.loading = true;
			}
		);

		builder.addCase(
			loadSingleProductSubCategoryForEcommerceProduct.fulfilled,
			(state, action) => {
				state.loading = false;
				state.sub_category = action.payload.data;
			}
		);

		builder.addCase(
			loadSingleProductSubCategoryForEcommerceProduct.rejected,
			(state, action) => {
				state.loading = false;
				state.error = action.payload.message;
			}
		);

		// 4) ====== builders for deleteProductSubCategory ======

		builder.addCase(deleteProductSubCategory.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteProductSubCategory.fulfilled, (state, action) => {
			state.loading = false;

			const filterSubCategory = state.list.filter(
				(sub_category) =>
					sub_category.id !== parseInt(action.payload) && sub_category
			);
			state.list = filterSubCategory;
		});

		builder.addCase(deleteProductSubCategory.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default productSubCategorySlice.reducer;
export const { clearSubCategory } = productSubCategorySlice.actions;
