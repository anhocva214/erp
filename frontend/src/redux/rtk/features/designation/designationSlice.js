import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
	list: [],
	tota: null,
	designation: null,
	error: "",
	loading: false,
};

// ADD_DESIGNATION
export const addDesignation = createAsyncThunk(
	"designation/addDesignation",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `designation/`,
				data: {
					...values,
				},
			});
			toast.success("designation Added");
			return {
				data,
				message: "success",
			};
		} catch (error) {
			toast.error("Error in adding designation try again");
			console.log(error.message);
			return {
				message: "error",
			};
		}
	}
);

// DELETE_DESIGNATION
export const deleteDesignation = createAsyncThunk(
	"designation/deleteDesignation",
	async (id) => {
		try {
			const resp = await axios({
				method: "patch",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `designation/${id}`,
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

// DESIGNATION_DETAILS
export const loadSingleDesignation = createAsyncThunk(
	"designation/loadSingleDesignation",
	async (id) => {
		try {
			const data = await axios.get(`designation/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

// DESIGNATIONS
export const loadAllDesignation = createAsyncThunk(
	"designation/loadAllDesignation",
	async (arg) => {
		try {
			const query = queryGenerator(arg);
			const { data } = await axios.get(`designation?${query}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

const designationSlice = createSlice({
	name: "designation",
	initialState,
	reducers: {
		clearDesignation: (state) => {
			state.designation = null;
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for loadAllDesignation ======

		builder.addCase(loadAllDesignation.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllDesignation.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload?.getAllDesignation;
			state.total = action.payload?.totalDesignation;
		});

		builder.addCase(loadAllDesignation.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for addDesignation ======

		builder.addCase(addDesignation.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addDesignation.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.push(action.payload);
			state.list = list;
		});

		builder.addCase(addDesignation.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleDesignation ======

		builder.addCase(loadSingleDesignation.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleDesignation.fulfilled, (state, action) => {
			state.loading = false;
			state.designation = action.payload.data;
		});

		builder.addCase(loadSingleDesignation.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 4) ====== builders for deleteDesignation ======

		builder.addCase(deleteDesignation.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteDesignation.fulfilled, (state, action) => {
			state.loading = false;
			const filterCategory = state.list.filter(
				(category) => category.id !== parseInt(action.payload) && category
			);
			state.list = filterCategory;

			const filterDesignation = state.list.filter(
				(desig) => desig.id !== parseInt(action.payload) && desig
			);

			state.list = filterDesignation;
		});

		builder.addCase(deleteDesignation.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default designationSlice.reducer;
export const { clearDesignation } = designationSlice.actions;
