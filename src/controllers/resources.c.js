'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const firebase = require('../../config/db.config');
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");

var Localstorage=require('node-localstorage').LocalStorage;
Localstorage = new Localstorage('./scratch');

const User = require('../models/user.m');

exports.findAllSongs = async function (req, res) {
  //Localstorage.removeItem('subscription');
  var songGot,songs=[];
  if(Localstorage.getItem('token'))
  {
    if(Localstorage.getItem('subscription') == "LITE")
    {
      const snapshot = await firebase.collection('song').get();
      snapshot.forEach((doc) => {
        let createdAt=doc.data().createdAt;
        let dateInMillis = createdAt._seconds * 1000;
        var dateCreate= new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString();
        let updatedAt=doc.data().updatedAt;
        let dateInMillis2 = updatedAt._seconds * 1000;
        var dateUpdate= new Date(dateInMillis2).toDateString() + ' at ' + new Date(dateInMillis2).toLocaleTimeString();
        songGot= doc.data();
        songGot.createdAt=dateCreate;
        songGot.updatedAt=dateUpdate;
        songs.push(songGot);
        
      });
      //const snapshot = await firebase.collection('song').get();
      //snapshot.forEach((doc) => {
      //  let createdAt=doc.data().createdAt;
      //  let dateInMillis = createdAt._seconds * 1000;
      //  var dateCreate= new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString();
      //  let updatedAt=doc.data().updatedAt;
      //  let dateInMillis2 = updatedAt._seconds * 1000;
      //  var dateUpdate= new Date(dateInMillis2).toDateString() + ' at ' + new Date(dateInMillis2).toLocaleTimeString();
        res.status(200).send({ 
          error: false, 
          songs
        })
      //});
    }
    else
    {
      res.status(403).send({ error: true, "message":"Votre abonnement ne permet pas d'accéder à la ressource" })
    }

  }

  else
  {
    res.status(401).send({ error: true, "message":"votre token n\'est pas correct" })
  }
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
