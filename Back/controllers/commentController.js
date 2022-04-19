const db = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createComment = (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.PassJWT)
    const userId = decodedToken.userId;
    const ArticleId = req.params.articleId;
    console.log(userId);

    db.Comment.create({
        UserId: userId,
        ArticleId: ArticleId,
        commentary: req.body.commentary
    })

        .then(() => {
            res.status(201).json({ message: "Commentary posted !" })
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error })
        }
        )
};

exports.deleteComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.PassJWT)
    const userId = decodedToken.userId;
    const admin = decodedToken.admin;

    db.Comment.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(commentary => {

            if (userId === commentary.UserId || admin) {
                db.Comment.destroy({
                    where:
                    {
                        id: req.params.id
                    }
                })
                    .then(() => {
                        res.status(200).json({ message: 'Commentary deleted ! ' })
                    })
                    .catch((error) => {
                        console.log("here error", error);
                        res.status(400).json({ error });
                    });
            } else {
                res.status(403).json({ message: "Unauthorized request ! " })
            }

        })

        .catch((error) => {
            console.log("This is the error", error);
            res.status(500).json({ error })
        })


}

