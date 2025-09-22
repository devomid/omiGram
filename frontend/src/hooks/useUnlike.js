import { GeneralState } from "../contexts/GeneralContext";

export const useUnlike = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { mode } = GeneralState();

  const unlikeAPostApi = mode === 'dev' ? process.env.REACT_APP_DEV_UNLIKE_POST_API : process.env.REACT_APP_DEP_UNLIKE_POST_API;


  const unlikeAPost = async (postId) => {

    try {
      const response = await fetch(`${unlikeAPostApi}${postId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(user.user)
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
  return { unlikeAPost };
};
