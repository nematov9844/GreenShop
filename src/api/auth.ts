import { useAxios } from "../hook/useAxios";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}


export const useAuthApi = () => {
  const axiosRequest = useAxios();

  return {
    login: (data: LoginData) => {
      return axiosRequest({ 
        url: "/user/sign-in", 
        method: "POST", 
        body: data 
      });
    },

    register: (data: RegisterData) => {
      return axiosRequest({ 
        url: "/user/sign-up", 
        method: "POST", 
        body: data 
      });
    },

    googleLogin: (email: string) => {
      return axiosRequest({ 
        url: "/user/sign-in/google", 
        method: "POST", 
        body: { email } 
      });
    }
  };
}; 