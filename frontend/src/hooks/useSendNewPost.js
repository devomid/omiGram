import { GeneralState } from "../contexts/GeneralContext";
import { useAuthContext } from "./useAuthContext";

export const useSendNewPost = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { mode } = GeneralState();

  const newPostApi = mode === 'dev' ? process.env.REACT_APP_DEV_NEW_POST_API : process.env.REACT_APP_DEP_NEW_POST_API;


  const sendNewPost = async (formData) => {
    try {
      const response = await fetch(newPostApi, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const jsonRes = await response.json()
      } else {
        return
      }
    } catch (error) {
      console.log(error);
    }
  }
  return { sendNewPost };
};
