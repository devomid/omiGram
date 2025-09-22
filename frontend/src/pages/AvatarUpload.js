import { Box, Button, Grid, Modal, Sheet, Typography, FormControl, FormHelperText, Input } from '@mui/joy';
import { useFormik } from 'formik';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvatarSend } from '../hooks/useAvatarSend.js';
import { GeneralState } from '../contexts/GeneralContext.js';

const AvatarUploadForm = ({ avatarOpen, setAvatarOpen, email }) => {
  const { avatarSend } = useAvatarSend();
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const { tempUser } = GeneralState();

  const onSubmit = async () => {

    // console.log(tempUser);

    console.log('email in avatarUpload', email);
    console.log('avatar in avatarUpload', avatar);
    const formData = new FormData();

    formData.append('avatar', avatar);
    formData.append('userEmail', email);

    await avatarSend(formData);
    localStorage.setItem('user', JSON.stringify(tempUser));
    setAvatarOpen(false);
    navigate('/home');
  };

  const skip = () => {
    navigate('/');
  };

  const handleAvatarChange = (e) => {
    const file = e.currentTarget.files[0];
    // console.log(file);
    setAvatar(file);
  };

  const { errors, touched, isSubmitting, handleSubmit, handleBlur } = useFormik({
    initialValues: {
      avatar: ''
    },
    onSubmit
  });

  return (
    <Box>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={avatarOpen} onClose={() => setAvatarOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Sheet variant="solid" sx={{ width: 350, height: 250, maxWidth: 500, borderRadius: 'lg', p: 3, boxShadow: 'lg', backgroundColor: 'rgba( 214, 164, 153, 0.3) ', backdropFilter: 'saturate(80%)', border: '1px solid rgba( 255, 255, 255, 0.18 )' }}>
          <Typography component="h2" id="modal-title" level="h4" textColor="black" fontWeight="lg" mb={1} >
            OmiGram
          </Typography>
          <Typography component="h2" id="modal-title" level="h6" textColor="black" fontWeight="md" mb={1} >
            Avatar Upload
          </Typography>

          <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
            <FormControl fullWidth variant="standard" sx={{ mt: 3 }}>
              {/* <InputLabel htmlFor="avatar" error={errors.avatar && touched.avatar ? 'true' : false} >Avatar</InputLabel> */}
              <Input error={errors.avatar && touched.avatar ? 'true' : false} id="avatar" type="file" placeholder="avatar" onChange={handleAvatarChange} onBlur={handleBlur} />
              {errors.avatar && touched.avatar ? (<FormHelperText error={errors.avatar && touched.avatar ? 'true' : false}>{errors.avatar}</FormHelperText>) : (<FormHelperText>Acceptable formats: jpeg/jpg/png</FormHelperText>)}
            </FormControl>
          </form>

          <Box>
            <Grid container spacing={2} columns={16} sx={{ flexGrow: 1, mt: 5 }}>
              <Grid xs={8}><Button sx={{ width: '100%' }} onClick={skip}>Upload later</Button></Grid>
              <Grid xs={8}><Button sx={{ width: '100%' }} type="submit" loading={isSubmitting} disabled={!avatar} loadingPosition="start" onClick={handleSubmit} >Upload & Finish</Button></Grid>
            </Grid>
          </Box>

        </Sheet>
      </Modal>
    </Box >
  );
};

export default AvatarUploadForm;