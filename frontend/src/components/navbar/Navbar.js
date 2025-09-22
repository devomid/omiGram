import { Avatar, Badge, Box, Button, Divider, Dropdown, Grid, IconButton, Link, Menu, MenuButton, MenuItem, Stack, ToggleButtonGroup, Tooltip, Typography } from '@mui/joy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import OminnectModal from '../Ominnect(messengerApp)/OminnectModal';
import SearchModal from '../Search/SearchModal';
import SettingModal from '../setting/SettingModal';
import LogoutModal from './LogoutModal';
import HubIcon from '@mui/icons-material/Hub';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { GeneralState } from '../../contexts/GeneralContext';
import { getSender } from '../Ominnect(messengerApp)/Utils/chatLogics';

const Navbar = () => {
  const { user } = useAuthContext();
  const { notification, setNotification, setSelectedChat, ominnectModal, setOminnectModal } = GeneralState();
  const userAvatar = JSON.parse(localStorage.getItem('userAvatar'));
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userAvatar');
    logout();
    setLogoutModal(false);
    navigate('/');
    window.location.reload()
  };

  console.log(userAvatar);

  return (
    <Box>

      {user && (
        <Grid container columns={12} sx={{ ml: 2 }}>

          {/* Search Bar */}
          <Grid xs={12} sm={3} md={3} lg={3} sx={{ mt: 1, display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
            <Tooltip title='Search...' arrow color="primary" placement="bottom" size="md" variant="plain">
              <Button sx={{ marginRight: 20 }} variant='plain' startDecorator={<SearchIcon sx={{ width: 25, height: 25 }} fontSize='large' />} onClick={() => setSearchModal(true)}></Button>
            </Tooltip>
          </Grid>

          {/* Home Link */}
          <Grid xs={12} sm={5} md={5} lg={6} >
            <Tooltip title={`Home of ${user.user.firstName}`} arrow color="primary" placement="bottom" size="lg" variant="plain">
              <Link href={'/home'} underline='none'>
                <Typography color='primary' level='h1' sx={{ WebkitTextStrokeColor: 'white', WebkitTextStrokeWidth: 0.07 }}>OmiGram</Typography>
              </Link>
            </Tooltip>
          </Grid>


          {/* Info Section */}
          <Grid xs={12} sm={4} md={4} lg={3}>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <Tooltip enterDelay={500} title='Ominnect' arrow color="primary" placement="bottom-end" size="md" variant="plain">
                <Badge badgeInset="5px 10px" invisible={!notification.length} color="danger" size="sm" variant="solid">
                  <IconButton sx={{ mr: 1 }} onClick={() => setOminnectModal(true)} /* onClick={test} */ ><HubIcon color='primary' /></IconButton>
                </Badge>
              </Tooltip>

              <Dropdown>
                <Tooltip enterDelay={500} title='Notifications' arrow color="primary" placement="bottom-start" size="md" variant="plain">
                  <Badge badgeContent={notification.length} max={9} badgeInset="3px 25px" variant="solid" color="danger" size="sm">
                    <MenuButton sx={{ mr: 1 }} variant='plain'><NotificationsNoneOutlinedIcon color='primary' /></MenuButton>
                  </Badge>
                </Tooltip>
                <Menu sx={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(1px) saturate(180%)', borderRadius:'18px' }} placement="bottom-end">

                  {!notification.length && <MenuItem><Typography>No new messages</Typography></MenuItem>}

                  {notification.map((notif) => (
                    <MenuItem key={notif._id} onClick={() => {
                      setOminnectModal(true);
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}>
                      {notif.chat.isGroupChat ?
                        <Box>
                          <Typography>
                            New Message in {notif.chat.chatName}
                          </Typography>
                          <Typography>
                            {notif.content.length > 21
                              ? notif.content.substring(0, 20) + "..."
                              : notif.content}
                          </Typography>
                        </Box>
                        :
                        <Box>
                          <Typography>
                            New Message from {getSender(user, notif.chat.users)}
                          </Typography>
                          <Typography>
                            {notif.content.length > 21
                              ? notif.content.substring(0, 20) + "..."
                              : notif.content}
                          </Typography>
                        </Box>
                      }
                    </MenuItem>
                  ))}
                </Menu>
              </Dropdown>

              <Dropdown>
                <Tooltip title='Account Settings' enterDelay={500} arrow color="primary" placement="bottom-end" size="md" variant="plain">
                  <MenuButton sx={{ mr: 2 }} variant='plain' startDecorator={<Avatar size='md' src={userAvatar && userAvatar.avatar} variant='plain' color='primary' />} endDecorator={<MoreVertOutlinedIcon color='primary' />} ><Typography color='primary'>{/* {user && user.firstName} */}{user.user.firstName}</Typography></MenuButton>
                </Tooltip>
                <Menu sx={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px) saturate(180%)', borderRadius:'18px' }}>
                  <MenuItem onClick={() => navigate(`/${user.user.username}`)}><Avatar src={userAvatar && userAvatar.avatar} variant='plain' />
                    <Stack sx={{ m: 1 }}>
                      <Typography sx={{ ml: 3, mr: 2 }}>{user.user.firstName} {user.user.lastName}</Typography>
                      <Typography sx={{ ml: 3, mr: 2 }}>{user.user.email}</Typography>
                    </Stack>
                  </MenuItem>

                  <Divider />

                  <Stack sx={{ m: 2 }}>
                    <MenuItem sx={{ mb: 2, display: 'flex', justifyContent: 'space-around' }} onClick={() => setSettingModalOpen(true)}><SettingsOutlinedIcon /><Typography sx={{ ml: 3, mr: 2 }}>Settings</Typography></MenuItem>
                    <MenuItem sx={{ display: 'flex', justifyContent: 'space-around' }} onClick={() => setLogoutModal(true)}><LogoutOutlinedIcon /><Typography sx={{ ml: 3, mr: 2 }}>LogOut</Typography></MenuItem>
                  </Stack>

                </Menu>
              </Dropdown>

            </Box>
            <LogoutModal logoutModal={logoutModal} setLogoutModal={setLogoutModal} handleLogout={handleLogout} />
            <SearchModal searchModal={searchModal} setSearchModal={setSearchModal} />
            <OminnectModal ominnectModal={ominnectModal} setOminnectModal={setOminnectModal} /* socket={socket} */ />
            <SettingModal settingModalOpen={settingModalOpen} setSettingModalOpen={setSettingModalOpen} />
          </Grid>


        </Grid>
      )}
      {!user && (
        <div></div>
      )}
    </Box>
  );
};

export default Navbar;

