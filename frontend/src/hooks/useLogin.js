import { GeneralState } from "../contexts/GeneralContext";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const { dispatch } = useAuthContext();
  const { mode } = GeneralState();
  
  const loginApi = mode === 'dev' ? process.env.REACT_APP_DEV_LOGIN_API : process.env.REACT_APP_DEP_LOGIN_API;
  

  const login = async (username, password) => {
    // console.log('sign in');
    try {
      const response = await fetch(loginApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      // console.log(response);
      const jsonResponse = await response.json();
      console.log(jsonResponse);

      if (response.ok) {
        const user = jsonResponse.user;

        localStorage.setItem('user', JSON.stringify(jsonResponse));
        localStorage.setItem('userAvatar', JSON.stringify(user));
        dispatch({
          type: 'LOGIN',
          payload: jsonResponse
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  return { login };
};

