'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");

const User = require('../models/user.m');

const firebase = require('../../config/db.config');
const jwt_decode = require('jwt-decode');

var Localstorage=require('node-localstorage').LocalStorage;
Localstorage = new Localstorage('./scratch');

exports.update = async function (req, res) {
    var decoded = jwt_decode(req.headers.authorization);
    console.log(decoded.role);
    if (decoded.role != "ROLE_ADMIN") {
        res.status(403).send({ error: true, message: 'Vos droits d\'accès ne permettent pas d\'accéder à la ressource' });
    } else if (decoded.role == "" || decoded.firstname == "" || decoded.lastname == "" || decoded.email == "") {
        res.status(401).send({ error: true, message: 'Token n\est pas correct' });
    } else if (req.body.cartNumber.length < 5) {
        res.status(402).send({ error: true, message: 'Informations bancaire incorrectes' });
    } else if (req.body.month == 0 || req.body.year == 0 || req.body.defaults == "") {
        res.status(409).send({ error: true, message: 'Une ou plusieur données sont érronées' });
    }
    else {
        let cardExist = false;
        const snapshot = await firebase.collection('carte').get();
        snapshot.forEach((doc) => {
            if (req.body.cartNumber === doc.data().cartNumber) {
                cardExist = true;
            }
        });
        if (cardExist) {
            res.status(409).send({ error: true, message: 'La carte existe déjà' });
        } else {
            console.log("req.params.id", req.body.id);
            const id = req.body.id;
            const data = req.body;
            const docRef = firebase.collection('carte').doc(req.body.id);
            await docRef.set({
                cartNumber: req.body.cartNumber,
                month: req.body.month,
                year: req.body.year,
                defaults: req.body.defaults,
            });
            res.status(201).send({ error: false, message: 'Vos données ont été mises à jour' });
        }
    }
};

exports.subscribe = async function (req, res) {
  var decoded = jwt_decode(req.headers.authorization);
  if (decoded.role != "ROLE_ADMIN") {
    res.status(403).send({ error: true, message: 'Vos droits d\'accès ne permettent pas d\'accéder à la ressource' });
  }
     else if (decoded.role == "" || decoded.firstname == "" || decoded.lastname == "" || decoded.email == "") {
        res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
    } 
     else if (req.body.id == '' || req.body.cvc == "") {
        res.status(400).send({ error: true, message: 'Une ou plusieurs données obligatoire sont manquantes' });
    }
     else if (req.body.montant == '' || req.body.montant == 0 || req.body.montant < 30) {
        res.status(402).send({ error: true, message: 'Echec de payment de l\'offre' });
    }
  else
  {
    if(req.body.montant == 30 || req.body.montant < 40)
    {
      const data = req.body;
      const docRef = firebase.collection('carte').doc(req.body.id);
      await docRef.set({
        subscription: "LITE",
      });
      res.status(201).send({ error: false, message: 'Vos données ont été mises à jour' });
    }
  }
}; 
