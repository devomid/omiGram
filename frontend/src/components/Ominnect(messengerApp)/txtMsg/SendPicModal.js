import Picker from '@emoji-mart/react';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import { Box, CircularProgress, Dropdown, IconButton, Menu, MenuButton, Modal, Sheet, Stack, Textarea, Tooltip } from '@mui/joy';
import React, { useCallback, useState } from 'react';
import image_placeholder from '../../../assets/images/image_placeholder.png';
import { GeneralState } from '../../../contexts/GeneralContext';
import { useAuthContext } from '../../../hooks/useAuthContext';


const SendPicModal = ({ sendPicModal, setSendPicModal, chatPic, newMsg, setNewMsg, isSending, setIsSending, msgs, setMsgs }) => {
  const { user } = useAuthContext();
  const { mode, selectedChat } = GeneralState();
  const [open, setOpen] = useState(false);

  const sendMsgWithPicApi = mode === 'dev' ? process.env.REACT_APP_DEV_SEND_MSG_WITH_PIC_API : process.env.REACT_APP_DEP_SEND_MSG_WITH_PIC_API;

  const typingHandler = (e) => {
    setNewMsg(e.target.value)
  }

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

  const sendMsgWithPic = async (e) => {
    if ((e.key === 'Enter' && e.ctrlKey) || e.type === 'click') {
      setIsSending(true);
      try {
        const formData = new FormData();
        formData.append('content', newMsg);
        formData.append('chatId', selectedChat._id);
        formData.append('chatPic', chatPic);

        setNewMsg('');

        const response = await fetch(`${sendMsgWithPicApi}${user.user._id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          const jsonRes = await response.json()
          console.log(jsonRes);
          setMsgs([...msgs, jsonRes]);
        };

      } catch (error) {
        console.log('snack:', error);
      };
      setIsSending(false);
      setSendPicModal(false);
    }
  };

  return (
    <Box>
      <Modal open={sendPicModal} onClose={() => setSendPicModal(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Sheet variant="solid" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 400, height: 430, borderRadius: 'lg', p: 3, boxShadow: 'lg', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
          <Stack sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: '100%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'start', mb: 3 }}>
              {chatPic ? (
                <img src={URL.createObjectURL(chatPic)} height='300rem' width='auto' style={{ borderRadius: '15px', border: '1px solid rgba(209, 213, 219, 0.3)' }} />
              ) : (
                <img src={image_placeholder} height='250rem' width='auto' style={{ borderRadius: '15px', border: '1px solid rgba(209, 213, 219, 0.3)' }} />
              )}
            </Box>
            <Box sx={{ height: '50%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>

              <Box sx={{ display: 'flex', width: '100%' }}>
                <Dropdown open={open} onOpenChange={handleOpenChange} >
                  <MenuButton sx={{ mb: 1 }} slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral' } }}><SentimentSatisfiedOutlinedIcon color='primary' /></MenuButton>
                  <Menu sx={{ position: 'absolute', zIndex: 4000 }} placement="bottom-end">
                    <Picker icons='outline' previewPosition='none' onEmojiSelect={addemoji} onClickOutside={() => setOpen(false)} />
                  </Menu>
                </Dropdown>
                <Textarea onKeyDown={sendMsgWithPic} onChange={typingHandler} sx={{ width: '85%', m: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }} value={newMsg} minRows={1} maxRows={4} variant='outlined' placeholder='Your message here...' />
                {isSending ? (
                  <CircularProgress sx={{ alignSelf: 'center', mr: 1.5, ml: 2 }} color="primary" size="sm" value={50} thickness={3} variant="soft" />
                ) : (
                  <Tooltip title='"Ctrl+Enter" also sends the Message' variant="outlined" size="sm" arrow placement="bottom-end" >
                    <IconButton onClick={sendMsgWithPic} sx={{ m: 1 }}  ><NorthOutlinedIcon color='primary' /></IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Stack>
        </Sheet>
      </Modal>

    </Box>
  )
}

export default SendPicModal