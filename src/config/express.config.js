const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const tmp = require('tmp');

const { connectDB } = require('./../api/repository');
const { logs } = require('./../constants');
const session = require('./../config/session.config');
const routes = require('./../api/routes/v1');
const error = require('./../api/middlewares/error');

const app = express();

app.use(morgan(logs));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session());

connectDB();

app.use('/api/v1', routes);
app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

tmp.setGracefulCleanup();

module.exports = app;
