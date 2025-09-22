import Picker from '@emoji-mart/react';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import { Box, Button, CircularProgress, Dropdown, IconButton, Menu, MenuButton, Stack, Textarea, Tooltip, Typography, styled } from '@mui/joy';
import axios from 'axios';
import Lottie from "lottie-react";
import React, { useCallback, useEffect, useState } from 'react';
import typingAn from '../../../assets/animations/typing.json';
import { GeneralState } from '../../../contexts/GeneralContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { getSocket } from '../../../socket';
import UserInfoModal from '../../UserInfo/UserInfoModal';
import GroupInfoModal from '../GroupInfoModal';
import { getSender } from '../Utils/chatLogics';
import ChatInterface from './ChatInterface';
import SendPicModal from './SendPicModal';
import { useMediaQuery } from '@mui/material'


const ChatRoom = ({ setOminnectModal, socket, pageIndicator, setPageIndicator }) => {
  const isSmallScreen = useMediaQuery('(max-width:900px)');
  const isSmallerScreen = useMediaQuery('(max-width:600px)');
  const { user } = useAuthContext();
  const {
    mode,
    msgs, setMsgs,
    chats,
    selectedChat,
    fetchAgain, setFetchAgain,
    socketConnected,
    setSelectedChatCompare } = GeneralState();
  
  const getMsgsApi = mode === 'dev' ? process.env.REACT_APP_DEV_GET_MSGS_API : process.env.REACT_APP_DEP_GET_MSGS_API;
  const sendMsgsApi = mode === 'dev' ? process.env.REACT_APP_DEV_SEND_MSGS_API : process.env.REACT_APP_DEP_SEND_MSGS_API;
  
  const [open, setOpen] = useState(false);
  const [groupInfoModal, setGroupInfoModal] = useState(false);
  const [userInfoModal, setUserInfoModal] = useState(false);
  const [newMsg, setNewMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatPic, setChatPic] = useState('');
  const [sendPicModal, setSendPicModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

  let chattingFriend;
  if (chats) { chats.map((chat) => chattingFriend = chat.users[1]) }

  useEffect(() => {
    const socket = getSocket()
    if (socket) {
      socket.on('typing', () => setIsTyping(true));
      socket.on('notTyping', () => setIsTyping(false));
    }
  }, [socket]);

  const handleInfo = () => {
    console.log('hi');
    if (selectedChat.isGroupChat) {
      setGroupInfoModal(true)
    } else {
      setUserInfoModal(true)
    }
  };

  const hi = () => { console.log('hi22'); }

  const fetchMsgs = async () => {
    const socket = getSocket()
    if (!selectedChat) return;
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${getMsgsApi}${selectedChat._id}`, config);
      setMsgs(data);

    } catch (error) {
      console.log('snack:', error);
    }
    setIsLoading(false);
    socket.emit('joinChat', selectedChat._id)
  };

  useEffect(() => {
    fetchMsgs();

    setSelectedChatCompare(selectedChat);
  }, [selectedChat]);

  const sendMsg = async (e) => {
    const socket = getSocket()
    if ((e.key === 'Enter' && e.ctrlKey) || e.type === 'click') {
      setIsSending(true);
      socket.emit('notTyping', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        };
        setNewMsg('');
        const { data } = await axios.post(sendMsgsApi, {
          content: newMsg,
          chatId: selectedChat._id,
          /* post */
        }, config);
        socket.emit('newMsg', data)
        setMsgs([...msgs, data]);

      } catch (error) {
        console.log('snack:', error);
      };
      setIsSending(false);
    }
  };

  const handleOpenChange = useCallback((event, isOpen) => {
    setOpen(isOpen);
  }, []);

  const addemoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setNewMsg(newMsg + emoji);
    setOpen(false);
  };

  const picAttachHandler = (e) => {
    setChatPic(e.currentTarget.files[0])
    setSendPicModal(true)
  };

  const typingHandler = (e) => {
    const socket = getSocket()
    setNewMsg(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id)
    };
    let lastTypingTime = new Date().getTime()
    const timerLength = 1500
    setTimeout(() => {
      let currentTime = new Date().getTime()
      let timeDiff = currentTime - lastTypingTime

      if (timeDiff >= timerLength && !typing) {
        socket.emit('notTyping', selectedChat._id)
        setTyping(false)
      }
    }, timerLength);
  };

  const handleBack = () => {
    setPageIndicator('Messages')
    console.log(pageIndicator);
  }

  return (
    <>
      {
        selectedChat ? (
          <Box sx={{ height: '100%' }} >

            <UserInfoModal userInfoModal={userInfoModal} setUserInfoModal={setUserInfoModal} result={chattingFriend} setOminnectModal={setOminnectModal} />
            <GroupInfoModal groupInfoModal={groupInfoModal} setGroupInfoModal={setGroupInfoModal} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            <SendPicModal sendPicModal={sendPicModal} setSendPicModal={setSendPicModal} chatPic={chatPic} setChatPic={setChatPic} newMsg={newMsg} setNewMsg={setNewMsg} isSending={isSending} setIsSending={setIsSending} msgs={msgs} setMsgs={setMsgs} />

            <Box sx={{ height: '9.4%', background: 'none', backdropFilter: 'blur(20px) saturate(180%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'solid 1px black', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>

              <Box sx={{ width: '100%', ml: 1, mr: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isSmallScreen ? (
                  <IconButton color='primary' onClick={handleBack}>
                    <ArrowBackIosOutlinedIcon />
                  </IconButton>
                ) : <IconButton disabled></IconButton>
                }

                <Stack direction='column'>
                  <Box sx={{ mt: 2 }}>
                    <Typography color='primary'>{!selectedChat.isGroupChat ? (getSender(user, selectedChat.users)) : (selectedChat.chatName)}</Typography>
                  </Box>

                  <Box sx={{ width: 85, height: 40 }}>
                    <Stack direction='row' alignItems='start'>
                      {isTyping ? (
                        <>
                          <Box sx={{ mt: 0.7 }}><Typography level="body-xs">is typing</Typography></Box>
                          <Box sx={{ width: 40, background: 'none' }}><Lottie animationData={typingAn} /></Box>
                        </>
                      ) : (
                        <></>
                      )}
                    </Stack>
                  </Box>

                </Stack>
                <IconButton variant="plain" onClick={handleInfo} color='primary'>
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>

            </Box>

            <Box sx={{ width: '100%', height: 420, overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
              <ChatInterface newMsg={newMsg} setNewMsg={setNewMsg} msgs={msgs} setMsgs={setMsgs} isLoading={isLoading} setIsLoading={setIsLoading} isTyping={isTyping} />
            </Box>

            {/* <Box sx={{ width: '10%', height: '10%', background: 'none' }}>
              {isTyping ? (
                <Box sx={{ width: 100, height: '100%', background: 'none', alignSelf: 'end' }}><Lottie animationData={typing_animation} /></Box>
              ) : (
                <></>
              )}
            </Box> */}

            <Box sx={{ height: '10%', width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'end', }}>
              <Button sx={{ mb: 1.3, mr: 0.5, ml: 0.8 }} size='sm' component="label" role={undefined} tabIndex={-1} variant="plain" startDecorator={<AttachFileOutlinedIcon color='primary' />} >
                <VisuallyHiddenInput type="file" accept='image/*' onChange={picAttachHandler} />
              </Button>
              <Dropdown open={open} onOpenChange={handleOpenChange} >
                <MenuButton sx={{ mb: 1 }} slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral' } }}><SentimentSatisfiedOutlinedIcon color='primary' /></MenuButton>
                <Menu sx={{ position: 'absolute', zIndex: 4000 }} placement="bottom-end">
                  <Picker icons='outline' previewPosition='none' onEmojiSelect={addemoji} onClickOutside={() => setOpen(false)} />
                </Menu>
              </Dropdown>

              <Textarea onKeyDown={sendMsg} onChange={typingHandler} sx={{
                width: '85%', m: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)'
              }} value={newMsg} minRows={1} maxRows={4} variant='outlined' placeholder='Your message here...' />
              {isSending ? (
                <CircularProgress sx={{ alignSelf: 'center', mr: 1.5, ml: 2 }} color="primary" size="sm" value={50} thickness={3} variant="soft" />
              ) : (
                <Tooltip title='"Ctrl+Enter" also sends the Message' variant="outlined" size="sm" arrow placement="bottom-end" >
                  <IconButton onClick={sendMsg} sx={{ m: 1 }}  ><NorthOutlinedIcon color='primary' /></IconButton>
                </Tooltip>
              )}
            </Box>
          </Box >
        ) : (

          <Box sx={{ height: '100%' }} >
            <Box sx={{ height: 50, background: 'none', borderBottom: 'solid 1px black', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
              <Typography color='primary'>No Chat Selected Yet</Typography>
            </Box>
            <Box sx={{ height: '91%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color='primary'>Plaese select a chat to start sharing your toughts</Typography>
            </Box>
          </Box >
        )
      }
    </>
  )
}
export default ChatRoom