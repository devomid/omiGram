import { Avatar, Box, Button, Chip, ChipDelete, FormControl, Input, Modal, Sheet, Stack, Typography } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PuffLoader from "react-spinners/PuffLoader";
import { GeneralState } from '../../contexts/GeneralContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserListItem from '../maplableObj/UserListItem';
import DeleteGroupModal from './DeleteGroupModal';
import LeaveGroupModal from './LeaveGroupModal';


const GroupInfoModal = ({ groupInfoModal, setGroupInfoModal, fetchAgain, setFetchAgain }) => {
  const { user } = useAuthContext();
  const { mode, selectedChat, setSelectedChat } = GeneralState();
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [groupChatName, setGroupChatName] = useState();
  const [isRenameLoading, setIsRenameLoading] = useState(false);
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(false);
  const [deletingUser, setDeletingUser] = useState();
  const [leaveGroupModal, setLeaveGroupModal] = useState(false);

  const searchChatApi = mode === 'dev' ? process.env.REACT_APP_DEV_SEARCH_CHAT_API : process.env.REACT_APP_DEP_SEARCH_CHAT_API;
  const renameChatApi = mode === 'dev' ? process.env.REACT_APP_DEV_RENAME_CHAT_API : process.env.REACT_APP_DEP_RENAME_CHAT_API;
  const addUserApi = mode === 'dev' ? process.env.REACT_APP_DEV_ADD_USER_API : process.env.REACT_APP_DEP_ADD_USER_API;
  const removeUserApi = mode === 'dev' ? process.env.REACT_APP_DEV_REMOVE_USER_API : process.env.REACT_APP_DEP_REMOVE_USER_API;


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
        const { data } = await axios.get(`${searchChatApi}${search}`, config)

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


  const handleRename = async () => {
    if (!groupChatName) {
      setGroupInfoModal(false);
      return
    };
    if (selectedChat.groupAdmin._id !== user.user._id) {
      console.log('snack: only group admin can edt group members');
      return;
    };
    try {
      setIsRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`${renameChatApi}`, {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config);
      setSelectedChat(data);
      setIsRenameLoading(false);
      setFetchAgain(true);

    } catch (error) {
      console.log('snack', error);
    }
    setGroupChatName('')
    setGroupInfoModal(false);
  }

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((chatUser) => chatUser._id === userToAdd._id)) {
      console.log('snack: user already exists in group');
      return
    };
    if (selectedChat.groupAdmin._id !== user.user._id) {
      console.log('snack: only group admin can edt group members');
      return;
    };
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.put(`${addUserApi}`, {
        chatId: selectedChat._id,
        userId: userToAdd._id
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setIsLoading(false);

    } catch (error) {
      console.log('snack:', error);
    }
  };

  const handleRemoveUser = async (userToDelete) => {
    setDeletingUser(userToDelete);
    if (selectedChat.groupAdmin._id !== user.user._id) {
      console.log('snack: only group admin can edt group members');
      return;
    };
    if (userToDelete._id === selectedChat.groupAdmin._id) {
      // setPermissionToDelete(false);
      setDeleteGroupModal(true);
    };
    if (userToDelete._id !== selectedChat.groupAdmin._id) {
      setPermissionToDelete(true);
    };
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      // if (permissionToDelete) {
      //   await removeUserFromGroup(selectedChat._id, userToDelete._id, config)
      // } else {
      //   setIsLoading(false);
      //   return
      // };
      setFetchAgain(!fetchAgain);
      setIsLoading(false);
    } catch (error) {
      console.log('snack:', error);
    }
  };

  const removeUserFromGroup = async (chatId, userId, config) => {
    try {
      const { data } = await axios.put(`${removeUserApi}`, {
        chatId,
        userId
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log('snack:', error);
    }
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    if (permissionToDelete) {
      removeUserFromGroup(selectedChat._id, deletingUser._id, config)
    } else {
      setIsLoading(false);
      return
    };
  }, [permissionToDelete])

  return (
    <Modal open={groupInfoModal} onClose={() => setGroupInfoModal(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Sheet variant="solid" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', width: 350, height: 600, borderRadius: 'lg', p: 2, boxShadow: 'lg', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
        <DeleteGroupModal deleteGroupModal={deleteGroupModal} setDeleteGroupModal={setDeleteGroupModal} setFetchAgain={setFetchAgain} setPermissionToDelete={setPermissionToDelete} setGroupInfoModal={setGroupInfoModal} removeUserFromGroup={removeUserFromGroup} deletingUser={deletingUser} />
        <LeaveGroupModal leaveGroupModal={leaveGroupModal} setLeaveGroupModal={setLeaveGroupModal} setFetchAgain={setFetchAgain} setGroupInfoModal={setGroupInfoModal} removeUserFromGroup={removeUserFromGroup} />
        <Box >
          <Stack spacing={2}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography level="h4">{selectedChat.chatName}</Typography>
            </Box>
            <FormControl id="group-name">
              <Input sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }} placeholder={!groupChatName ? selectedChat.chatName : groupChatName} variant="outlined" onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl id="group-user-search">
              <Input sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }} error={errorOpen} placeholder="Search user to add to group..." type="search" onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
          </Stack>
          <Box sx={{ overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }, mt: 1, mb: 1, height: 70 }} >
            {selectedChat.users.map((groupUser) => (<Chip sx={{ m: '1.5px' }} color="primary" variant="soft" key={groupUser._id} startDecorator={<Avatar src={groupUser.avatar} />} endDecorator={<ChipDelete onDelete={() => handleRemoveUser(groupUser)} />} >{groupUser.username}</Chip>))}
          </Box>
          <Box sx={{ pt: 6, overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }, height: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
            {isLoading ? (
              <PuffLoader color="#6e3e8e" size={140} cssOverride={null} speedMultiplier={1} />
            ) : (
              searchResult.map(result => (<UserListItem key={result._id} user={result} handleFunction={() => handleAddUser(result)} />))
            )}
          </Box>

          <Stack spacing={2}>
            <Button loading={isRenameLoading} onClick={handleRename}>Update</Button>
            <Box sx={{ width: 350, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button sx={{ width: 170, mr: 3 }} onClick={() => setGroupInfoModal(false)}>Cancel</Button>
              <Button sx={{ width: 170 }} onClick={() => setLeaveGroupModal(true)} color='danger'>Leave Group</Button>
            </Box>
          </Stack>
        </Box>
      </Sheet>
    </Modal>
  )
}

export default GroupInfoModal