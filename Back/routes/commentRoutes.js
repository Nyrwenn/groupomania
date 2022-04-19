const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/commentController');

router.post('/:articleId', auth, commentCtrl.createComment);
router.delete('/:id', commentCtrl.deleteComment);

module.exports = router;