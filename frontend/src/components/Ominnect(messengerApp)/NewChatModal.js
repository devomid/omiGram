import { Avatar, Box, Button, Chip, ChipDelete, FormControl, Input, Modal, Sheet, Stack, Tab, TabList, TabPanel, Tabs, tabClasses } from '@mui/joy';
import axios from 'axios';
import Lottie from "lottie-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import radialSearch from '../../assets/animations/radialSearch.json';
import { GeneralState } from '../../contexts/GeneralContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserListItem from '../maplableObj/UserListItem';
import PuffLoader from "react-spinners/PuffLoader";


const NewChatModal = ({ newChatModal, setNewChatModal }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { mode, setSelectedChat, chats, setChats } = GeneralState();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const searchUserApi = mode === 'dev' ? process.env.REACT_APP_DEV_SEARCH_USER_API : process.env.REACT_APP_DEP_SEARCH_USER_API;
  const accessChatApi = mode === 'dev' ? process.env.REACT_APP_DEV_ACCESS_CHAT_API : process.env.REACT_APP_DEP_ACCESS_CHAT_API;
  const startChatApi = mode === 'dev' ? process.env.REACT_APP_DEV_START_CHAT_API : process.env.REACT_APP_DEP_START_CHAT_API;

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      setSearchResult([])
      setSearch('')
      return
    } else if (query) {

      try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        };
        const { data } = await axios.get(`${searchUserApi}${search}`, config)

        if (data.length < 1) {
          setIsLoading(false);
          // handleSnackOpen(transitionDown);
          setSearchResult([]);

        } else if (data.length >= 1) {
          setIsLoading(false);
          setSearchResult(data)
          return
        }

      } catch (error) {
        setErrorMsg(error);
        setErrorOpen(true);
      }
    }
  };

  const accessChat = async (receiverId) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }
      const { data } = await axios.post(accessChatApi, { receiverId }, config);
      if (!chats.find((c) => c._id === data._id)) { setChats([data, ...chats]) };
      setSelectedChat(data);
      setIsLoading(false);
      setNewChatModal(false);
    } catch (error) {
      //snackbat
    }
  }

  const close = () => {
    setNewChatModal(false)
    setSearchResult([])
    setSearch('')
  };

  const handleSubmit = async () => {
    if (!groupName || !selectedUsers) {
      console.log('Please all fields');
      return;
    };
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post(startChatApi, {
        name: groupName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      }, config);

      setChats([data, ...chats]);
      setNewChatModal(false)
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      console.log('user already added');
      return
    }
    setSelectedUsers([...selectedUsers, userToAdd])
  };

  const removeChip = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id))
  };


  return (
    <Box >
      <Modal open={newChatModal} onClose={close} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Sheet variant="solid" sx={{ width: 350, height: 600, maxWidth: 800, borderRadius: 'lg', p: 3, boxShadow: 'lg', backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>

            <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: 'transparent', height: 50 }}>

              <TabList disableUnderline sx={{ alignSelf: 'center', width: 247, p: 0.5, gap: 0.5, borderRadius: 'xl', bgcolor: 'rgba(255, 255, 255, 0.3)', [`& .${tabClasses.root}[aria-selected="true"]`]: { boxShadow: 'sm', bgcolor: 'background.surface' } }}>
                <Tab disableIndicator>Direct Chat</Tab>
                <Tab disableIndicator>Group Chat</Tab>
              </TabList>

              <TabPanel value={0}> {/* SINGLE CHAT */}
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ mb: 2 }}>
                    <FormControl id="sigle-user-search">
                      <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px) saturate(180%)' }} error={errorOpen} placeholder="Search user..." type="search" onChange={(e) => handleSearch(e.target.value)} />
                    </FormControl>
                  </Box>
                  <Box sx={{ overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? (
                      // <CircularProgress color="neutral" size="lg" value={65} variant="soft" />
                      <PuffLoader color="#7fddfa" size={100} cssOverride={null} speedMultiplier={0.8} />
                    ) : (
                      searchResult.map(result => (<UserListItem key={result._id} user={result} handleFunction={() => accessChat(result._id)} />))
                    )}
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={1}> {/* GROUP CHAT */}
                <Stack>
                  <Stack spacing={2}>
                    <FormControl id="group-name">
                      <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px) saturate(180%)',  }} placeholder="Group Name" variant="outlined" onChange={(e) => setGroupName(e.target.value)} />
                    </FormControl>
                    <FormControl id="group-user-search">
                      <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px) saturate(180%)',  }} error={errorOpen} placeholder="Search user..." type="search" onChange={(e) => handleSearch(e.target.value)} />
                    </FormControl>
                  </Stack>
                  <Box sx={{ overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }, mt: 1, mb: 1, height: 70 }} >
                    {selectedUsers.map((groupUser) => (<Chip sx={{ m: '1.5px' }} color="primary" variant="soft" key={groupUser._id} startDecorator={<Avatar src={groupUser.avatar} />} endDecorator={<ChipDelete onDelete={() => removeChip(groupUser)} />} >{groupUser.username}</Chip>))}
                  </Box>
                  <Box sx={{ pt: 6, overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }, height: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                    {isLoading ? (
                      // <CircularProgress color="neutral" size="lg" value={65} variant="soft" />
                      <PuffLoader color="#7fddfa" size={100} cssOverride={null} speedMultiplier={0.8} />
                    ) : (
                      searchResult.map(result => (<UserListItem key={result._id} user={result} handleFunction={() => handleGroup(result)} />))
                    )}
                  </Box>

                  <Stack direction='row' spacing={2}>
                    <Button sx={{ width: 150 }}>Cancel</Button>
                    <Button sx={{ width: 150 }} onClick={handleSubmit}>Start Chat</Button>
                  </Stack>

                </Stack>
              </TabPanel>
            </Tabs>
          </Stack>
        </Sheet>
      </Modal>
    </Box>

  )
}

export default NewChatModal