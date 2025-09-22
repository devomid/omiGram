import { createContext, useContext, useState } from 'react';

const GeneralContext = createContext();

const GeneralProvider = ({ children }) => {
  const [mode, setMode] = useState('dev');
  const [loginOpen, setLoginOpen] = useState(true);
  const [signupOpen, setSignupOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [ominnectModal, setOminnectModal] = useState(false);
  const [notification, setNotification] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [selectedChatCompare, setSelectedChatCompare] = useState([]);
  const [commentOwner, setCommentOwner] = useState();
  const [commentId, setCommentId] = useState();
  const [isReply, setIsReply] = useState(false);
  const [fetchReply, setFetchReply] = useState(false);
  const [commentOwnerUsername, setCommentOwnerUsername,] = useState();
  const [openReplies, setOpenReplies] = useState({});
  const [parentReply, setParentReply] = useState();
  const [likeChange, setLikeChange] = useState(false);
  const [unlikeChange, setUnlikeChange] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isPostLikeLoading, setIsPostLikeLoading] = useState(false);
  const [isPostUnlikeLoading, setIsPostUnlikeLoading] = useState(false);
  const [isCommentLikeLoading, setIsCommentLikeLoading] = useState(false);
  const [isCommentUnlikeLoading, setIsCommentUnlikeLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [commentLikeChange, setCommentLikeChange] = useState(false);
  const [commentUnlikeChange, setCommentUnlikeChange] = useState(false);
  const [replyLikeChange, setReplyLikeChange] = useState(false);
  const [replyUnlikeChange, setReplyUnlikeChange] = useState(false);
  const [tempUser, setTempUser] = useState();

  return (
    <GeneralContext.Provider value={{
      mode, setMode,
      loginOpen, setLoginOpen,
      signupOpen, setSignupOpen,
      msgs, setMsgs,
      socketConnected, setSocketConnected,
      selectedChat, setSelectedChat,
      chats, setChats,
      ominnectModal, setOminnectModal,
      notification, setNotification,
      fetchAgain, setFetchAgain,
      selectedChatCompare, setSelectedChatCompare,
      commentOwner, setCommentOwner,
      commentId, setCommentId,
      isReply, setIsReply,
      fetchReply, setFetchReply,
      commentOwnerUsername, setCommentOwnerUsername,
      openReplies, setOpenReplies,
      parentReply, setParentReply,
      likeChange, setLikeChange,
      posts, setPosts,
      unlikeChange, setUnlikeChange,
      isPostLikeLoading, setIsPostLikeLoading,
      isPostUnlikeLoading, setIsPostUnlikeLoading,
      isCommentLikeLoading, setIsCommentLikeLoading,
      isCommentUnlikeLoading, setIsCommentUnlikeLoading,
      comments, setComments,
      commentLikeChange, setCommentLikeChange,
      commentUnlikeChange, setCommentUnlikeChange,
      replyLikeChange, setReplyLikeChange,
      replyUnlikeChange, setReplyUnlikeChange,
      tempUser, setTempUser
    }}>
      {children}
    </GeneralContext.Provider>
  )
};

export const GeneralState = () => {
  return useContext(GeneralContext);
};

export default GeneralProvider