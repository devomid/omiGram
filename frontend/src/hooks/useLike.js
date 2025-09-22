import { GeneralState } from "../contexts/GeneralContext";

export const useLike = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const { mode } = GeneralState();
  const likePostApi = mode === 'dev' ? process.env.REACT_APP_DEV_LIKE_POST_API : process.env.REACT_APP_DEP_LIKE_POST_API;

  const likeAPost = async (postId) => {
    console.log(user);
    try {
      const response = await fetch(`${likePostApi}${postId}`, {
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
  return { likeAPost };
};
