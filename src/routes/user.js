const express = require('express');
const router = new express.Router();
const UsersModule = require('../constrollers/user');
const authMiddleWare = require('../middleware/auth');
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File format not supported'), false)
        }
        return cb(undefined, true);
    }
});

router.post('/users/signup', UsersModule.createUser);
router.post('/users/login', UsersModule.loginUser);

router.post('/users/me/avatar',authMiddleWare,upload.single('avatar'), UsersModule.uploadProfilePicture,UsersModule.uploadProfilePictureError)
router.post('/users/logout', authMiddleWare, UsersModule.logoutUser);
router.post('/users/logoutAll', authMiddleWare, UsersModule.logoutAllUser);

router.get('/users/me', authMiddleWare, UsersModule.getLoggedInUser)
router.get('/users', authMiddleWare, UsersModule.getAllUsers);
router.get('/users/:id/avatar',UsersModule.getProfilePicture)

router.patch('/users/me', authMiddleWare, UsersModule.updateUser);

router.delete('/users/me', authMiddleWare, UsersModule.deleteUser);
router.delete('/users/me/avatar',authMiddleWare,UsersModule.deleteProfilePicture)


module.exports = router;