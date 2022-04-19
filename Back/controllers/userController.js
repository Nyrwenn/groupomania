const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');
const fs = require('fs');


const schema = Joi.object({
    email: Joi.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
})


exports.signup = (req, res) => {
    console.log(req.body)
    console.log(req.file)
    const profile = req.file ?
        {
            ...JSON.parse(req.body.profile),
            avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        } : { ...req.body };
    console.log(profile)

    schema.validateAsync({
        email: profile.email,
        password: profile.password
    })
        .then((data) => {
            bcrypt.hash(profile.password, 10)
                .then(hash => {
                    db.User.create({
                        ...profile,
                        avatar: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
                        admin: false,
                        password: hash,
                    })
                        .then(() => {
                            res.status(201).json({ message: "User created !" });
                        })
                        .catch((error) => {
                            res.status(400).json({ error });
                        })
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).json({ error })
                });

        })
        .catch((error) => {
            res.status(400).json({ error });
        })
};


exports.login = (req, res, next) => {

    db.User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "User not found !" })
            }

            console.log(user);
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Incorrect password !" })
                    }
                    return res.status(200).json({
                        userId: user.id,
                        admin: user.admin,
                        token: jwt.sign(
                            { userId: user.id, admin: user.admin },
                            process.env.PassJWT,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));


}

exports.modifyUser = (req, res, next) => {
    const userObject = req.file ?
        {
            ...JSON.parse(req.body.profile),
            avatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        } : { ...req.body };

    bcrypt.hash(userObject.password, 10).then((valid) => {
        userObject.password = valid
        db.User.findOne({ where: { id: req.params.id } })
            .then((user) => {
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, process.env.PassJWT);
                const userId = decodedToken.userId;
                if (userId === user.id) {

                    let filename = null;
                    if (req.file) {
                        filename = user.avatar.split('/images/')[1];
                    }

                    fs.unlink(`images/${filename}`, () => {
                        db.User.update({
                            ...userObject,
                        }, { where: { id: req.params.id } })
                            .then(() => res.status(200).json({ message: "Modified user !" }))
                            .catch((error) => {
                                console.log(error)
                                res.status(400).json({ error, message: "error" })
                            });
                    })


                } else {
                    res.status(403).json({ message: "Unauthorized request" })
                }
            }).catch((error) => res.status(400).json({ error, message: "error two" }));
    }).catch((error) => res.status(400).json({ error, message: "error two" }));


};

exports.deleteUser = (req, res) => {
    db.User.findOne({ where: { id: req.params.id } })
        .then(user => {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.PassJWT);
            const userId = decodedToken.userId;

            if (userId === user.id) {
                let filename = '';
                if (user.avatar) {
                    filename = user.avatar.split('/images')[1];
                }
                db.Article.findAll({ where: { userId: userId } })
                    .then((articles) => {
                        //DELETE
                        console.log(articles);
                        for (let article of articles) {
                            console.log(article);
                            const fileArticle = article.picture.split('/images')[1];
                            fs.unlink(`images/${fileArticle}`, () => {

                            })
                        }

                    }).finally(() => {

                        fs.unlink(`images/${filename}`, () => {
                            db.User.destroy({ where: { id: req.params.id } })
                                .then(() => {
                                    res.status(200).json({ message: "User removed !" })
                                })
                                .catch((error) => {
                                    console.log("err une", error);
                                    res.status(400).json({ error });
                                });

                        })
                    })



            } else {
                res.status(403).json({ message: "Unauthorized request!" })
            }
        })
        .catch(error => {
            console.log("err two", error)
            res.status(400).json({ error });
        })

}

/* Controller to get all the users, will probably be useful in the future

exports.getAllUsers = (req, res) => {
    db.User.findAll()
        .then(user => res.json(user))
        .catch(error => res.status(400).json({ error }))
};*/


exports.getOneUser = (req, res) => {
    db.User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            const newUser = {
                avatar: user.avatar,
                name: user.name,
                firstname: user.firstname,
                email: user.email
            }
            res.status(200).json(newUser)
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error })
        })
};

exports.me = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.PassJWT);
    const userId = decodedToken.userId;

    db.User.findOne({ where: { id: userId } })
        .then((user) => {
            return res.status(200).json({
                userId: userId,
                admin: user.admin,
                token: jwt.sign(
                    { userId: userId, admin: user.admin },
                    process.env.PassJWT,
                    { expiresIn: '24h' }
                )
            });
        }
        )
        .catch((error) => {
            console.log(error)
            res.status(400).json({ error })
        })
}




