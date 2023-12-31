import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
	list: null,
	sale: null,
	total: null,
	error: "",
	loading: false,
};

export const addSale = createAsyncThunk("sale/addSale", async (values) => {
	try {
		const { data } = await axios({
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `sale-invoice/`,
			data: {
				...values,
			},
		});

		const respData = {
			newData: {
				...data.createdInvoice,
				customer: data.customer,
			},
			createdInvoiceId: data.createdInvoice.id,
			message: "success",
		};

		toast.success("New Product Sold ");
		return respData;
	} catch (error) {
		console.log(error.message);
		return {
			message: "error",
		};
	}
});

// Ecomerce Add Order

export const addEcomOrder = createAsyncThunk(
	"sale/addEcomOrder",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `e-commerce/orders/create-order`,
				data: {
					...values,
				},
			});

			const respData = {
				newData: {
					...data.createdInvoice,
					customer: data.customer,
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

export const deleteSale = createAsyncThunk("sale/deleteSale", async (id) => {
	try {
		const resp = await axios({
			method: "patch",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `sale-invoice/${id}`,
			data: {
				status: false,
			},
		});

		return resp.data;
	} catch (error) {
		console.log(error.message);
	}
});

export const loadSingleSale = createAsyncThunk(
	"sale/loadSingleSale",
	async (id) => {
		try {
			const data = await axios.get(`sale-invoice/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const loadAllSale = createAsyncThunk("sale/loadAllSale", async (arg) => {
	try {
		const query = queryGenerator(arg);
		const { data } = await axios.get(`sale-invoice?${query}`);

		const respData = {
			...data,
			message: "success",
		};
		return respData;
	} catch (error) {
		console.log(error.message);
		toast.error("Error in loading sales");
	}
});

// Load all ecom orders

export const loadAllEcomOrders = createAsyncThunk(
	"sale/loadAllEcomOrders",
	async () => {
		// fetching id from local storage
		const id = localStorage.getItem("id");
		try {
			const { data } = await axios.get(`e-commerce/orders/order-details/${id}`);

			const respData = {
				...data,
			};

			return respData;
		} catch (error) {
			console.log(error.message);
			toast.error("Something went wrong, please try again later");
		}
	}
);

const saleSlice = createSlice({
	name: "sale",
	initialState,
	reducers: {
		clearSale: (state) => {
			state.sale = null;
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for loadAllSale ======

		builder.addCase(loadAllSale.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllSale.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload?.allSaleInvoice;
			state.total = action.payload?.aggregations;
		});

		builder.addCase(loadAllSale.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for ecomorders ======

		builder.addCase(loadAllEcomOrders.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllEcomOrders.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
			state.total = action.payload.aggregations;
		});

		builder.addCase(loadAllEcomOrders.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for addSale ======

		builder.addCase(addSale.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addSale.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.push(action.payload.newData);
			state.list = list;
		});

		builder.addCase(addSale.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		//  ====== builders for addEcomOrder ======

		builder.addCase(addEcomOrder.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addEcomOrder.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.push(action.payload.newData);
			state.list = list;
		});

		builder.addCase(addEcomOrder.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleSale ======

		builder.addCase(loadSingleSale.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleSale.fulfilled, (state, action) => {
			state.loading = false;
			state.sale = action.payload.data;
		});

		builder.addCase(loadSingleSale.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 4) ====== builders for deleteSale ======

		builder.addCase(deleteSale.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteSale.fulfilled, (state, action) => {
			state.loading = false;

			const filterSale = state.list.filter(
				(sale) => sale.id !== parseInt(action.payload.id) && sale
			);
			state.list = filterSale;
		});

		builder.addCase(deleteSale.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default saleSlice.reducer;
export const { clearSale } = saleSlice.actions;
