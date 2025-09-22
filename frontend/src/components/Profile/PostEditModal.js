import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import { Box, Button, IconButton, Modal, Sheet, Stack, Textarea, Typography } from '@mui/joy';
import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { GeneralState } from '../../contexts/GeneralContext';

const PostEditModal = ({ post, editPostOpen, setEditPostOpen, fetchUserPosts, setEditSnackOpen }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [postBody, setPostBody] = useState('');
  const { mode } = GeneralState();
  
  const editPostApi = mode === 'dev' ? process.env.REACT_APP_DEV_EDIT_POST_API : process.env.REACT_APP_DEP_EDIT_POST_API;
  

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log(user.user._id);

    const formData = new FormData();
    formData.append('userId', user.user._id);
    formData.append('postBody', postBody);

    const response = await fetch(`${editPostApi}${post._id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      method: 'PATCH',
      body: formData
    });
    if (response.ok) {
      const jsonres = await response.json();
      console.log(jsonres);
    }
    setIsLoading(false);
    setPostBody('');
    setEditPostOpen(false);
    fetchUserPosts();
    setEditSnackOpen(true);
  };

  const handleCancel = () => {
    setPostBody('');
    setEditPostOpen(false);
  };

  return (
    <Box>
      <Modal open={editPostOpen} onClose={() => setEditPostOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Sheet variant="solid" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 500, height: 300, maxWidth: 800, borderRadius: 'lg', p: 3, boxShadow: 'lg', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
          <Box sx={{ height: '100%', width: '100%' }}>
            <Stack>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Typography level='title-lg'>Edit Post</Typography>
              </Box>
              <Box sx={{ height: '89%', width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
                <Textarea sx={{ width: '85%', m: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }} onChange={(e) => setPostBody(e.target.value)} defaultValue={post.postBody} name='postBody' id='postBody' minRows={6} maxRows={6} color='primary' variant='outlined' size="md" />
                <IconButton sx={{ mb: 2 }}><SentimentSatisfiedOutlinedIcon color='primary' /></IconButton>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'end', mt: 4 }}>
                <Button sx={{ mr: 2 }} onClick={handleCancel} startDecorator={<ClearIcon />}>Discard Changes</Button>
                <Button startDecorator={<CheckIcon />} loading={isLoading} loadingPosition="end" onClick={handleSubmit}>Confirm Changes</Button>
              </Box>
            </Stack>
          </Box>
        </Sheet>
      </Modal>
    </Box>
  )
}

export default PostEditModal