const express = require('express');
const router = express.Router();
const db = require('../models');
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');


//Road to get all the users, will probably be useful in the future
//router.get("/users", auth, userCtrl.getAllUsers);


router.get('/me', auth, userCtrl.me);
router.post('/profile', multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.getOneUser);
router.put('/profile/:id', auth, multer, userCtrl.modifyUser);
router.delete('/profile/:id', auth, multer, userCtrl.deleteUser);


module.exports = router;