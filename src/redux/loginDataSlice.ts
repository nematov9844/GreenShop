import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  _id?: string;
  name?: string;
  surname?: string;
  email?: string;
  profile_photo?: string;
  user_type?: string;
  displayName?: string;
  photoURL?: string;
  phone_number?:string;
  username?:string;
  phone?:string;
  address?:string;
  city?:string;
  country?:string;
  zip_code?:string;
}

const initialState: { loginData: UserData | null } = {
  loginData: JSON.parse(localStorage.getItem('loginData') || 'null') || {}
};

const loginDataSlice = createSlice({
  name: "loginData",
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<UserData | null>) => {
      state.loginData = action.payload;
      if (action.payload) {
        localStorage.setItem('loginData', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('loginData');
        localStorage.removeItem('access_token');
      }
    },
  },
});

export const { setLoginData } = loginDataSlice.actions;
export default loginDataSlice.reducer; 