import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
	list: null,
	color: null,
	error: "",
	loading: false,
	total: 0,
};

export const loadAllColor = createAsyncThunk("color/loadAllColor", async () => {
	try {
		const { data } = await axios.get(`product-colors?query=all`);
		return data;
	} catch (error) {
		console.log(error.message);
	}
});

export const loadColorPaginated = createAsyncThunk(
	"color/loadColorPaginated",
	async (arg) => {
		try {
			const query = queryGenerator(arg);
			const { data } = await axios.get(`product-colors?${query}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const addSingleColor = createAsyncThunk(
	"color/addSingleColor",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				url: `product-colors/`,
				data: values,
			});
			toast.success("Color Added");
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

export const loadSingleColor = createAsyncThunk(
	"color/loadSingleColor",
	async (id) => {
		try {
			const { data } = await axios.get(`product-colors/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const addManyColor = createAsyncThunk(
	"color/addManyColor",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				url: `product-colors?query=createmany`,
				data: values,
			});
			toast.success("Colors Added");
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

export const updateColor = createAsyncThunk(
	"color/updateColor",
	async (id, values) => {
		try {
			const { data } = await axios({
				method: "put",
				url: `product-colors/${id}`,
				data: values,
			});
			toast.success("Color updated");
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

// DELETE_color
export const deleteColor = createAsyncThunk("color/DeleteColor", async (id) => {
	try {
		const resp = await axios({
			method: "PATCH",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `/product-color/${id}`,
			data: {
				status: false,
			},
		});

		return resp.data.id;
	} catch (error) {
		console.log(error.message);
	}
});

const colorSlice = createSlice({
	name: "color",
	initialState,
	reducers: {
		clearColor: (state) => {
			state.color = null;
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for loadAllColor ======

		builder.addCase(loadAllColor.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllColor.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(loadAllColor.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
		// 1) ====== builders for loadColorPaginated ======

		builder.addCase(loadColorPaginated.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadColorPaginated.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload?.getAllProductColor;
			state.total = action.payload?.totalProductColor;
		});

		builder.addCase(loadColorPaginated.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for addSingleColor ======

		builder.addCase(addSingleColor.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addSingleColor.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.unshift(action.payload);
			state.list = list;
		});

		builder.addCase(addSingleColor.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleColor ======

		builder.addCase(loadSingleColor.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleColor.fulfilled, (state, action) => {
			state.loading = false;
			state.color = action.payload;
		});

		builder.addCase(loadSingleColor.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for addManyColor ======

		builder.addCase(addManyColor.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addManyColor.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			action.payload.map((item) => {
				list.unshift(item);
			});

			state.list = list;
		});

		builder.addCase(addManyColor.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 4) ====== builders for updateColor ======

		builder.addCase(updateColor.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(updateColor.fulfilled, (state, action) => {
			state.loading = false;
			state.color = action.payload.data;
		});

		builder.addCase(updateColor.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
		// 4) ====== builders for deleteVatTax ======

		builder.addCase(deleteColor.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteColor.fulfilled, (state, action) => {
			state.loading = false;
			const filtercategory = state.list.filter(
				(color) => color.id !== parseInt(action.payload) && color
			);

			state.list = filtercategory;
		});

		builder.addCase(deleteColor.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default colorSlice.reducer;
export const { clearColor } = colorSlice.actions;
