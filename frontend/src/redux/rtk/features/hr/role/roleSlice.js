import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryGenerator from "../../../../../utils/queryGenarator";

const initialState = {
	list: null,
	role: null,
	error: "",
	loading: false,
	total: 0,
};

export const loadAllRole = createAsyncThunk("role/loadAllRole", async () => {
	try {
		const { data } = await axios.get(`role?query=all`);
		return data;
	} catch (error) {
		console.log(error.message);
	}
});

export const loadRolePaginated = createAsyncThunk(
	"role/loadRolePaginated",
	async (arg) => {
		try {
			const query = queryGenerator(arg);
			const { data } = await axios.get(`role?${query}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const addSingleRole = createAsyncThunk(
	"role/addSingleRole",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				url: `role/`,
				data: values,
			});
			toast.success("Role Added");
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

export const loadSingleRole = createAsyncThunk(
	"role/loadSingleRole",
	async (id) => {
		try {
			const { data } = await axios.get(`role/${id}`);
			return data;
		} catch (error) {
			console.log(error.message);
		}
	}
);

export const addManyRole = createAsyncThunk(
	"role/addManyRole",
	async (values) => {
		try {
			const { data } = await axios({
				method: "post",
				url: `role?query=createmany`,
				data: values,
			});
			toast.success("Roles Added");
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

export const updateRole = createAsyncThunk(
	"role/updateRole",
	async (id, values) => {
		try {
			const { data } = await axios({
				method: "put",
				url: `role/${id}`,
				data: values,
			});
			toast.success("Role updated");
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

// DELETE_Role
export const deleteRole = createAsyncThunk("role/DeleteRole", async (id) => {
	try {
		const resp = await axios({
			method: "delete",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `/role/${id}`,
			data: {
				status: false,
			},
		});

		return resp.data.id;
	} catch (error) {
		console.log(error.message);
	}
});

const roleSlice = createSlice({
	name: "role",
	initialState,
	reducers: {
		clearRole: (state) => {
			state.role = null;
		},
	},
	extraReducers: (builder) => {
		// 1) ====== builders for loadAllRole ======

		builder.addCase(loadAllRole.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadAllRole.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload.getAllRole;
		});

		builder.addCase(loadAllRole.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
		// 1) ====== builders for loadRolePaginated ======

		builder.addCase(loadRolePaginated.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadRolePaginated.fulfilled, (state, action) => {
			state.loading = false;
			state.list = action.payload?.getAllRole;
			state.total = action.payload?.totalRole;
		});

		builder.addCase(loadRolePaginated.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 2) ====== builders for addSingleRole ======

		builder.addCase(addSingleRole.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addSingleRole.fulfilled, (state, action) => {
			state.loading = false;

			if (!Array.isArray(state.list)) {
				state.list = [];
			}
			const list = [...state.list];
			list.unshift(action.payload);
			state.list = list;
		});

		builder.addCase(addSingleRole.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for loadSingleRole ======

		builder.addCase(loadSingleRole.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(loadSingleRole.fulfilled, (state, action) => {
			state.loading = false;
			state.role = action.payload;
		});

		builder.addCase(loadSingleRole.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 3) ====== builders for addManyRole ======

		builder.addCase(addManyRole.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(addManyRole.fulfilled, (state, action) => {
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

		builder.addCase(addManyRole.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});

		// 4) ====== builders for updateRole ======

		builder.addCase(updateRole.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(updateRole.fulfilled, (state, action) => {
			state.loading = false;
			state.role = action.payload.data;
		});

		builder.addCase(updateRole.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
		// 4) ====== builders for deleteVatTax ======

		builder.addCase(deleteRole.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(deleteRole.fulfilled, (state, action) => {
			state.loading = false;
			const filtercategory = state.list.filter(
				(role) => role.id !== parseInt(action.payload) && role
			);

			state.list = filtercategory;
		});

		builder.addCase(deleteRole.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload.message;
		});
	},
});

export default roleSlice.reducer;
export const { clearRole } = roleSlice.actions;
