'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const firebase = require('../../config/db.config');
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");
const jwt_decode = require('jwt-decode');


const User = require('../models/user.m');

exports.findAll = async function (req, res) {
    console.error(err)
    return true;
    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
//  try
//  {
//    var decoded = jwt_decode(req.headers.authorization);
//  }
//  catch(error)
//  {
//    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
//    return;
//  }
//  var songGot,songs=[];
//    if(decoded.subscription == "PREMIUM")
//    {
//      const snapshot = await firebase.collection('song').get();
//      snapshot.forEach((doc) => {
//        let createdAt=doc.data().createdAt;
//        let dateInMillis = createdAt._seconds * 1000;
//        var dateCreate= new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString();
//        let updatedAt=doc.data().updatedAt;
//        let dateInMillis2 = updatedAt._seconds * 1000;
//        var dateUpdate= new Date(dateInMillis2).toDateString() + ' at ' + new Date(dateInMillis2).toLocaleTimeString();
//        songGot= doc.data();
//        songGot.createdAt=dateCreate;
//        songGot.updatedAt=dateUpdate;
//        songGot.id=doc.id;
//        songs.push(songGot);
//        
//      });
//        res.status(200).send({ 
//          error: false, 
//          songs
//        })
//      //});
//    }
//    else
//    {
//      res.status(403).send({ error: true, "message":"Votre abonnement ne permet pas d'accéder à la ressource" })
//    }
//

};

exports.findSong = async function (req, res) {
  console.log('dfkllk')
  var songGot,songs=[];
  if(Localstorage.getItem('token'))
  {
    if(Localstorage.getItem('subscription') == "LITE")
    {
      const snapshot = await firebase.collection('song').get();
      snapshot.forEach((doc) => {
        if(req.params.id == doc.id)
        {
          if(doc.data().type == 'mp3')
          {
            let createdAt=doc.data().createdAt;
            let dateInMillis = createdAt._seconds * 1000;
            var dateCreate= new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString();
            let updatedAt=doc.data().updatedAt;
            let dateInMillis2 = updatedAt._seconds * 1000;
            var dateUpdate= new Date(dateInMillis2).toDateString() + ' at ' + new Date(dateInMillis2).toLocaleTimeString();
            songGot= doc.data();
            songGot.createdAt=dateCreate;
            songGot.updatedAt=dateUpdate;
            songGot.id=doc.id;
            songs.push(songGot);
            res.status(200).send({ 
              error: false, 
              songs
            })
          }
          else
          {
            res.status(409).send({"message":"l'audio n'est pas accessibles"})
          }
        }

      });
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
//
//exports.findAllBills = async function (req, res) {
//  var billGot,bills=[];
//    if(Localstorage.getItem('role') == "ROLE_ADMIN")
//    {
//      const snapshot = await firebase.collection('bill').get();
//      snapshot.forEach((doc) => {
//        //let createdAt= doc.data().createdAt;
//        //let dateInMillis = createdAt._seconds * 1000;
//        //var dateCreate= new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString();
//        //let updatedAt=doc.data().updatedAt;
//        //let dateInMillis2 = updatedAt._seconds * 1000;
//        //var dateUpdate= new Date(dateInMillis2).toDateString() + ' at ' + new Date(dateInMillis2).toLocaleTimeString();
//        billGot= doc.data();
//        //billGot.createdAt=dateCreate;
//        //billGot.updatedAt=dateUpdate;
//        //billGot.id=doc.id;
//        bills.push(billGot);
//      });
//        res.status(200).send({ 
//          error: false, 
//          bills
//        })
//    }
//    else
//    {
//      res.status(403).send({ error: true, "message":"Votre droit d'accès ne permet pas d'accéder à la ressource" })
//    }
//
//    // User.findAll(function (err, user) {
//    //     console.log('controller')
//    //     if (err)
//    //         res.send(err);
//    //     console.log('res', user);
//    //     res.send(user);
//    // });
//};
