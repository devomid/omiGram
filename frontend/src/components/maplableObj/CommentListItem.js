import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Avatar, Box, Button, Dropdown, IconButton, Menu, MenuButton, MenuItem, Skeleton, Typography } from '@mui/joy';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneralState } from '../../contexts/GeneralContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCommentLikeUnlike } from '../../hooks/useCommentLikeUnlike';
import ReplyListItem from './ReplyListItem';
import CommentDeleteModal from '../comment/CommentDeleteModal';
import CommentEditModal from '../comment/CommentEditModal';

const CommentListItem = ({ post, comment, setCommentModalOpen }) => {
  const { user } = useAuthContext();
  const { likeAComment, unlikeAComment } = useCommentLikeUnlike();
  const { mode, fetchReply, setFetchReply, commentOwnerUsername, setCommentOwnerUsername, commentOwner, setCommentOwner, commentId, setCommentId, isReply, setIsReply, openReplies, setOpenReplies, isCommentLikeLoading, setIsCommentLikeLoading, isCommentUnlikeLoading, setIsCommentUnlikeLoading, commentLikeChange, setCommentLikeChange, commentUnlikeChange, setCommentUnlikeChange, replyLikeChange, replyUnlikeChange } = GeneralState();
  const [replies, setReplies] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [commentReplies, setCommentReplies] = useState({});
  const [like, setLike] = useState(false);
  const [unlike, setUnlike] = useState(false);
  const navigate = useNavigate();
  const [commentEditModalOpen, setCommentEditModalOpen] = useState(false);
  const [commentDeleteModalOpen, setCommentDeleteModalOpen] = useState(false);

  const getCommentApi = mode === 'dev' ? process.env.REACT_APP_DEV_GET_COMMENT_API : process.env.REACT_APP_DEP_GET_COMMENT_API;

  const replyHandler = () => {
    setIsReply(true);
    setCommentId(comment._id);
    setCommentOwner(comment.commentWriter._id);
    setCommentOwnerUsername(comment.commentWriter.username)
  };

  const fetchCommentReplies = async () => {
    setIsLoading(true);
    console.log('fetching');
    try {
      const response = await fetch(`${getCommentApi}${ post._id }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const allReplies = await response.json();
        setReplies(allReplies);
        console.log(allReplies);
      }
    } catch (error) {
      console.log('snack:', error);
    }
    setFetchReply(!fetchReply)
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCommentReplies();
  }, []);

  useEffect(() => {
    fetchCommentReplies();
  }, [replyLikeChange, replyUnlikeChange]);


  const toggleReply = (commentId) => {
    setOpenReplies(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  const navigateToProfile = () => {
    setCommentModalOpen(false)
    navigate(`/${comment.commentWriter.username}`)
  };

  const handleLike = async () => {
    await likeAComment(comment._id);
    setCommentLikeChange(!commentLikeChange);
  };

  const handleUnLike = async () => {
    await unlikeAComment(comment._id);
    setCommentUnlikeChange(!commentUnlikeChange);
  };

  useEffect(() => {
    if (comment.likes.length > 0) {
      comment.likes.map((like) => {
        if (like.username === user.user.username) {
          setLike(true)
        } else if (like === user.user._id) {
          setLike(true)
        } else {
          setLike(false)
        }
      });
    } else setLike(false)

    if (comment.unlikes.length > 0) {
      comment.unlikes.map((unlike) => {
        if (unlike.username === user.user.username) {
          setUnlike(true)
        } else if (unlike === user.user._id) {
          setUnlike(true)
        } else {
          setLike(false)
        }
      });
    } else setUnlike(false)
  }, [comment.likes, comment.unlikes]);

  return (
    <Box sx={{ minWidth: '300px', m: 0.5, borderRadius: 'xl', /* '&:hover': { bgcolor: '#38B2AC' }, */ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
      <CommentDeleteModal comment={comment} commentDeleteModalOpen={commentDeleteModalOpen} setCommentDeleteModalOpen={setCommentDeleteModalOpen} />
      {/* <CommentEditModal comment={comment} commentEditModalOpen={commentEditModalOpen} setCommentEditModalOpen={setCommentEditModalOpen} /> */}

      <Box sx={{ ml: 1, display: 'flex', width: '98%', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box onClick={navigateToProfile} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', }}>

          {isLoading ? (
            <Skeleton sx={{ mt: 0.5 }} animation="wave" variant="circular" width={48} height={48} />
          ) : (
            <Avatar color='primary' variant='plain' size='lg' src={comment.commentWriter.src} />
          )}
          {isLoading ? (
            <Skeleton animation="wave" variant="text" sx={{ width: 120, ml: 1 }} />
          ) : (
            <Typography level="title-md" ><b>{comment.commentWriter.username}</b></Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', m: 1 }}>
          {isLoading ? (
            <Typography sx={{ overflow: 'hidden', mr: 1 }}>
              <Skeleton animation="wave">RRR</Skeleton>
            </Typography>
          ) : (
            <Button loading={isCommentLikeLoading} variant='plain' color={like ? 'danger' : 'primary'} onClick={handleLike}>{like ? <Favorite /> : <FavoriteBorder />}</Button>
          )}
          {isLoading ? (
            <Typography sx={{ overflow: 'hidden', mr: 1 }}>
              <Skeleton animation="wave">RRR</Skeleton>
            </Typography>
          ) : (
            <Button loading={isCommentUnlikeLoading} variant='plain' color={unlike ? 'warning' : 'primary'} onClick={handleUnLike}>{unlike ? <HeartBrokenIcon /> : <HeartBrokenOutlinedIcon />}</Button>
          )}
          {isLoading ? (
            <Typography sx={{ overflow: 'hidden' }}>
              <Skeleton animation="wave">RRR</Skeleton>
            </Typography>
          ) : (
            < Dropdown >
              <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'primary' } }}>
                <MoreVertOutlinedIcon />
              </MenuButton>
              {comment.commentWriter.username === user.user.username ? (
                <Menu sx={{ zIndex: 1300, backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }} placement="bottom-end">
                  <MenuItem  >
                    <ModeEditOutlineOutlinedIcon />
                    <Typography sx={{ ml: 3, mr: 2 }}>Edit</Typography>
                  </MenuItem>
                  <MenuItem color='danger' onClick={() => setCommentDeleteModalOpen(true)} >
                    <DeleteForeverOutlinedIcon />
                    <Typography color='danger' sx={{ ml: 3, mr: 2 }}>Delete</Typography>
                  </MenuItem>
                </Menu>
              ) : (
                <Menu sx={{ zIndex: 1300, backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }} placement="bottom-end">
                  <MenuItem /* onClick={handleEditClick} */>
                    <ModeEditOutlineOutlinedIcon />
                    <Typography sx={{ ml: 3, mr: 2 }}>hi</Typography>
                  </MenuItem>
                  <MenuItem color='danger' /* onClick={handleDeleteClick} */>
                    <DeleteForeverOutlinedIcon />
                    <Typography color='danger' sx={{ ml: 3, mr: 2 }}>bye</Typography>
                  </MenuItem>
                </Menu>
              )}
            </Dropdown >
          )}


        </Box>
      </Box>

      <Box sx={{ alignItems: 'flex-start', width: 450, mb: 1.5, ml: 2.5, textAlign: 'start' }}>
        {isLoading ? (
          <Typography color='primary' sx={{ overflow: 'hidden' }}>
            <Skeleton animation="wave">{comment.commentBody}</Skeleton>
          </Typography>
        ) : (
          <Typography sx={{ color: 'black' }} level="body-md" >{comment.commentBody}</Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', width: '98%', alignItems: 'center', justifyContent: 'space-between', mb: 1, ml: 1 }}>
        <Box sx={{ ml: 1 }}>
          {isLoading ? (
            <Typography color='primary' sx={{ overflow: 'hidden' }}>
              <Skeleton animation="wave">{formatDistanceToNow(new Date(comment.createdAt))}</Skeleton>
            </Typography>
          ) : (
            <Typography color='primary' level="body-xs">{formatDistanceToNow(new Date(comment.createdAt))}</Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mr: 2 }}>
          {comment.replyCount > 0 && (
            <Button onClick={() => { toggleReply(comment._id) }} variant="plain">
              {isLoading ? (
                <Typography color='primary' sx={{ overflow: 'hidden' }}>
                  <Skeleton animation="wave">`view ${comment.replyCount} replies`</Skeleton>
                </Typography>
              ) : (
                <Typography color='primary(900)' level="body-xs" >
                  {openReplies[comment._id] ? (
                    `Close replies`
                  ) : (
                    `view ${comment.replyCount} replies`
                  )}
                </Typography>
              )}
            </Button>
          )}
          <Button onClick={replyHandler} variant="plain">
            {isLoading ? (
              <Typography sx={{ overflow: 'hidden' }}>
                <Skeleton animation="wave">Reply</Skeleton>
              </Typography>
            ) : (
              <Typography sx={{ textShadow: '0 0 0.5px primary' }} color='primary.' level="body-xs" >Reply</Typography>
            )}
          </Button>
        </Box>
      </Box>

      {openReplies[comment._id] && (
        <Box >
          {replies && replies.map((reply) => {
            if (reply.parentComment && reply.parentComment._id === comment._id) {
              return (
                <ReplyListItem reply={reply} comment={comment} setCommentModalOpen={setCommentModalOpen} replies={replies} key={reply.parentComment._id} />
              );
            }
            return null;
          })}
        </Box>
      )}
    </Box>
  )
}

export default CommentListItem




