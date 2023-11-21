import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "./../../../../utils/queryGenarator";
const initialState = {
	list: null,
	customer: null,
	total: null,
	error: "",
	loading: false,
};

export const addCustomer = createAsyncThunk(
	"customer/addCustomer",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `customer`,
				data: {
					...values,
				},
			});
			const respData = {
				...data,
				message: "success",
			};
			toast.success("Register Successfully Done and Sent Email ");
			return respData;
		} catch (error) {
			toast.error("Error in register please try again !");
			console.log(error.message);
		}
	}
);

export const deleteCustomer = createAsyncThunk(
	"customer/deleteCustomer",
	async (id) => {
		try {
			const resp = await axios({
				method: "patch",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `customer/${id}`,
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

export const loadSingleCustomer = createAsyncThunk(
	"customer/loadSingleCustomer",
	async (id) => {
		try {
			const data = await axios.get(`customer/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const loadSingleCustomerEcom = createAsyncThunk(
	"customer/loadSingleCustomerEcom",

	async () => {
		try {
			const id = localStorage.getItem("id");
			const data = await axios.get(`e-commerce/profile/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const loadAllCustomer = createAsyncThunk(
	"customer/loadAllCustomer",
	async (arg) => {
		try {
			const query = queryGenerator(arg);
			const { data } = await axios.get(`customer?${query}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const addUser = createAsyncThunk("customer/addUser", async (values) => {
	try {
		const { data } = await axios({
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `customer/login`,
			data: {
				...values,
			},
		});
		// localStorage.setItem("access-token", data.token);
		// localStorage.setItem("role", data.role);
		// localStorage.setItem("user", data.username);
		// localStorage.setItem("id", data.id);
		// localStorage.setItem("isLogged", true);
		toast.success(" Login Successfully Done");
		return {
			data,
			message: "success",
		};
	} catch (error) {
		console.log(error.message);
		toast.error("Incorrect Username or Password !");
		return "error";
	}
});

const customerSlice = createSlice({
	name: "customer",
	initialState,
	reducers: {
		clearCustomer: (state) => {
			state.customer = null;
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for loadAllCustomer ======

		builder.addCase(loadAllCustomer.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllCustomer.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload?.getAllCustomer;
			state.total = action.payload?.totalCustomerl;
		});

		builder.addCase(loadAllCustomer.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for addCustomer ======

		builder.addCase(addCustomer.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addCustomer.fulfilled, (state, action) => {
			state.loading = false;
		});

		builder.addCase(addCustomer.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleCustomer ======

		builder.addCase(loadSingleCustomer.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleCustomer.fulfilled, (state, action) => {
			state.loading = false;
			state.customer = action.payload.data;
		});

		builder.addCase(loadSingleCustomer.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleCustomerEcom ======

		builder.addCase(loadSingleCustomerEcom.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleCustomerEcom.fulfilled, (state, action) => {
			state.loading = false;
			state.customer = action.payload.data;
		});

		builder.addCase(loadSingleCustomerEcom.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 4) ====== builders for deleteCustomer ======

		builder.addCase(deleteCustomer.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteCustomer.fulfilled, (state, action) => {
			state.loading = false;

			const filterCustomer = state.list.filter(
				(cust) => cust.id !== parseInt(action.payload.id) && cust
			);

			state.list = filterCustomer;
		});

		builder.addCase(deleteCustomer.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default customerSlice.reducer;
export const { clearCustomer } = customerSlice.actions;
