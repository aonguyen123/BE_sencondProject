const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');

const { connectDB } = require('./../api/repository');
const { logs } = require('./../constants');
const routes = require('./../api/routes/v1');
const error = require('./../api/middlewares/error');


const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(morgan(logs));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

app.use('/api/v1', routes);
app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

module.exports = server;
