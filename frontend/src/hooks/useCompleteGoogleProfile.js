import { useContext } from "react";
import { AuthContext } from '../contexts/AuthContext.js';
import { GeneralState } from "../contexts/GeneralContext.js";


export const useGoogleCompleteProfile = () => {
  const { dispatch, user } = useContext(AuthContext);
  const { mode } = GeneralState();
  const googleCompleteApi = mode === 'dev' ? process.env.REACT_APP_DEV_AUTH_COMPLELETE_API : process.env.REACT_APP_DEP_AUTH_COMPLELETE_API;
  const googleSuccessApi = mode === 'dev' ? process.env.REACT_APP_DEV_AUTH_SUCCESS_API : process.env.REACT_APP_DEP_AUTH_SUCCESS_API;
  
  // console.log(user.user.email);

  const googleComplete = async function (username, birthDate, phoneNumber, password) {
    // console.log('siginup');
    const userEmail = user.user.email

    try {
      const response = await fetch(googleCompleteApi, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Accept:
            'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ userEmail, username, birthDate, phoneNumber, password })
      })
      const json = await response.json();
      console.log(json);

      const newResponse = await fetch(googleSuccessApi, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Accept:
            'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        }
      });
      const data = await newResponse.json();
      localStorage.setItem('user', JSON.stringify(data));
      dispatch({
        type: 'UPDATE_USER',
        payload: data
      });

    } catch (error) {
      console.log(error);
    }
  }

  return { googleComplete };
};