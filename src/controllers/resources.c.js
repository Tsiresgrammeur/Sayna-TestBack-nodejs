'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");

const User = require('../models/user.m');

exports.findAllSongs = function (req, res) {
    res.send("all songs");

    // User.findAll(function (err, user) {
    //     console.log('controller')
    //     if (err)
    //         res.send(err);
    //     console.log('res', user);
    //     res.send(user);
    // });
};

exports.findSong = function (req, res) {

    res.send("one song");
    // User.findAll(function (err, user) {
    //     console.log('controller')
    //     if (err)
    //         res.send(err);
    //     console.log('res', user);
    //     res.send(user);
    // });
};

exports.findAllBills = function (req, res) {
    res.send("all bills");

    // User.findAll(function (err, user) {
    //     console.log('controller')
    //     if (err)
    //         res.send(err);
    //     console.log('res', user);
    //     res.send(user);
    // });
};
