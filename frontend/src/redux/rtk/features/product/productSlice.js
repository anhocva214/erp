import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
	list: [],
	product: null,
	posProduct: null,
	error: "",
	loading: false,
	total: 0,
};

export const loadProduct = createAsyncThunk(
	"product/loadProduct",
	async (arg) => {
		try {
			const query = queryGenerator(arg);
			const { data } = await axios.get(`product?${query}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const addProduct = createAsyncThunk(
	"product/addProduct",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "multipart/form-data",
				},
				url: `product/`,
				data: values,
			});
			toast.success("Product Added");
			return {
				...data,
				message: "success",
			};
		} catch (error) {
			console.log(error.message);
			toast.error("Error, Check Name and Others ");
			return {
				message: "error",
			};
		}
	}
);

export const loadSingleProduct = createAsyncThunk(
	"product/loadSingleProduct",
	async (id) => {
		try {
			const data = await axios.get(`product/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const loadPosProduct = createAsyncThunk(
	"product/loadPosProduct",
	async (id) => {
		try {
			const { data } = await axios.get(`product?query=search&prod=${id}`);

			return { status: "success", data: data };
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const deleteProduct = createAsyncThunk(
	"product/deleteProduct",
	async (id) => {
		try {
			const resp = await axios({
				method: "patch",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `product/${id}`,
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

export const searchProduct = createAsyncThunk(
	"product/searchProduct",
	async (prod) => {
		try {
			const { data } = await axios.get(`product?query=search&prod=${prod}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

const productSlice = createSlice({
	name: "supplier",
	initialState,
	reducers: {
		clearProduct: (state) => {
			state.product = null;
		},
		clearProductList: (state) => {
			state.list = [];
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for loadProduct ======

		builder.addCase(loadProduct.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadProduct.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload?.getAllProduct;
			state.total = action.payload?.totalProduct;
		});

		builder.addCase(loadProduct.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for addProduct ======

		builder.addCase(addProduct.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addProduct.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.unshift(action.payload);
			state.list = list;
		});

		builder.addCase(addProduct.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleProduct ======

		builder.addCase(loadSingleProduct.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleProduct.fulfilled, (state, action) => {
			state.loading = false;
			state.product = action.payload.data;
		});

		builder.addCase(loadSingleProduct.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 4) ====== builders for loadPosProduct ======

		builder.addCase(loadPosProduct.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadPosProduct.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload.data;
		});

		builder.addCase(loadPosProduct.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 5) ====== builders for deleteProduct ======

		builder.addCase(deleteProduct.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteProduct.fulfilled, (state, action) => {
			state.loading = false;
			const filterProduct = state.list.filter(
				(prod) => prod.id !== parseInt(action.payload.id) && prod
			);
			state.list = filterProduct;
		});

		builder.addCase(deleteProduct.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 6) ====== builders for searchProduct ======

		builder.addCase(searchProduct.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(searchProduct.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(searchProduct.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default productSlice.reducer;
export const { clearProduct, clearProductList } = productSlice.actions;
