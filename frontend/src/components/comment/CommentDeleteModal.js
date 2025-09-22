import React from 'react';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography, Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog } from '@mui/joy';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useState } from 'react'; 

const CommentDeleteModal = ({ comment, commentDeleteModalOpen, setCommentDeleteModalOpen }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await fetch(`https://omigramapi.onrender.com/posts/${comment._id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      method: 'DELETE',
      body: JSON.stringify({ userId: user.user._id })
    });
    if (response.ok) {
      setIsLoading(false)
      setCommentDeleteModalOpen(false)
      // fetchUserPosts()
      // setDeleteSnackOpen(true)
    }
  }

  return (
    <Modal open={commentDeleteModalOpen} onClose={() => setCommentDeleteModalOpen(false)}>
      <ModalDialog variant="outlined" role="alertdialog" sx={{ backgroundColor: 'rgba(255, 0, 0, 0.2)', backdropFilter: 'blur(10px) saturate(150%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
        <DialogTitle><WarningRoundedIcon sx={{ color: 'yellow' }} /><Typography sx={{ color: 'yellow' }}>Confirmation</Typography></DialogTitle>
        <Divider />
        <DialogContent>
          <Typography sx={{ color: 'black' }}>Are you sure you want to delete this comment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button loading={isLoading} loadingPosition="end" variant="solid" color="danger" onClick={handleDelete}>
            Delete post
          </Button>
          <Button variant="plain" color="neutral[100]" onClick={() => setCommentDeleteModalOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  )
}

export default CommentDeleteModal;