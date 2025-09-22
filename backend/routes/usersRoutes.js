const express = require('express');
const { fuck, getUser, getUserFriends, editUser, deleteUser, addOrRemoveFriend, searchAllUsers } = require('../controllers/userController');

const verifyToken = require('../middlewares/verification');


const router = express.Router();

// router.get('/', fuck);


router.get('/', verifyToken, getUser);
router.patch('/profile/setting/:userId', verifyToken, editUser);
router.delete('/profile/setting', verifyToken, deleteUser);
router.get('/friends', verifyToken, getUserFriends);
router.patch('/friends/:friendId', verifyToken, addOrRemoveFriend);
router.get('/search', verifyToken, searchAllUsers);

module.exports = router;