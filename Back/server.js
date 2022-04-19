const express = require('express');
const app = express();
const db = require("./models");
const helmet = require('helmet');
const PORT = process.env.PORT || 8000;
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));
app.disable('x-powered-by');

app.use('/images', express.static(path.join(__dirname, 'images')));

const user = require('./routes/userRoutes');
app.use("/users", user);

const article = require('./routes/articleRoutes');
app.use("/article", article);

const like = require('./routes/likeRoute');
app.use("/like", like);

const comment = require('./routes/commentRoutes');
app.use("/comment", comment);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on: http://localhost:${PORT}`);
    });
});




