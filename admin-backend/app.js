const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const viewEngines = require('consolidate');
const path = require('path');
const passport = require('passport');
const { passportJWTAuthentication } = require('./config/passport');
const { registerEvents } = require('./events/index');
require('dotenv').config();
require('./models/index');
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
app.engine('html', viewEngines.swig);
app.set('views', __dirname + '/views');
const { registerWorkers } = require('./jobs/index');
registerWorkers();
// Initialize Passport.js
app.use(passport.initialize());
passportJWTAuthentication(passport);

// Get the Access Token
app.use((req, res, next) => {
    passport.authenticate(
        'jwt'
        , { session: false }
        , (err, authenticateResponse) => {

            if (err) {
                return next(err);
            }

            if (authenticateResponse.type === 'user') {
              req.user = authenticateResponse.model;
            }
            if (authenticateResponse.type === 'adminUser') {
              req.adminUser = authenticateResponse.model;
            }

            next();
        }
    )(req, res, next);
});

// Enable CORS
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

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    res.status(error.status || 500);
    res.json({
        error: {
          message: error.message
        }
    });
});

// Event register
registerEvents(app);

module.exports = app;
