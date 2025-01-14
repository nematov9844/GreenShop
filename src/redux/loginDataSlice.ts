import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  _id: string;
  name: string;
  surname: string;
  email: string;
  profile_photo: string;
  user_type: string;
  photoURL?: string;
  // qo'shimcha kerakli fieldlarni qo'shish mumkin
}

interface LoginState {
  loginData: UserData | null;
}

const initialState: LoginState = {
  loginData: null
};

const loginDataSlice = createSlice({
  name: "loginData",
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<UserData | null>) => {
      state.loginData = action.payload;
    },
  },
});

export const { setLoginData } = loginDataSlice.actions;
export default loginDataSlice.reducer; 