import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Avatar, Badge, Box, Button, Dropdown, IconButton, Menu, MenuButton, MenuItem, Stack, Typography } from '@mui/joy';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneralState } from '../../contexts/GeneralContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLike } from '../../hooks/useLike';
import { useUnlike } from '../../hooks/useUnlike';
import PostDeleteModal from '../Profile/PostDeleteModal';
import PostEditModal from '../Profile/PostEditModal';
import CommentModal from '../comment/CommentModal';


const PostListItem = ({ post, fetchUserPosts, setDeleteSnackOpen, setEditSnackOpen }) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const { user } = useAuthContext();
  const { likeAPost } = useLike();
  const { unlikeAPost } = useUnlike();
  const { mode, comments, setComments, isPostUnlikeLoading, setIsPostUnlikeLoading, isPostLikeLoading, setIsPostLikeLoading, posts, setPosts, likeChange, setLikeChange, unlikeChange, setUnlikeChange } = GeneralState();
  const [like, setLike] = useState(false);
  const [unlike, setUnlike] = useState(false);
  const [isTextShow, setIsTextShow] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [deletePostOpen, setDeletePostOpen] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [street, setStreet] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const navigate = useNavigate();

  const getLocation = async () => {
    if (post.location) {
      if (post.location.latitude && post.location.longitude) {
        const lat = post.location.latitude
        const lon = post.location.longitude
        console.log('lat & lon:', lat, lon);
        const { data } = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`);
        const locCountry = data.features[0].properties.country
        const locCity = data.features[0].properties.city
        const locNeighbourhood = data.features[0].properties.neighbourhood;
        const locStreet = data.features[0].properties.street;
        setCountry(locCountry);
        setCity(locCity);
        setNeighbourhood(locNeighbourhood);
        setStreet(locStreet);
        console.log('lat & lon:', lat, lon, locCountry, locCity, locNeighbourhood, locStreet);
      }
    }
  };

  const handleLessAndMore = () => {
    if (isTextShow) {
      setIsTextShow(false)
    }
    if (!isTextShow) {
      setIsTextShow(true)
    }
  };

  const handleEditClick = () => {
    setEditPostOpen(true)
  };

  const handleDeleteClick = () => {
    setDeletePostOpen(true)
  };

  const handleLike = async () => {
    await likeAPost(post._id);
    setLikeChange(!likeChange);
  };
  const handleUnLike = async () => {
    await unlikeAPost(post._id);
    setUnlikeChange(!unlikeChange);
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (post.likes.length > 0) {
      post.likes.map((like) => {
        if (like.username === user.user.username) {
          setLike(true)
        } else if (like === user.user._id) {
          setLike(true)
        } else {
          setLike(false)
        }
      });
    }
    if (post.unlikes.length > 0) {
      post.unlikes.map((unlike) => {
        if (unlike.username === user.user.username) {
          setUnlike(true)
        } else if (unlike === user.user._id) {
          setUnlike(true)
        } else {
          setLike(false)
        }
      });
    }
  }, [post.likes]);


  return (
    <Box sx={{ mr: 3, ml: 3, mt: 5, p: 2, borderRadius: 'xl', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, p: 1, background: 'none' }}>
        <Stack sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar color="primary" size="lg" variant="plain" src={post.author.avatar} />
            <Typography sx={{ mt: 1 }} level='title-lg' >{post.author.username}</Typography>
          </Box>
          <Box sx={{ width: 400, display: 'flex', justifyContent: 'start' }}>
            {country || city || neighbourhood || street ? (
              <Typography level='body-xs' sx={{ ml: 1 }}>
                {country && `${country} - `} {city && `${city} - `} {neighbourhood && `${neighbourhood} - `} {street && `${street}`}
              </Typography>
            ) : (
              <Typography level='body-xs' sx={{ ml: 2 }}>Post has no location</Typography>
            )}
          </Box>
        </Stack>
        <Stack sx={{ alignItems: 'flex-end', width: 390 }}>
          <Dropdown>
            <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}>
              <MoreVertOutlinedIcon />
            </MenuButton>
            {user.user.username === post.author.username ? (
              <Menu placement="bottom-end">
                <MenuItem onClick={handleEditClick}>
                  <ModeEditOutlineOutlinedIcon />
                  <Typography sx={{ ml: 3, mr: 2 }}>Edit Post</Typography>
                </MenuItem>
                <MenuItem color='danger' onClick={handleDeleteClick}>
                  <DeleteForeverOutlinedIcon />
                  <Typography color='danger' sx={{ ml: 3, mr: 2 }}>Delete Post</Typography>
                </MenuItem>
              </Menu>
            ) : (
              <Menu placement="bottom-end">
                <MenuItem onClick={() => navigate(`/${post.author.username}`)}>
                  <AccountCircleOutlinedIcon />
                  <Typography sx={{ ml: 3, mr: 2 }}>Profile</Typography>
                </MenuItem>
                <MenuItem>
                  <ShareOutlinedIcon />
                  <Typography sx={{ ml: 3, mr: 2 }}>Share</Typography>
                </MenuItem>
              </Menu>
            )}
          </Dropdown>
        </Stack>
      </Box >

      <Box >
        <img width="100%" height="auto" style={{ borderRadius: "1rem", border: '1px solid rgba(209, 213, 219, 0.3)' }} src={post.postPicture} />
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <Button loading={isPostLikeLoading} variant='plain' color={like ? 'danger' : 'primary'} onClick={handleLike}>{like ? <Favorite /> : <FavoriteBorder />}</Button>
            <Button loading={isPostUnlikeLoading} variant='plain' color={unlike ? 'warning' : 'primary'} onClick={handleUnLike}>{unlike ? <HeartBrokenIcon /> : <HeartBrokenOutlinedIcon />}</Button>
            <Button sx={{ mr: 1 }} onClick={() => setCommentModalOpen(true)} variant='plain' color='primary'>
              <Badge badgeContent={comments[post._id] && comments[post._id].length} max={99} variant="plain" size="sm" color="primary">
                <ChatBubbleOutlineOutlinedIcon />
              </Badge>
            </Button>
            <Button variant='plain' color='primary' onClick={() => { console.log(post._id); }} ><ShareOutlinedIcon /></Button>
          </Box >
          <Typography sx={{ mr: 2, textShadow: '0 0 0.5px black' }} color='primary' level='body-sm' >{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</Typography>
        </Box >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', ml: 2, mb: 2 }}>
          {post.likes.length > 0 ? (<Typography color='primary' level='body-sm' sx={{ mr: 1, textShadow: '0 0 0.5px black' }}>{post.likes.length} Likes </Typography>) : (<Typography color='primary' level='body-sm' sx={{ mr: 1, textShadow: '0 0 0.5px black' }}>No likes yet </Typography>)}
          <Typography color='primary' level='body-sm' sx={{ mr: 1, textShadow: '0 0 0.5px black' }}> and </Typography>
          {post.unlikes.length > 0 ? (<Typography sx={{ textShadow: '0 0 0.5px black' }} color='primary' level='body-sm'>{post.unlikes.length} Unlikes</Typography>) : (<Typography sx={{ textShadow: '0 0 0.5px black' }} color='primary' level='body-sm'> No unlikes yet</Typography>)}
        </Box>
      </Box >
      <Box Box sx={{ m: 1, display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', textAlign: 'start' }}>
        <Box sx={{ width: 550 }}><Typography color='black' noWrap={isTextShow ? false : true} level='body-lg' >{post.postBody}</Typography></Box>
        <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleLessAndMore}>{isTextShow ? (<ExpandLessOutlinedIcon />) : (<ExpandMoreOutlinedIcon />)}</IconButton>
      </Box >
      <CommentModal post={post} commentModalOpen={commentModalOpen} setCommentModalOpen={setCommentModalOpen} />
      <PostEditModal post={post} editPostOpen={editPostOpen} setEditPostOpen={setEditPostOpen} fetchUserPosts={fetchUserPosts} setEditSnackOpen={setEditSnackOpen} />
      <PostDeleteModal post={post} deletePostOpen={deletePostOpen} setDeletePostOpen={setDeletePostOpen} fetchUserPosts={fetchUserPosts} setDeleteSnackOpen={setDeleteSnackOpen} />
    </Box >
  )
}

export default PostListItem

