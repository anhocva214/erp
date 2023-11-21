import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
	list: null,
	slider: null,
	error: "",
	loading: false,
};

export const createSlider = createAsyncThunk(
	"slider/createSlider",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "multipart/form-data",
				},
				url: `slider/`,
				data: values,
			});
			toast.success("Sliders Added");
			return {
				...data,
				message: "success",
			};
		} catch (error) {
			console.log(error.message);
			toast.error("Error, Check Sliders ");
			return {
				message: "error",
			};
		}
	}
);

export const getSingleSlider = createAsyncThunk(
	"slider/getSingleSlider",
	async () => {
		try {
			const data = await axios.get(`slider/${1}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const getAllSlider = createAsyncThunk(
	"slider/getAllSlider",
	async () => {
		try {
			const { data } = await axios.get(`slider?query=all`);

			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

// get All Ecom Slider
export const getAllEcomSlider = createAsyncThunk(
	"slider/getAllEcomSlider",
	async () => {
		try {
			const { data } = await axios.get(`e-commerce/slider/slider-details`);

			return data[0];
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const deleteSlider = createAsyncThunk(
	"slider/deleteSlider",
	async (id) => {
		try {
			const resp = await axios({
				method: "patch",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8",
				},
				url: `slider/${id}`,
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

const sliderSlice = createSlice({
	name: "slider",
	initialState,
	reducers: {
		clearSlider: (state) => {
			state.slider = null;
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for getAllSlider ======

		builder.addCase(getAllSlider.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getAllSlider.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(getAllSlider.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for getAllEcomSlider ======

		builder.addCase(getAllEcomSlider.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getAllEcomSlider.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload;
		});

		builder.addCase(getAllEcomSlider.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for createSlider ======

		builder.addCase(createSlider.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(createSlider.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.unshift(action.payload);
			state.list = list;
		});

		builder.addCase(createSlider.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for getSingleSlider ======

		builder.addCase(getSingleSlider.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getSingleSlider.fulfilled, (state, action) => {
			state.loading = false;
			state.slider = action.payload.data;
		});

		builder.addCase(getSingleSlider.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 4) ====== builders for deleteSlider ======

		builder.addCase(deleteSlider.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteSlider.fulfilled, (state, action) => {
			state.loading = false;

			const filterslider = state.list.filter(
				(slider) => slider.id !== parseInt(action.payload.id) && slider
			);
			state.list = filterslider;
		});

		builder.addCase(deleteSlider.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default sliderSlice.reducer;
export const { clearslider } = sliderSlice.actions;
