import { Avatar, AvatarGroup, Box, Typography } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GeneralState } from '../../../contexts/GeneralContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import MessagesSkeleton from '../../Skeleton/MessagesSkeleton';
import { getSender, getSenderFull } from '../Utils/chatLogics';

const MessageRecents = ({ setPageIndicator, pageIndicator }) => {
  const { user } = useAuthContext();
  const { mode, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setOminnectModal } = GeneralState();
  const [textToShow, setTextToShow] = useState('');

  const getChatsApi = mode === 'dev' ? process.env.REACT_APP_DEV_GET_CHATS_API : process.env.REACT_APPDEP_GET_CHATS_API;

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(getChatsApi, config);
      if (data.length > 0) {
        console.log(data);
        setChats(data);
      } else {
        console.log('fuck');
        setTextToShow("You have no message yet.")
      }
    } catch (error) {
      //snack for no chat
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  useEffect(() => {
    fetchChats()
  }, [])

  const printChat = () => {
    console.log(chats);
  }

  return (
    <Box >
      {chats ? (
        <Box >
          {chats.map((chat) => (
            <Box onClick={() => {
              setOminnectModal(true);
              setSelectedChat(chat)
              if (pageIndicator) {
                setPageIndicator(!pageIndicator)
              }
            }} sx={{ cursor: 'pointer', border: selectedChat === chat ? '1px solid rgba(255, 255, 255, 10)' : '1px solid rgba(100, 100, 100, 0.3)', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', padding: 1, margin: 1, borderRadius: 'md', minWidth: '225px', minHeight: '50px', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.5)' }, display: 'flex', flexDirection: chat.isGroupChat ? 'column' : 'row', justifyContent: 'start', alignItems: 'start' }} key={chat._id}>
              <Box sx={{ m: chat.isGroupChat ? 0 : 1 }}>
                {!chat.isGroupChat && user ? (
                  <Avatar src={getSenderFull(user, chat.users).avatar} />
                ) : (
                  <AvatarGroup >
                    {chat.users.slice(0, 4).map((chatUser) => (
                      <Avatar key={chatUser._id} src={chatUser.avatar} />
                    ))}
                    {chat.users.length > 4 ? (
                      <Avatar>+{(chat.users.length) - 4}</Avatar>
                    ) : null}
                  </AvatarGroup>
                )}
              </Box>
              <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start' }}>
                <Box >
                  <Typography>
                    {!chat.isGroupChat ? getSender(user, chat.users) : (chat.chatName)}
                  </Typography>
                </Box>
                {chat.latestMessage && (
                  <Box>
                    <Typography fontSize="xs">
                      <b>{chat.latestMessage.sender.username}: </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 20) + "..."
                        : chat.latestMessage.content}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ backgroundColor: 'red' }}>
          <Typography>
            `${textToShow}`
          </Typography>
        </Box>
      )
      }
    </Box >
  )
}

export default MessageRecents;

