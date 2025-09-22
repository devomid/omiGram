import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography, Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog } from '@mui/joy';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useState } from 'react';
import { GeneralState } from '../../contexts/GeneralContext';


const PostDeleteModal = ({ post, deletePostOpen, setDeletePostOpen, fetchUserPosts, setDeleteSnackOpen }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const { mode } = GeneralState();

  const deletePostApi = mode === 'dev' ? process.env.REACT_APP_DEV_DELETE_POST_API : process.env.REACT_APP_DEP_DELETE_POST_API;


  const handleDelete = async () => {
    setIsLoading(true)
    const response = await fetch(`${deletePostApi}${post._id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      method: 'DELETE',
      body: JSON.stringify({ userId: user.user._id })
    });
    if (response.ok) {
      setIsLoading(false)
      setDeletePostOpen(false)
      fetchUserPosts()
      setDeleteSnackOpen(true)
    }
  }
  return (
    <Modal open={deletePostOpen} onClose={() => setDeletePostOpen(false)}>
      <ModalDialog variant="outlined" role="alertdialog" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(209, 213, 219, 0.3)' }}>
        <DialogTitle><WarningRoundedIcon sx={{ color: 'red' }} /><Typography color='danger'>Confirmation</Typography></DialogTitle>
        <Divider />
        <DialogContent>
          <Typography sx={{ color: 'black' }}>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button loading={isLoading} loadingPosition="end" variant="solid" color="danger" onClick={handleDelete}>
            Delete post
          </Button>
          <Button variant="plain" color="neutral[100]" onClick={() => setDeletePostOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  )
}

export default PostDeleteModal