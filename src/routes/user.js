const express = require('express');
const router = new express.Router();
const UsersModule = require('../constrollers/user');
const authMiddleWare = require('../middleware/auth');

router.post('/users/signup', UsersModule.createUser);
router.post('/users/login', UsersModule.loginUser);

router.post('/users/logout',authMiddleWare,UsersModule.logoutUser);
router.post('/users/logoutAll',authMiddleWare,UsersModule.logoutAllUser);

router.get('/users/me',authMiddleWare,UsersModule.getLoggedInUser)
router.get('/users', authMiddleWare,UsersModule.getAllUsers);

router.patch('/users/me',authMiddleWare, UsersModule.updateUser);

router.delete('/users/me',authMiddleWare, UsersModule.deleteUser);

module.exports = router;