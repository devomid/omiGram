import { Box, Button, FormControl, FormHelperText, FormLabel, Grid, Input, Option, Select, Textarea, selectClasses } from '@mui/joy';
import React from 'react'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { UserEditPersonalInfoValidation } from '../../validation/yupUserSchema';
import moment from 'moment';
import { useFormik } from 'formik';
import axios from 'axios';
import { GeneralState } from '../../contexts/GeneralContext';


const PersonalInformationTab = ({ setSettingModalOpen }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userBirthDate = user.user.birthDate;
  const birthDateDefaultValue = moment(userBirthDate).utc().format('YYYY-MM-DD');
  const { mode } = GeneralState();
  
  const getUserInfoApi = mode === 'dev' ? process.env.REACT_APP_DEV_GET_USER_INFO_API : process.env.REACT_APP_DEP_GET_USER_INFO_API;

  const onSubmit = async (values, actions) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.patch(`${getUserInfoApi}${user.user._id}`, {
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate,
        phoneNumber: values.phoneNumber,
        country: values.country,
        city: values.city,
        education: values.education,
        gender: values.gender,
        bio: values.bio
      }, config);

      console.log(data.message);
      console.log(data);

    } catch (error) {

    }
  }

  const { values, errors, touched, isSubmitting, handleSubmit, handleBlur, handleChange, setFieldValue } = useFormik({
    initialValues: {
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      birthDate: birthDateDefaultValue,
      phoneNumber: user.user.phoneNumber,
      country: user.user.country,
      city: user.user.city,
      education: user.user.education,
      gender: user.user.gender,
      bio: user.user.bio,
    },
    validationSchema: UserEditPersonalInfoValidation,
    onSubmit

  });

  const print = () => {
    console.log(values);
    console.log(errors);
    console.log(touched);
    console.log(handleSubmit);
  }

  return (
    <>
      <Grid xs={9}>
        <FormControl error={errors.firstName && touched.firstName ? true : false}>
          <FormLabel>First Name</FormLabel>
          <Input type='text' id='firstName' name='firstName' value={values.firstName} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={user.user.firstName} />
          <FormHelperText sx={{ height: '1rem' }}>{errors.firstName && touched.firstName ? errors.firstName : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={9}>
        <FormControl error={errors.lastName && touched.lastName ? true : false}>
          <FormLabel>Last Name</FormLabel>
          <Input type='text' id='lastName' name='lastName' value={values.lastName} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={user.user.lastName} />
          <FormHelperText sx={{ height: '1rem' }}>{errors.lastName && touched.lastName ? errors.lastName : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={9}>
        <FormControl error={errors.birthDate && touched.birthDate ? true : false}>
          <FormLabel>Birth Date</FormLabel>
          <Input type='date' id='birthDate' name='birthDate' value={values.birthDate} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={birthDateDefaultValue} />
          <FormHelperText sx={{ height: '1rem' }}>{errors.birthDate && touched.birthDate ? errors.birthDate : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={9}>
        <FormControl error={errors.phoneNumber && touched.phoneNumber ? true : false}>
          <FormLabel>Phone Number</FormLabel>
          <Input type='tel' id='phoneNumber' name='phoneNumber' value={values.phoneNumber} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={user.user.phoneNumber} />
          <FormHelperText sx={{ height: '1rem' }}>{errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={9}>
        <FormControl error={errors.country && touched.country ? true : false}>
          <FormLabel>Country</FormLabel>
          <Input type='text' id='country' name='country' value={values.country} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={user.user.country} />
          <FormHelperText sx={{ height: '1rem' }}>{errors.country && touched.country ? errors.country : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={9}>
        <FormControl error={errors.city && touched.city ? true : false}>
          <FormLabel>City</FormLabel>
          <Input type='text' id='city' name='city' value={values.city} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={user.user.city} />
          <FormHelperText sx={{ height: '1rem' }}>{errors.city && touched.city ? errors.city : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={9}>
        <FormControl error={errors.education && touched.education ? true : false}>
          <FormLabel>Education</FormLabel>
          <Input type='text' id='education' name='education' value={values.education} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={user.user.education} />
          <FormHelperText sx={{ height: '1rem' }}>{errors.education && touched.education ? errors.education : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={9}>
        <FormControl error={errors.gender && touched.gender ? true : false}>
          <FormLabel>Gender</FormLabel>
          <Select name='gender' value={values.gender} onChange={(e, nV) => { handleChange(e, nV); setFieldValue('gender', nV); }} color='rgba(255, 255, 255, 0.1)' variant='plain' placeholder="Select your gender" indicator={<KeyboardArrowDown />} sx={{ [`& .${selectClasses.indicator}`]: { transition: '0.2s', [`&.${selectClasses.expanded}`]: { transform: 'rotate(-180deg)' } }, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Prefer not to say">Prefer not to say</Option>
          </Select>
          <FormHelperText sx={{ height: '1rem' }}>{errors.gender && touched.gender ? errors.gender : (' ')}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid xs={18}>
        <FormControl error={errors.bio && touched.bio ? true : false}>
          <FormLabel>Biography</FormLabel>
          <Textarea type='text' id='bio' name='bio' value={values.bio} onChange={handleChange} onBlur={handleBlur} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} placeholder={user.user.bio} minRows={4} />
          <FormHelperText sx={{ color: '#dedede', height: '1rem' }}>{errors.bio && touched.bio ? errors.bio : ('Let people know more about you.')}</FormHelperText>
        </FormControl>
      </Grid>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'end', mr: 1, mt: 4.2 }}>
        <Button onClick={() => setSettingModalOpen(false)}>Discard Changes</Button>
        <Button onClick={handleSubmit} loading={isSubmitting} type='submit' sx={{ ml: 3 }}>Submit Changes</Button>
      </Box>

    </>

  )
}

export default PersonalInformationTab