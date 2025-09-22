import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { UserSigninValidation } from '../validation/yupUserSchema.js';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, FormControl, FormHelperText, Grid, IconButton, Input, Link, Modal, Sheet, Stack, SvgIcon, Tooltip, Typography } from '@mui/joy';
import { GeneralState } from '../contexts/GeneralContext.js';

const LoginForm = () => {
  const [visibility, setVisibility] = useState(true);
  const navigate = useNavigate();
  const { login } = useLogin();
  const { mode, loginOpen, setLoginOpen } = GeneralState();

  const googleApi = mode === 'dev' ? process.env.REACT_APP_DEV_GOOGLE_AUTH_API : process.env.REACT_APP_DEP_GOOGLE_AUTH_API;

  const onSubmit = async (values, actions) => {
    await login(values.username, values.password);
    actions.resetForm();
    setLoginOpen(false);
    navigate(`/home`);
    // window.location.reload()
    console.log('hi');
  };

  const google = () => {
    window.open(googleApi, '_self')
  };

  const { values, errors, touched, isSubmitting, handleSubmit, handleBlur, handleChange } = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: UserSigninValidation, onSubmit
  });


  return (
    <Box>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={loginOpen} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >

        <Sheet variant="solid" sx={{ width: 350, height: 620, maxWidth: 500, borderRadius: 'lg', p: 3, boxShadow: 'lg', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>

          <Box>
            <Typography component="h2" id="modal-title" level="h4" textColor="black" fontWeight="lg" mb={1} >
              OmiGram
            </Typography>
            <Typography component="h2" id="modal-title" level="h6" textColor="black" fontWeight="md" mb={1} >
              Sign in
            </Typography>
          </Box>

          <Box>
            <Box>
              <Stack sx={{ mt: 3 }} spacing={3}>
                <FormControl error={errors.username && touched.username ? true : false} >
                  <Input type='text' id='username' name='username' value={values.username} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px) saturate(180%)' }} error={errors.username && touched.username ? true : false} required placeholder="Username" />
                  <FormHelperText sx={{ height: '1rem' }}>{errors.username && touched.username ? errors.username : (' ')}</FormHelperText>
                </FormControl>

                <FormControl error={errors.password && touched.password ? true : false}>
                  <Input id='password' name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} endDecorator={<IconButton onClick={() => setVisibility(!visibility)}>{visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>} type={visibility ? 'password' : 'text'} placeholder='Password' />
                  <FormHelperText sx={{ height: '1rem' }}>{errors.password && touched.password ? errors.password : ' '}</FormHelperText>
                </FormControl>
              </Stack>
            </Box>

            <Divider sx={{ mt: 13.2 }}>Social Media Sign In</Divider>

            <Box sx={{ width: '100%' }}>
              <Grid container spacing={2} columns={18} sx={{ flexGrow: 1, mt: 1 }} alignItems='center' justifyContent='center'>
                <Tooltip title='Sign in with Google account' arrow color="neutral" placement="bottom-start" size="sm" variant="soft" >
                  <Grid xs={6}><IconButton sx={{ width: '100%' }} onClick={google}>
                    <SvgIcon>
                      <svg width="800px" height="800px" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47" /><path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4" /><path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00" /><polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374" /><path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435" /><polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626" /><path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" /></svg>
                    </SvgIcon>
                  </IconButton></Grid>
                </Tooltip >
                <Tooltip title='Sign in with Facebook account' arrow color="neutral" placement="bottom" size="sm" variant="soft" >
                  <Grid xs={6}>
                    <IconButton sx={{ width: '100%' }}>
                      <SvgIcon>
                        <svg width="800px" height="800px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0"><path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" id="Facebook"></path></g></g></svg>
                      </SvgIcon>
                    </IconButton>
                  </Grid>
                </Tooltip>
                <Tooltip title='Sign in with GitHub account' arrow color="neutral" placement="bottom-end" size="sm" variant="soft" >
                  <Grid xs={6}>
                    <IconButton sx={{ width: '100%' }}>
                      <SvgIcon>
                        <svg width="9000px" height="9000px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z" />
                        </svg>
                      </SvgIcon>
                    </IconButton>
                  </Grid>
                </Tooltip>
              </Grid>
            </Box>

            <Box sx={{ height: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', mt: 7, mb: 3 }}>
              <Button sx={{ width: '100%' }} type="submit" loading={isSubmitting} loadingPosition="start" onClick={handleSubmit} >Sign In</Button>
            </Box>

            <Box>
              <Link sx={{ color: 'lightgrey', textDecoration: 'none', '&:hover': { color: 'white', textDecoration: 'none' } }} href={'/user/auth/signup'}>Don't have an account? Signup here!</Link>
              <Link sx={{ color: 'lightgrey', textDecoration: 'none', '&:hover': { color: 'white', textDecoration: 'none' } }} href={'/user/auth/signup'}>Forgot your password? Click here!</Link>
            </Box>

          </Box>
        </Sheet>
      </Modal>
    </Box >

  );
}

export default LoginForm;