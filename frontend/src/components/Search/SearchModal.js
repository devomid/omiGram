import { Box, DialogContent, DialogTitle, Divider, FormControl, FormLabel, Input, Modal, ModalDialog, Sheet, Stack } from '@mui/joy';
import axios from 'axios';
import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserListItem from '../maplableObj/UserListItem';
import { useNavigate } from 'react-router-dom';
import UserInfoModal from '../UserInfo/UserInfoModal';
import PuffLoader from "react-spinners/PuffLoader";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { GeneralState } from '../../contexts/GeneralContext';


const SearchModal = ({ searchModal, setSearchModal }) => {
  const { user } = useAuthContext();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userInfoModal, setUserInfoModal] = useState(false)
  const [result, setResult] = useState(null);
  const { mode } = GeneralState();

  const searchApi = mode === 'dev' ? process.env.REACT_APP_DEV_SEARCH_API : process.env.REACT_APP_DEP_SEARCH_API;


  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      setSearch('');
      return;
    } else if (query) {
      try {
        setIsLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        };
        const { data } = await axios.get(`${searchApi}${search}`, config);
        if (data.length < 1) {
          setIsLoading(false);
          setErrorOpen(true);
          setErrorMsg('No user to show!  Please change yor search phrase and try again.');
          setSearchResult([]);
          setTimeout(() => {
            setErrorOpen(false);
          }, 3500);

        } else if (data.length >= 1) {
          setIsLoading(false);
          setSearchResult(data);
          return;
        };
      } catch (error) {
        setErrorMsg(error);
        setErrorOpen(true);
        setTimeout(() => {
          setErrorOpen(false)
        }, 3500);
      };
    };
  };

  const handleSearchClick = (result) => {
    setUserInfoModal(true);
    setResult(result);
  };

  const close = () => {
    setSearchModal(false);
    setSearchResult([]);
    setSearch('')
  };

  return (
    <Box >
      <Modal open={searchModal} onClose={close} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Sheet variant="solid" sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-start', width: 350, height: 500, borderRadius: 'lg', p: 3, boxShadow: 'lg', backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(5px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Box>
              <FormControl >
                <FormLabel sx={{ color: 'rgb(242, 83, 49)' }}>Search input</FormLabel>
                <Input sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }} error={errorOpen} placeholder="Search users here..." type="search" onChange={(e) => handleSearch(e.target.value)} />
              </FormControl>
            </Box>
            <Box sx={{ overflow: 'auto', scrollbarWidth: "none", '&::-webkit-scrollbar': { display: 'none' }, '&-ms-overflow-style:': { display: 'none' }, height: 440, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {isLoading ? (
                <PuffLoader color="#6e3e8e" size={140} cssOverride={null} speedMultiplier={1} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                  {searchResult.map(result => (<UserListItem key={result._id} user={result} open={searchModal} setOpen={setSearchModal} handleFunction={() => handleSearchClick(result)} />))}
                </Box>
              )}
            </Box>
          </Stack>
        </Sheet>
      </Modal>

      <UserInfoModal userInfoModal={userInfoModal} setUserInfoModal={setUserInfoModal} result={result} setSearchModal={setSearchModal} />

      <Modal open={errorOpen} >
        <ModalDialog variant="outlined" role="alertdialog" sx={{ minWidth: '400px', height: '200px', backgroundColor: 'rgba(255, 0, 0, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
          <DialogContent sx={{ color: 'black' }}><b>Hey {user.user.firstName}</b>{errorMsg}</DialogContent>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          </Box>
        </ModalDialog>
      </Modal>

    </Box >
  );
};

export default SearchModal;