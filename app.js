const express = require('express');
const mongoose = require('mongoose')
const config = require('./config/database');
const MongoStore = require('connect-mongo');
const session = require('express-session');
var cors = require('cors');
const app = express();


const port = process.env.PORT || 5004;

app.use(cors({
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: config.database}),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

require('./startup/routes')(app);
app.listen(port, () => {
    mongoose.connect(config.database)
    .then(() => console.log('Connected to database ' + config.database))
    .catch(err => console.error('Error in connection' + err));
    console.log('Server started at port ' + port);
});
