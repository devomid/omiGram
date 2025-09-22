import { useContext } from "react";
import { AuthContext } from '../contexts/AuthContext.js';
import { GeneralState } from "../contexts/GeneralContext.js";

export const useSignup = () => {
  const { dispatch } = useContext(AuthContext);
  const { mode, setTempUser } = GeneralState();
  
  const signupApi = mode === 'dev' ? process.env.REACT_APP_DEV_SIGNUP_API : process.env.REACT_APP_DEP_SIGNUP_API;


  const signup = async function (username, email, password, firstName, lastName, birthDate, phoneNumber) {
    console.log('signup');

    try {
      const response = await fetch(signupApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, firstName, lastName, birthDate, phoneNumber })
      });
      console.log('this is the response: ', response);
      const json = await response.json();
      console.log('this is json: ', json);

      if (response.ok) {
        // Save the user to temp user general context because of avatar modal
        setTempUser(json)

        // Update the auth context
        dispatch({
          type: 'LOGIN',
          payload: json,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { signup };
};