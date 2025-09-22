import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext'
import { GeneralState } from "../contexts/GeneralContext";

const Success = () => {
  const [user, setUser] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
    const { mode } = GeneralState();
  
  const getUserDataApi = mode === 'dev' ? process.env.REACT_APP_DEV_AUTH_SUCCESS_API : process.env.REACT_APP_DEP_AUTH_SUCCESS_API;


  const getUser = async () => {
    const response = await fetch(getUserDataApi, {
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
    const data = await response.json();
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    // console.log(data);
    dispatch({
      type: 'LOGIN',
      payload: data
    })
  };

  useEffect(() => {
    getUser();
  });



  useEffect(() => {
    if (user !== null) {
      if (user.user.phoneNumber === 999999999) {
        navigate('/user/auth/google/googleComplete');
      }
      else if (user.user.phoneNumber !== 999999999) {
        navigate('/');
      }
    }
  }, [user, navigate]);
}

export default Success;