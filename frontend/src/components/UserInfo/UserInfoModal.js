import { Avatar, Box, Button, DialogContent, Modal, ModalDialog, Sheet, Stack, Typography } from "@mui/joy";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import axios from "axios";
import OminnectModal from "../Ominnect(messengerApp)/OminnectModal";
import { GeneralState } from "../../contexts/GeneralContext";

const UserInfoModal = ({ userInfoModal, setUserInfoModal, result, setSearchModal }) => {
    let index;
    const Navigate = useNavigate();
    const { user } = useAuthContext();
    const userFriends = user.user.friends
    const [successOpen, SetSuccessOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [buttonStatus, setButtonStatus] = useState('');
    const [ominnectModal, setOminnectModal] = useState(false);
    const { mode, setSelectedChat, chats, setChats } = GeneralState();

    const getHomeApi = mode === 'dev' ? process.env.REACT_APP_DEV_HOME_API : process.env.REACT_APP_DEP_HOME_API;
    const followApi = mode === 'dev' ? process.env.REACT_APP_DEV_FOLLOW_API : process.env.REACT_APP_DEP_FOLLOW_API;
    const unfollowApi = mode === 'dev' ? process.env.REACT_APP_DEV_UNFOLLOW_API : process.env.REACT_APP_DEP_UNFOLLOW_API;
    const accessChatApi = mode === 'dev' ? process.env.REACT_APP_DEV_ACCESS_CHAT_API : process.env.REACT_APP_DEP_ACCESS_CHAT_API;


    if (result) {
        index = userFriends.indexOf(result.username);
    };

    const fetchFriends = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };
        try {
            const { data } = await axios.get(getHomeApi, config);
            setFriends(data);
        } catch (error) {
            setErrorOpen(true);
            setErrorMsg(error);
            setTimeout(() => {
                setErrorOpen(false)
            }, 3500);
        };
    };

    useEffect(() => {
        fetchFriends();
        for (let index = 0; index < friends.length; index++) {
            const element = friends[index];
            if (element && result && element.username === result.username) {
                setButtonStatus('follow');
            } else {
                setButtonStatus('unfollow');
            };
        };
    }, [userInfoModal]);

    const close = () => {
        setUserInfoModal(false);
    };

    const handleProfile = () => {
        Navigate(`/${result.username}`);
        setUserInfoModal(false);
        setSearchModal(false);
    };

    const follow = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${followApi}${result.username}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ username: user.user.username })
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMsg(data.message);
                SetSuccessOpen(true);
                setSearchModal(false);
                setUserInfoModal(false);
                setTimeout(() => {
                    SetSuccessOpen(false);
                }, 3000);
            };
        } catch (error) {
            setErrorOpen(true);
            setErrorMsg(error);
            setTimeout(() => {
                setErrorOpen(false)
            }, 3500);
        };
        setIsLoading(false);
    };

    const unfollow = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${unfollowApi}${result.username}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ username: user.user.username })
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMsg(data.message);
                SetSuccessOpen(true);
                setSearchModal(false);
                setUserInfoModal(false);
                setTimeout(() => {
                    SetSuccessOpen(false);
                }, 3000);
            };
        } catch (error) {
            setErrorOpen(true);
            setErrorMsg(error);
            setTimeout(() => {
                setErrorOpen(false)
            }, 3500);
        };
        setIsLoading(false);
    };

    const handleMessage = async (receiverId) => {
        setOminnectModal(true);
        if (chats) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                };
                const matchingChat = chats.find(chat => chat.users.some(user => user.username === result.username));
                const { data } = await axios.post(accessChatApi, { receiverId }, config);
                if (!chats.find((c) => c._id === data._id)) {
                    setChats([data, ...chats]);
                    setSelectedChat(data);
                } else {
                    setSelectedChat(matchingChat);
                }
            } catch (error) {
                setErrorOpen(true);
                setErrorMsg(error);
                setTimeout(() => {
                    setErrorOpen(false)
                }, 3500);
            };
        };
    };

    return (
        <Box >
            <Modal open={userInfoModal} onClose={close} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <Sheet variant="solid" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 370, height: 500, borderRadius: 'lg', p: 1, boxShadow: 'lg', backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>

                    {result ?
                        (
                            <Stack spacing={8} sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar src={result.avatar} size="lg" variant='plain' color='primary' sx={{ width: 150, height: 150 }} />
                                <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'start' }}>
                                    <Typography><b>User Name:  </b>{result.username}</Typography>
                                    <Typography><b>Name:  </b>{result.firstName} {result.lastName}</Typography>
                                    <Typography><b>Email:  </b>{result.email}</Typography>
                                </Stack>
                                <Stack spacing={3} sx={{ width: '90%', height: '90%' }}>
                                    <Button variant="soft" onClick={handleProfile} sx={{ height: '40px' }} startDecorator={<PermIdentityIcon fontSize="large" />}>See the profile</Button>

                                    <Stack spacing={1} direction={"row"} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '20%' }}>
                                        {buttonStatus === 'follow' ? (
                                            <Button variant="soft" loading={isLoading} onClick={unfollow} sx={{ width: '50%', height: '40px' }} startDecorator={<PersonOffIcon />}>Unfollow</Button>
                                        ) : (
                                            <Button variant="soft" loading={isLoading} onClick={follow} sx={{ width: '50%', height: '40px' }} startDecorator={<PersonAddAltIcon />}>Follow</Button>
                                        )}
                                        <Button onClick={() => handleMessage(result._id)} variant="soft" sx={{ width: '50%', height: '40px' }} startDecorator={<MailOutlineIcon />}>Message</Button>
                                    </Stack>
                                </Stack>
                            </Stack>
                        ) : (
                            <Typography color="danger" startDecorator={<ReportGmailerrorredIcon />}>User could not be found!</Typography>
                        )}

                </Sheet>
            </Modal>
            <Modal open={errorOpen} >
                <ModalDialog variant="outlined" role="alertdialog" sx={{ minWidth: '400px', height: '200px', backgroundColor: 'rgba(255, 0, 0, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
                    <DialogContent sx={{ color: 'black' }}><b>Hey {user.user.firstName}</b>{errorMsg}</DialogContent>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    </Box>
                </ModalDialog>
            </Modal>

            <Modal open={successOpen} >
                <ModalDialog variant="outlined" role="alertdialog" sx={{ minWidth: '400px', minHeight: '80px', backgroundColor: 'rgba(0, 220, 0, 0.2)', backdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(50, 50, 50, 0.3)' }}>
                    <DialogContent sx={{ color: 'black' }}><b>Hey {user.user.firstName}</b>{successMsg}</DialogContent>
                </ModalDialog>
            </Modal>

            <OminnectModal ominnectModal={ominnectModal} setOminnectModal={setOminnectModal} />

        </Box >
    );
};

export default UserInfoModal;