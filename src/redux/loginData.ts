import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateTypes {
  loginData: object | string | null; 
}

const initialState: InitialStateTypes = {
  loginData: JSON.parse(localStorage.getItem("loginData") as string) || {}, 
};

const loginSlice = createSlice({
  initialState,
  name: "login",
  reducers: {
    setLogin(state, action: PayloadAction<object | string>) {  
      state.loginData = action.payload;  
      console.log(action);
      
      localStorage.setItem("loginData", JSON.stringify(action.payload));  
    },
    outLogin(state) {
      state.loginData = null; 
      localStorage.removeItem("loginData");
      localStorage.removeItem("token");
    },
  },
});

export const { setLogin, outLogin } = loginSlice.actions;
export default loginSlice.reducer;
