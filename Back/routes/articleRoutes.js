const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('../middleware/multer');
const auth = require('../middleware/auth');
const articleCtrl = require('../controllers/articleController');

router.post('/', auth, multer, articleCtrl.createArticle);
router.get('/', auth, articleCtrl.getAllArticles);
router.get('/:id', auth, articleCtrl.getOneArticle);
router.put('/:id', auth, multer, articleCtrl.updateArticle);
router.delete('/:id', auth, multer, articleCtrl.deleteArticle);


module.exports = router;