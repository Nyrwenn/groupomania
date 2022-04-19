const db = require('../models');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createArticle = (req, res) => {
    db.Article.create({
        UserId: req.body.userId,
        legend: req.body.legend,
        picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

        .then(() => {
            res.status(201).json({ message: "Article created !" })
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error })
        })
};

exports.updateArticle = (req, res) => {
    console.log(req.body)
    const articleObject = req.file ?
        {
            ...(req.body),
            picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    db.Article.findOne({ where: { id: req.params.id } })
        .then((article) => {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.PassJWT);
            const userId = decodedToken.userId;
            const admin = decodedToken.admin;
            if (userId === article.UserId || admin) {

                let filename = null;
                if (req.file) {
                    filename = article.picture.split('/images/')[1];
                }

                fs.unlink(`images/${filename}`, () => {
                    db.Article.update({
                        ...articleObject,
                    }, { where: { id: req.params.id } })
                        .then(() => res.status(200).json({ message: "Modified article!" }))
                        .catch((error) => {
                            console.log(error)
                            res.status(400).json({ error });
                        });


                })
            } else {
                res.status(403).json({ message: "Unauthorized request !" })

            }

        })
        .catch((error) => {
            console.log('ici erreur', error)
            res.status(400).json({ error })
        })
}

exports.deleteArticle = (req, res) => {
    db.Article.findOne({ where: { id: req.params.id } })
        .then(article => {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.PassJWT);
            const userId = decodedToken.userId;
            const admin = decodedToken.admin;

            if (userId === article.UserId || admin) {
                const filename = article.picture.split('/images')[1];
                fs.unlink(`images/${filename}`, () => {
                    db.Article.destroy({ where: { id: req.params.id } })
                        .then(() => {
                            res.status(200).json({ message: 'Article removed !' });
                        })
                        .catch((error) => {
                            res.status(400).json({ error });
                        });
                });
            } else {
                res.status(403).json({ message: "Unauthorized request!" })
            }
        })
        .catch(error => {
            res.status(400).json({ error });
        })



}

exports.getAllArticles = (req, res, next) => {
    db.Article.findAll({
        include: [{
            model: db.User,
            attributes: ['avatar', 'name', 'firstname'],

        },

        {
            model: db.Like,
            attributes: ['userId']
        },
        {
            model: db.Comment,
            attributes: ['id', 'commentary'],
            include: {
                model: db.User,
                attributes: ['id', 'avatar', 'name', 'firstname']
            }
        }
        ]

    })
        .then((articles) => res.status(200).json(articles))
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error })
        })
}

exports.getOneArticle = (req, res) => {
    db.Article.findOne({ where: { id: req.params.id } })
        .then((article) => res.status(200).json(article))
        .catch((error) => res.status(400).json({ error }))
}