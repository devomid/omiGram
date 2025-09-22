import { GeneralState } from "../contexts/GeneralContext";

export const useCommentLikeUnlike = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { mode } = GeneralState();
  
  const likeApi = mode === 'dev' ? process.env.REACT_APP_DEV_LIKE_COMMENT_API : process.env.REACT_APP_DEP_LIKE_COMMENT_API;
  const unlikeApi = mode === 'dev' ? process.env.REACT_APP_DEV_UNLIKE_COMMENT_POST_API : process.env.REACT_APP_DEP_UNLIKE_COMMENT_POST_API;
  

  const likeAComment = async (commentId) => {
    try {
      const response = await fetch(`${likeApi}${commentId}`, {
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


  const unlikeAComment = async (commentId) => {

    try {
      const response = await fetch(`${unlikeApi}${commentId}`, {
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
  return { likeAComment, unlikeAComment };
};


