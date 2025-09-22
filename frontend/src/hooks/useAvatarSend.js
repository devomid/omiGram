import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { GeneralState } from "../contexts/GeneralContext";

export const useAvatarSend = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const { mode } = GeneralState();
  
  const avatarApi = mode === 'dev' ? process.env.REACT_APP_DEV_AVATAR_API : process.env.REACT_APP_DEP_AVATAR_API;
  
  const avatarSend = async (formData) => {
    try {
      const response = await fetch(avatarApi, {
        method: 'POST',
        body: formData
      });
      const jsonRes = await response.json()
      console.log('user with avatar', jsonRes);
      if (jsonRes.ok) {
        const user = jsonRes.user
        localStorage.setItem('userAvatar', JSON.stringify(user));
        dispatch({
          type: 'UPDATE_USER',
          payload: user
        });

        navigate('/')
        console.log('user in avatar hook:', user);
      } else {
        console.log('no');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return { avatarSend };
};






