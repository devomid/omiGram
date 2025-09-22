import Picker from '@emoji-mart/react';
import CloseIcon from '@mui/icons-material/Close';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import { Box, Dropdown, IconButton, Menu, MenuButton, Modal, Sheet, Stack, Textarea, Tooltip, Typography } from '@mui/joy';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { GeneralState } from '../../contexts/GeneralContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import CommentListItem from '../maplableObj/CommentListItem';


const CommentModal = ({ post, commentModalOpen, setCommentModalOpen }) => {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [setIsLoading] = useState(false);

  const { mode, comments, setComments, fetchReply, setFetchReply, commentOwnerUsername, commentOwner, commentId, isReply, setIsReply, parentReply, setIsCommentLikeLoading, setIsCommentUnlikeLoading, commentLikeChange, commentUnlikeChange } = GeneralState();

  const getCommentApi = mode === 'dev' ? process.env.REACT_APP_DEV_GET_COMMENT_API : process.env.REACT_APP_DEP_GET_COMMENT_API;
  const sendCommentApi = mode === 'dev' ? process.env.REACT_APP_DEV_SEND_COMMENT_API : process.env.REACT_APP_DEP_SEND_COMMENT_API;
  const replyCommentApi = mode === 'dev' ? process.env.REACT_APP_DEV_REPLY_COMMENT_API : process.env.REACT_APP_DEP_REPLY_COMMENT_API;

  const handleOpenChange = useCallback((event, isOpen) => {
    setOpen(isOpen);
  }, []);

  const addemoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setCommentBody(commentBody + emoji);
    setOpen(false);
  };

  const fetchPostComments = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    };
    try {
      const { data } = await axios.get(`${getCommentApi}${post._id}`, config);
      setComments((prevComments) => ({
        ...prevComments,
        [post._id]: data
      }));
    } catch (error) {
      console.log('snack:', error);
    }
    setIsLoading(false);
  };

  const sendCmnt = async (e) => {
    console.log('send comment');
    setIsLoading(true);
    setCommentBody('');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    };
    try {
      const { data } = await axios.post(sendCommentApi, {
        post: post._id,
        writer: user.user._id,
        commentBody
      }, config);
      // console.log(data);

    } catch (error) {
      console.log('snack:', error);
    }
    fetchPostComments();
    setIsLoading(false);
  };

  const sendReply = async (e) => {
    console.log('replying');
    setIsLoading(true);
    setCommentBody('');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    };
    try {
      const { data } = await axios.post(`${replyCommentApi}${commentId}`, {
        post: post._id,
        replyBody: commentBody,
        parentReply,
        commentOwner
      }, config);
      setIsReply(false);
    } catch (error) {
      console.log('snack:', error);
    }
    fetchPostComments();
    setFetchReply(!fetchReply);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPostComments();
  }, []);

  useEffect(() => {
    setIsCommentLikeLoading(true);
    setIsCommentUnlikeLoading(true);
    fetchPostComments().then(() => {
      setIsCommentLikeLoading(false);
      setIsCommentUnlikeLoading(false);
    });
  }, [commentLikeChange, commentUnlikeChange]);

  const SendHandler = (e) => {
    if ((e.key === 'Enter' && e.ctrlKey) || e.type === 'click') {
      if (isReply) {
        sendReply(e)
      } else {
        sendCmnt(e)
      }
    }
  }

  return (
    <Modal open={commentModalOpen} onClose={() => setCommentModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
      <Sheet variant="solid" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'space-between', width: 500, height: 650, maxWidth: 800, borderRadius: 'lg', p: 1, boxShadow: 'lg', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
        <Box sx={{ height: '84%', mb: 6, overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
          <ScrollToBottom>
            {comments[post._id] && comments[post._id].map((comment) => (<CommentListItem post={post} comment={comment} setCommentModalOpen={setCommentModalOpen} key={comment._id} />))}
          </ScrollToBottom>
        </Box>

        <Box sx={{ minHeight: '3%', position: 'relative', bottom: 0, maxHeight: '27%', width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'end', borderRadius: 'lg' }}>

          <Stack width='100%' sx={{ borderRadius: '1rem' }} >
            {isReply && (
              <Box sx={{ pl: 1, pt: 0.5, mr: 1, ml: 1, zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2, borderRadius: 'lg', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.5)' }}>
                <Typography sx={{ color: 'black' }} level='body-sm'>Replying to {commentOwnerUsername}</Typography>
                <IconButton onClick={() => setIsReply(false)} aria-label="cancel-reply"><CloseIcon /></IconButton>
              </Box>
            )}


            <Stack direction='row' width='100%'>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Dropdown open={open} onOpenChange={handleOpenChange} >
                  <MenuButton sx={{ mb: 1 }} slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral' } }}><SentimentSatisfiedOutlinedIcon color='primary' /></MenuButton>
                  <Menu sx={{ position: 'absolute', zIndex: 4000 }} placement="right">
                    <Picker icons='outline' previewPosition='none' onEmojiSelect={addemoji} onClickOutside={() => setOpen(false)} />
                  </Menu>
                </Dropdown>
              </Box>
              <Textarea sx={{ width: '85%', m: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }} onKeyDown={(e) => SendHandler(e)} value={commentBody} onChange={(e) => setCommentBody(e.target.value)} name='postBody' id='postBody' minRows={1} maxRows={6} color='primary' variant='outlined' placeholder="Your thoughts here..." size="md" />
              <Tooltip title='"Ctrl+Enter" also sends the Message' variant="outlined" size="sm" arrow placement="bottom-end" >
                <IconButton onClick={(e) => SendHandler(e)} sx={{ m: 1 }}  >{isReply ? 'Reply' : (<NorthOutlinedIcon color='primary' />)}</IconButton>
              </Tooltip>
            </Stack>
          </Stack>

        </Box>
      </Sheet >
    </Modal >

  )
}

export default CommentModal