const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.PassJWT);
        const userId = decodedToken.userId;
        const admin = decodedToken.admin;
        console.log('admin', admin)

        if (admin) {
            console.log('admin?');
            next()
        } else {

            if (req.body.userId && req.body.userId !== userId) {
                throw 'User Id not valid ! ';

            } else {
                next()
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error: new Error('unauthorized request ') });
    }
}



