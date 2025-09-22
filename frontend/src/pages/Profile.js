import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/joy';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import LastRecentUsers from '../components/Home/LastRecentUsers';
import MessageRecents from '../components/Ominnect(messengerApp)/txtMsg/MessageRecents';
import Feeds from '../components/Profile/Feeds';
import Messages from '../components/Profile/Messages';
import ProfileOwnerInfo from '../components/Profile/ProfileOwnerInfo';
import ProfileOwnerInfoSkeleton from '../components/Skeleton/ProfileOwnerInfoSkeleton';
import PostListItem from '../components/maplableObj/PostListItem';
import UserListItem from '../components/maplableObj/UserListItem';
import NewPost from '../components/newPost/NewPost';
import { GeneralState } from '../contexts/GeneralContext';

const Profile = () => {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const { mode, setIsPostUnlikeLoading, setIsPostLikeLoading, posts, setPosts, likeChange, unlikeChange } = GeneralState();
  const [deleteSnackOpen, setDeleteSnackOpen] = useState(false);
  const [editSnackOpen, setEditSnackOpen] = useState(false);
  const [profileOwner, setProfileOwner] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { username } = useParams();

  const homeApi = mode === 'dev' ? process.env.REACT_APP_DEV_HOME_API : process.env.REACT_APP_DEP_HOME_API;
  const getUserPostsApi = mode === 'dev' ? process.env.REACT_APP_DEPV_GET_USER_POSTS_API : process.env.REACT_APP_DEP_GET_USER_POSTS_API;


  const fetchFriends = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    const { data } = await axios.get(homeApi, config)
    setFriends(data)
    friends.map((friend => console.log(friend.username)))
  }

  useEffect(() => {
    setIsLoading(true);
    fetchFriends().then(() => {
      setIsLoading(false)
    });
  }, []);

  const fetchUserPosts = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.get(`${getUserPostsApi}${username}`, config)
    setProfileOwner(data.user);
    setPosts(data.userPosts)
  }

  useEffect(() => {
    setIsLoading(true)
    fetchUserPosts().then(() => {
      setIsLoading(false)
    })
  }, []);
  useEffect(() => {
    setIsPostLikeLoading(true)
    fetchUserPosts().then(() => {
      setIsPostLikeLoading(false)
    })
  }, [likeChange]);
  useEffect(() => {
    setIsPostUnlikeLoading(true)
    fetchUserPosts().then(() => {
      setIsPostUnlikeLoading(false)
    })
  }, [unlikeChange]);

  //HIDING FAB
  const [hideFab, setHideFab] = useState(false);
  const [scrollData, setScrollData] = useState({
    y: 0,
    lastY: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollData(lastState => {
        return {
          y: window.scrollY,
          lastY: lastState.y
        }
      })
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {


    if (scrollData.lastY === scrollData.y) { // this fixes the trembling
      return;
    }

    if (scrollData.y > 500 && scrollData.y - scrollData.lastY > 0) { // scrollData.y - scrollData last > 0  this means we are scrolling UP
      setHideFab(true);
    } else {
      setHideFab(false);
    }
  }, [scrollData]);
  //


  return (
    <Box Box sx={{ width: '99.2%' }}>

      <Grid container spacing={2} columns={16} sx={{ flexGrow: 1, mt: 1 }} alignItems='center' justifyContent='center'>

        <Grid md={3.8} lg={3.8}> {/* PROFILE OWNER INFO */}
          <Box sx={{ position: 'fixed', top: 140, left: 20, borderRadius: 'xl', width: '24%', height: '82vh', display: { xs: 'none', sm: 'none', md: 'flex', justifyContent: 'center' }, backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
            {isLoading ? (<ProfileOwnerInfoSkeleton />) : (<ProfileOwnerInfo profileOwner={profileOwner} />)}
          </Box>
        </Grid>

        <Grid xs={14} sm={14} md={8} lg={8}> {/* FEED AND POSTS */}
          <Box sx={{ width: '100%' }}>
            <Stack sx={{ width: '100%', p: 1 }} direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>

              <Box sx={{ minHeight: '60%' }}>
                {isLoading ? (<Feeds />) : (posts.length > 0 && posts.map((post) => <PostListItem key={post._id} profileOwner={profileOwner} post={post} fetchUserPosts={fetchUserPosts} setDeleteSnackOpen={setDeleteSnackOpen} setEditSnackOpen={setEditSnackOpen} />))}
              </Box>
            </Stack>
          </Box>
        </Grid>

        <Grid md={3.8} lg={3.8}> {/* MESSAGES AND FRIENDS */}
          <Box sx={{ position: 'fixed', top: 140, right: 20, borderRadius: 'xl', width: '24%', height: '82vh', display: { xs: 'none', sm: 'none', md: 'flex', justifyContent: 'center', alignItems: 'start' }, flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
            <Box sx={{ width: '100%', height: '50%', display: { xs: 'none', sm: 'none', md: 'flex' } }}>
              <Box sx={{ zIndex: 1, position: 'fixed', width: '100%', height: 50, background: 'none', borderBottom: '1px solid rgba(50, 50, 50, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <Typography>My Messages</Typography>
              </Box>
              <Box sx={{ mt: 7, mb: 0.7, width: '100%', minHeight: '60%', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
                {isLoading ? (<Messages />) : (<MessageRecents />)}
              </Box>
            </Box>
            <Box sx={{ width: '100%', height: '50%', display: { xs: 'none', sm: 'none', md: 'flex' } }}>
              <Box sx={{ zIndex: 1, position: 'fixed', width: '100%', height: 50, background: 'none', borderBottom: '1px solid rgba(50, 50, 50, 0.3)', borderTop: '1px solid rgba(50, 50, 50, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography>My Friends</Typography>
              </Box>
              <Box sx={{ mt: 7, mb: 0.8, width: '100%', minHeight: '60%', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
                {isLoading ? (<LastRecentUsers />) : (friends.map((friend) => <UserListItem user={friend} key={friend._id} />))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: !hideFab ? 'flex' : 'none' }}>
        <Tooltip title='New Post' arrow variant="plain" color='primary'>
          <IconButton variant='solid' color='primary' onClick={() => setNewPostOpen(true)} sx={{ width: '60px', height: '60px', borderRadius: '50%', position: 'fixed', right: '28%', top: '90%', '&:hover': { bgcolor: 'white', color: '#0B6BCB' } }} >
            <AddIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <NewPost newPostOpen={newPostOpen} setNewPostOpen={setNewPostOpen} fetchUserPosts={fetchUserPosts} />
    </Box >
  )
};
export default Profile;
