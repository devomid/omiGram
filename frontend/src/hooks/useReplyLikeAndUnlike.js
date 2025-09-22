import { GeneralState } from "../contexts/GeneralContext";

export const useReplyLikeAndUnlike = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { mode } = GeneralState();

  const likeReplyApi = mode === 'dev' ? process.env.REACT_APP_DEV_LIKE_REPLY_API : process.env.REACT_APP_DEP_LIKE_REPLY_API;
  const unlikeReplyApi = mode === 'dev' ? process.env.REACT_APP_DEV_UNLIKE_REPLY_API : process.env.REACT_APP_DEP_UNLIKE_REPLY_API;


  const likeAReply = async (replyId) => {
    try {
      const response = await fetch(`${likeReplyApi}${replyId}`, {
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


  const unlikeAReply = async (replyId) => {

    try {
      const response = await fetch(`${unlikeReplyApi}${replyId}`, {
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
  return { likeAReply, unlikeAReply };
};


