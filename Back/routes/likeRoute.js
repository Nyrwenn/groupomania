const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/likeController');


router.get('/:articleId', auth, likeCtrl.like);

module.exports = router;