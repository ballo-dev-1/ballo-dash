import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";
import { RootState } from "..";

// State shape
interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Fetch all users
export const fetchUsers = createAsyncThunk<User[]>(
  "user/fetchUsers",
  async () => {
    const res = await fetch("/api/users");
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    console.log("user data: ", data);
    return data.users;
  }
);

// Fetch a single user
export const fetchUser = createAsyncThunk<User, string>(
  "user/fetchUser",
  async (userId) => {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();
    return data.user;
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.error = null;
    },
    setSelectedUser(state, action: PayloadAction<User>) {
      state.selectedUser = action.payload;
      state.error = null;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

// Selectors
export const selectUsers = (state: RootState) => state.user.users;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Exports
export const { setUsers, setSelectedUser, clearSelectedUser } =
  userSlice.actions;
export default userSlice.reducer;
