require('dotenv').config();
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
var bodyParser = require('body-parser');
const routes = require('./routes');
const loggerUtil = require('./utilities/logger');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: loggerUtil.stream }));
app.use(express.static(path.join(__dirname, 'public')));
//app.set('view engine', 'ejs');


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use('/v1', routes);

module.exports = app;
