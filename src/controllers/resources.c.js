'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const firebase = require('../../config/db.config');
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");

const User = require('../models/user.m');

exports.findAllSongs = async function (req, res) {
  const snapshot = await firebase.collection('song').get();
snapshot.forEach((doc) => {
    res.status(200).send({ 
      error: false, 
      "songs": [
        { "id": doc.id,
          "name": doc.data().name,
          "url": doc.data().url,
          "cover":doc.data().cover,
          "time": doc.data().time,
          "type": doc.data().type,
          "url": doc.data().url
        }
      ]
    })
});


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
