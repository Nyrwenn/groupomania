const db = require('../models');
const jwt = require('jsonwebtoken');

exports.like = (req, res) => {
    const ArticleId = req.params.articleId;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.PassJWT);
    const userId = decodedToken.userId;
    console.log({
        userId: userId,
        ArticleId: ArticleId
    })
    db.Like.findOne({
        where: {

            ArticleId: ArticleId,
            userId: userId,

        }
    })
        .then((like) => {
            console.log(like)
            if (like === null) {
                db.Like.create({
                    userId: userId,
                    ArticleId: ArticleId
                })
                    .then(() => {
                        res.status(200).json({ message: 'liked' })
                    })

                    .catch((error) => res.status(500).json({ error }))

            } else {
                db.Like.destroy({
                    where: {
                        userId: userId,
                        ArticleId: ArticleId
                    }
                })

                    .then(() => {
                        res.status(200).json({ message: 'disliked' })
                    })

                    .catch((error) => res.status(500).json({ error }))

            }
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: 'error' })
        })

}