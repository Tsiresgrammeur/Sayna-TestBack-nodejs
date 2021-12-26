const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const usersRoutes = require('../src/routes/user.r')(app);
const cartRoutes = require('../src/routes/cart.r')(app);
const songRoutes = require('../src/routes/song.r')(app);
const billRoutes = require('../src/routes/bill.r')(app);

// Export the app instance for unit testing via supertest
module.exports = app;
