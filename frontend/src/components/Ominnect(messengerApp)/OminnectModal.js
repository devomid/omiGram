import AddIcon from '@mui/icons-material/Add';
import { Badge, Box, Grid, IconButton, Modal, Sheet, Tab, TabList, TabPanel, Tabs, Tooltip, Typography, tabClasses } from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { GeneralState } from '../../contexts/GeneralContext';
import NewChatModal from './NewChatModal';
import ChatRoom from './txtMsg/ChatRoom';
import MessageRecents from './txtMsg/MessageRecents';
import VideoRecents from './videoMsg/VideoRecents';
import VideoRoom from './videoMsg/VideoRoom';
import VoiceRecents from './voiceMsg/VoiceRecents';
import VoiceRoom from './voiceMsg/VoiceRoom';

const OminnectModal = ({ ominnectModal, setOminnectModal, socket }) => {
  const [newChatModal, setNewChatModal] = useState(false);
  const { notification } = GeneralState();
  const isSmallScreen = useMediaQuery('(max-width:900px)');
  const isSmallerScreen = useMediaQuery('(max-width:600px)');
  const [pageIndicator, setPageIndicator] = useState('chatRoom');


  return (
    <Box>
      <Modal open={ominnectModal} onClose={() => setOminnectModal(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Sheet variant="solid" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: 610, width: isSmallerScreen ? 450 : (isSmallScreen ? 550 : 900), borderRadius: 'lg', p: 2, boxShadow: 'lg', backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(6px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>

          <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: 'transparent', width: '100%', height: '100%' }}>

            <TabList disableUnderline sx={{ alignSelf: 'center', width: 400, p: 0.5, gap: 0.5, borderRadius: 'xl', bgcolor: 'rgba(182, 70, 45, 0.3)', [`& .${tabClasses.root}[aria-selected="true"]`]: { boxShadow: 'sm', bgcolor: 'background.surface' } }}>
              <Badge badgeInset="10px 127px" invisible={!notification.length} color="danger" size="sm" variant="solid">
                <Tab disableIndicator>Text Messages</Tab>
              </Badge>
              <Tab disabled disableIndicator>Video Calls</Tab>
              <Tab disabled disableIndicator>Voice Calls</Tab>
            </TabList>

            <TabPanel sx={{ width: '98%', height: 600 }} value={0}>
              <Grid container columns={16} spacing={1.5} sx={{ flexGrow: 1, width: isSmallerScreen ? 450 : (isSmallScreen ? 550 : 900), height: 550 }} alignItems='center' justifyContent='center' >

                <Grid md={4.87} lg={4.87} >

                  <Box display={isSmallScreen ? 'none' : 'flex'} sx={{ height: 535, width: '100%', borderRadius: 'lg', border: '1px solid black', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
                    <Box sx={{ zIndex: 1, position: 'fixed', width: '28.2%', height: 50, borderBottom: '1px solid rgba(50, 50, 50, 0.3)', background: 'none', backdropFilter: 'blur(0px) saturate(180%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                      <Typography sx={{ ml: 2 }} color='primary'>Messages</Typography>
                      <Tooltip title='New Message' arrow placement='bottom-end' color='primary' variant='plain'>
                        <IconButton sx={{ mr: 2 }} color='primary' onClick={() => setNewChatModal(true)} variant="plain"><AddIcon /></IconButton>
                      </Tooltip>
                    </Box>

                    <Box sx={{ mt: 7.5 }}>
                      <MessageRecents />
                    </Box>

                  </Box>
                </Grid>

                <Grid xs={16} sm={16} md={10.6} lg={10.6} >

                  {pageIndicator === 'Messages' && isSmallScreen || isSmallerScreen ? (
                    <Box sx={{ height: 535, width: '100%', borderRadius: 'lg', border: '1px solid black', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }, mr: 3, display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                      {/* <Box sx={{ zIndex: 1, position: 'fixed', width: isSmallerScreen ? '86%' : (isSmallScreen ? '88.4%' : '62.7%'), height: 50, borderBottom: '1px solid rgba(50, 50, 50, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
                        {/* <Typography sx={{ ml: 2 }} color='primary'>Messages</Typography> */}
                        {/* <Tooltip title='New Message' arrow placement='bottom-end' color='primary' variant='plain'> */}
                          {/* <IconButton sx={{ mr: 2 }} color='primary' onClick={() => setNewChatModal(true)} variant="plain"><AddIcon /></IconButton> */}
                        {/* </Tooltip> */}
                      {/* </Box> */}

                      <Box sx={{ mt: 7.5 }}>
                        {/* <MessageRecents setPageIndicator={setPageIndicator} pageIndicator={pageIndicator} /> */}
                      </Box>

                    </Box>
                  ) : (
                    <Box sx={{ width: '100%', height: 535, borderRadius: 'lg', border: '1px solid black' }}>
                      <ChatRoom setOminnectModal={setOminnectModal} socket={socket} pageIndicator={pageIndicator} setPageIndicator={setPageIndicator} />
                    </Box>
                  )}
                </Grid>

              </Grid>
            </TabPanel>

            <TabPanel value={1}>
              <Box>
                <Grid container spacing={2} columns={18} sx={{ width: 880, height: 500 }}>
                  <Grid xs={6} sm={6} md={12} lg={16}>
                    <Box sx={{ height: 535, borderRadius: 'lg', border: '1px solid black', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
                      <Box sx={{ zIndex: 1, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2, pl: 2 }}>
                        <Typography color='primary'>Messages</Typography>
                        <IconButton color='primary' variant="plain"><AddIcon /></IconButton>
                      </Box>
                      <Box>
                        <VideoRecents />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={12} md={5} lg={5}>
                    <Box sx={{ height: 535, borderRadius: 'lg', border: '1px solid black', }}>
                      <VideoRoom />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value={2}>
              <Box>
                <Grid container spacing={2} columns={18} sx={{ width: 880, height: 500 }}>
                  <Grid xs={6}>
                    <Box sx={{ height: 535, borderRadius: 'lg', border: '1px solid black', overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' } }}>
                      <VoiceRecents />
                    </Box>
                  </Grid>
                  <Grid xs={12}>
                    <Box sx={{ height: 535, borderRadius: 'lg', border: '1px solid black', }}>
                      <VoiceRoom />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Tabs>
          <NewChatModal newChatModal={newChatModal} setNewChatModal={setNewChatModal} />
        </Sheet>
      </Modal>
    </Box >
  )
}

export default OminnectModal
