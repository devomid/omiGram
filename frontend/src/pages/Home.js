import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/joy';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Feeds from '../components/Home/Feeds';
import LastRecentPosts from '../components/Home/LastRecentPosts';
import LastRecentUsers from '../components/Home/LastRecentUsers';
import Messages from '../components/Home/Messages';
import MessageRecents from '../components/Ominnect(messengerApp)/txtMsg/MessageRecents';
import PostListItem from '../components/maplableObj/PostListItem';
import PostListItemSmall from '../components/maplableObj/PostListItemSmall';
import UserListItem from '../components/maplableObj/UserListItem';
import NewPost from '../components/newPost/NewPost';
import { GeneralState } from '../contexts/GeneralContext';

const Home = () => {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [profileOwner, setProfileOwner] = useState({});
  const { mode, posts, setPosts, likeChange, unlikeChange } = GeneralState();
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const getHomeApi = mode === 'dev' ? process.env.REACT_APP_DEV_HOME_API : process.env.REACT_APP_DEP_HOME_API;
  const getUserPostsApi = mode === 'dev' ? process.env.REACT_APP_DEV_FRIENDS_API : process.env.REACT_APP_DEP_FRIENDS_API;


  const fetchFriends = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    try {
      const { data } = await axios.get(getHomeApi, config)
      setFriends(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      fetchFriends().then(() => {
        setIsLoading(false)
      });
    }
  }, []);

  // this section is for fetching user's own posts and it passed to NewPost component to refresh the posts after creating a new post but beig here is a bit off and I don't know why I did that because it throws 404. for now I think it's unnecesary and commented it out.
  // const fetchUserPosts = async () => {
  //   if (user) { var username = user.user.username; }
  //   const config = {
  //     headers: {
  //       'Authorization': `Bearer ${user.token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   }
  //   try {
  //     const { data } = await axios.get(`${getHomeApi}${username}`, config)
  //     if (data) {
  //       console.log('data: ', data);
  //       setProfileOwner(data.user);
  //       setPosts(data.userPosts);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   setIsLoading(true)
  //   if (user) {
  //     fetchUserPosts().then(() => {
  //       setIsLoading(false)
  //     });
  //   }
  // }, [newPostOpen]);

  const fetchFriendsPosts = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    };
    if (friends.length > 0) {
      try {
        const { data } = await axios.get(getUserPostsApi, config)
        if (data) setFriendsPosts(data.friendsPosts[0]);
        else setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    setIsLoading(true)
    if (user && friendsPosts) {
      fetchFriendsPosts().then(() => {
        setIsLoading(false)
      })
    }
  }, [likeChange, unlikeChange]);

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
    <Box sx={{ width: '99.2%' }}>
      <Grid container spacing={2} columns={16} sx={{ flexGrow: 1, mt: 1 }} alignItems='center' justifyContent='center'>

        <Grid md={3.8} lg={3}>
          <Box sx={{ position: 'fixed', top: 125, left: 20, borderRadius: 'xl', width: '24%', height: '82vh', display: { xs: 'none', sm: 'none', md: 'flex', justifyContent: 'center', alignItems: 'start' }, flexDirection: 'column', backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
            {/* <Stack sx={{ width: '100%' }} direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}> */}
            <Box sx={{ height: '45vh', width: '100%', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
              <Box sx={{ zIndex: 1, position: 'fixed', width: '100%', height: 50, background: 'none', borderBottom: '1px solid rgba(50, 50, 50, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <Typography>My Posts</Typography>
              </Box>
              <Box sx={{ mt: 7, mb: 0.8 }} >
                {isLoading || !posts ? (
                  <LastRecentPosts />
                ) : (
                  posts && posts.length > 0 && posts.map((post) => <PostListItemSmall key={post._id} profileOwner={profileOwner} post={post} />
                  ))}
                {posts && posts.length <= 0 &&
                  <Stack sx={{ mt:'50%' }}>
                    <Typography>You have no posts yet</Typography>
                  </Stack>}
              </Box>
            </Box>
            <Box sx={{ width: '100%', height: '50%', display: { xs: 'none', sm: 'none', md: 'flex' } }}>
              <Box sx={{ zIndex: 1, position: 'fixed', height: 50, width: '100%', borderTop: '1px solid rgba(50, 50, 50, 0.3)', borderBottom: '1px solid rgba(50, 50, 50, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Typography>My Friends</Typography>
              </Box>
              <Box sx={{width:'100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 7, ml: 1, mb: 0.8, minHeight: '40%', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
                {isLoading || !friends ? (<LastRecentUsers />) : (friends && friends.length > 0 ? friends.map((friend) => (<UserListItem user={friend} key={friend._id} />)) : (
                  <Box sx={{width:'100%' }}>
                    <Typography>You have no friends yet</Typography>
                  </Box>))}
                {/* </Stack> */}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid xs={14} sm={14} md={8} lg={8}>
          <Box sx={{ width: '100%' }}>
            <Stack sx={{ width: '100%', p: 1 }} direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
              <Box sx={{ minHeight: '60%' }}>
                {isLoading ? (<Feeds />) : (friendsPosts && friendsPosts.length > 0 && friendsPosts.map((friendspost) => <PostListItem key={friendspost._id} profileOwner={profileOwner} post={friendspost} />))}
                {friendsPosts && friendsPosts.length <= 0 &&
                  <Stack sx={{ mt: '50%' }}>
                    <Typography>You have no posts yet</Typography>
                  </Stack>}
              </Box>
            </Stack>
          </Box>
        </Grid>

        <Grid md={3.8} lg={3}>
          <Box sx={{ position: 'fixed', top: 125, right: 20, borderRadius: 'xl', width: '24%', height: '82vh', display: { xs: 'none', sm: 'none', md: 'flex' }, backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
            <Box sx={{ zIndex: 1, position: 'fixed', width: '100%', height: 50, background: 'none', borderBottom: '1px solid rgba(50, 50, 50, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <Typography>My Messages</Typography>
            </Box>
            <Box sx={{ mt: 7, mb: 0.8, width: '100%', minHeight: '60%', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
              {isLoading ? (<Messages />) : (<MessageRecents />)}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: !hideFab ? 'flex' : 'none' }}>
        <Tooltip title='New Post' arrow variant="plain" color='primary'>
          <IconButton variant='solid' color='primary' onClick={() => setNewPostOpen(true)} sx={{ width: '60px', height: '60px', borderRadius: '50%', position: 'fixed', right: '26.5%', top: '89%', '&:hover': { bgcolor: 'white', color: '#0B6BCB' } }} >
            <AddIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <NewPost newPostOpen={newPostOpen} setNewPostOpen={setNewPostOpen} /* fetchUserPosts={fetchUserPosts} */ />
    </Box >
  )
}
export default Home;


