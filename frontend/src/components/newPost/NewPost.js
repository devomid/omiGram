import Picker from '@emoji-mart/react';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import { Box, Button, Dropdown, FormControl, FormLabel, IconButton, Menu, MenuButton, Modal, Sheet, Stack, Switch, Textarea, Tooltip, Typography, styled, switchClasses } from '@mui/joy';
import React, { useCallback, useEffect, useState } from 'react';
import image_placeholder from '../../assets/images/image_placeholder.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSendNewPost } from '../../hooks/useSendNewPost';

const NewPost = ({ newPostOpen, setNewPostOpen, /* fetchUserPosts */ }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const { user } = useAuthContext();
  const { sendNewPost } = useSendNewPost();
  const [isLoading, setIsLoading] = useState(false);
  const [postBody, setPostBody] = useState('');
  const [postPic, setPostPic] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
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

  useEffect(() => {
    if (checked) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      })
    } else if (!checked) {
      setLat('');
      setLon('');
    }
  }, [checked]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const username = user.user.username;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('postBody', postBody);
    formData.append('latitude', lat);
    formData.append('longitude', lon);
    formData.append('postPic', postPic);
    await sendNewPost(formData);
    setIsLoading(false);
    // fetchUserPosts();
    setPostBody('');
    setPostPic('');
    setNewPostOpen(false);
  };

  const handleCancel = () => {
    setPostBody('');
    setPostPic('');
    setNewPostOpen(false);
  };

  const handleOpenChange = useCallback((event, isOpen) => {
    setOpen(isOpen);
  }, []);

  const addemoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setPostBody(postBody + emoji);
    setOpen(false);
  };

  return (
    <Box>
      <Modal open={newPostOpen} onClose={() => setNewPostOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Sheet variant="solid" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 500, height: 530, maxWidth: 800, borderRadius: 'lg', p: 3, boxShadow: 'lg', backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(5px) saturate(180%)' }}>
          <Box sx={{ height: '100%', width: '100%' }}>
            <Stack>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Typography>New Post</Typography>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                {postPic ? (
                  <img alt='a' src={URL.createObjectURL(postPic)} height='200rem' width='auto' style={{ borderRadius: '15px', border: '1px solid rgba(209, 213, 219, 0.3)' }} />
                ) : (
                  <img alt='a' src={image_placeholder} height='200rem' width='auto' style={{ borderRadius: '15px', border: '1px solid rgba(209, 213, 219, 0.3)' }} />
                )}
              </Box>
              <Box sx={{ height: '89%', width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
                <Textarea sx={{ width: '85%', m: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(77, 77, 77, 0.7)' }} value={postBody} onChange={(e) => setPostBody(e.target.value)} name='postBody' id='postBody' minRows={6} maxRows={6} color='primary' variant='outlined' placeholder="Your thoughts here..." size="md" />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Dropdown open={open} onOpenChange={handleOpenChange} >
                  <Tooltip enterDelay={500} title='Emoji' arrow color="primary" placement="top-end" size="md" variant="plain">
                    <MenuButton sx={{ mb: 2 }} slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral' } }}><SentimentSatisfiedOutlinedIcon color='primary' /></MenuButton>
                  </Tooltip>
                    <Menu sx={{ position: 'absolute', zIndex: 4000 }} placement="right">
                      <Picker icons='outline' previewPosition='none' onEmojiSelect={addemoji} onClickOutside={() => setOpen(false)} />
                    </Menu>
                  </Dropdown>
                  <Tooltip enterDelay={500} title='Attach a picture' arrow color="primary" placement="bottom-end" size="md" variant="plain">
                  <Button sx={{ mb: 2, mr: 1, ml: 1 }} size='sm' component="label" role={undefined} tabIndex={-1} variant="plain" startDecorator={<AttachFileOutlinedIcon color='primary' />} ><VisuallyHiddenInput type="file" accept='image/*' onChange={(e) => setPostPic(e.currentTarget.files[0])} /></Button>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'end', mt: 4 }}>
                <FormControl
                  orientation="horizontal" sx={{ width: 200, justifyContent: 'start' }}>
                  <div>
                    <FormLabel>Posts's location</FormLabel>
                  </div>
                  <Switch
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    sx={(theme) => ({
                      '--Switch-thumbShadow': '0 3px 7px 0 rgba(0 0 0 / 0.12)',
                      '--Switch-thumbSize': '20px',
                      '--Switch-trackWidth': '50px',
                      '--Switch-trackHeight': '25px',
                      '--Switch-trackBackground': theme.vars.palette.background.level3,
                      [`& .${switchClasses.thumb}`]: {
                        transition: 'width 0.4s, left 0.4s',
                      },
                      '&:hover': {
                        '--Switch-trackBackground': theme.vars.palette.background.level3,
                      },
                      '&:active': {
                        '--Switch-thumbWidth': '30px',
                      },
                      [`&.${switchClasses.checked}`]: {
                        '--Switch-trackBackground': 'rgb(48 209 88)',
                        '&:hover': {
                          '--Switch-trackBackground': 'rgb(48 209 88)',
                        },
                      },
                    })}
                  />
                </FormControl>
                <Box>
                  <Button sx={{ mr: 2 }} onClick={handleCancel} startDecorator={<ClearIcon />}>Cancel</Button>
                  <Button startDecorator={<CheckIcon />} loading={isLoading} loadingPosition="end" onClick={handleSubmit}>Send</Button>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Sheet>
      </Modal>
    </Box>
  )
}

export default NewPost



