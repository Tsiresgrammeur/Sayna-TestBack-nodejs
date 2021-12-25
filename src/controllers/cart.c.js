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
  try
  {
    var decoded = jwt_decode(req.headers.authorization);
  }
  catch(error)
  {
    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
    return;
  }
    var decoded = jwt_decode(req.headers.authorization);
    if (decoded.role != "ROLE_ADMIN") {
        res.status(403).send({ error: true, message: 'Vos droits d\'accès ne permettent pas d\'accéder à la ressource' });
    }
     else if (req.body.cartNumber.length < 5) {
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
  try
  {
    var decoded = jwt_decode(req.headers.authorization);
  }
  catch(error)
  {
    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
    return;
  }
  if (decoded.role != "ROLE_ADMIN") {
    res.status(403).send({ error: true, message: 'Vos droits d\'accès ne permettent pas d\'accéder à la ressource' });
  }
  else if (req.body.id == '' || req.body.cvc == "") {
    res.status(400).send({ error: true, message: 'Une ou plusieurs données obligatoire sont manquantes' });
  }
  else if (req.body.montant == '' || req.body.montant == 0 || req.body.montant < 30) {
    res.status(402).send({ error: true, message: 'Echec de payment de l\'offre' });
  }
  else
  {
    const card = firebase.collection('carte').doc(req.body.id);
    const data = await card.get();
    if(data.data().subcription != undefined || data.data().subscription !="")
    {
      if(req.body.montant == 30 || req.body.montant < 40)
      {
        await card.set({
          subscription: "LITE",
          cartNumber: data.data().cartNumber,
          cvc: data.data().cvc,
          defaults: data.data().defaults,
          month: data.data().month,
          year: data.data().year
        });
      }
      else if(req.body.montant == 40 || req.body.montant < 50)
      {
        await card.set({
          subscription: "ACCESS",
          cartNumber: data.data().cartNumber,
          cvc: data.data().cvc,
          defaults: data.data().defaults,
          month: data.data().month,
          year: data.data().year
        });
      }
      else
      {
        await card.set({
          subscription: "PREMIUM",
          cartNumber: data.data().cartNumber,
          cvc: data.data().cvc,
          defaults: data.data().defaults,
          month: data.data().month,
          year: data.data().year
        });

      }
    }
    else
    {
      await card.set({
        subscription: "LITE",
        cartNumber: data.data().cartNumber,
        cvc: data.data().cvc,
        defaults: data.data().defaults,
        month: data.data().month,
        year: data.data().year
      });

      setTimeout(async function(){
        await card.set({
          subscription: "nothing",
          cartNumber: data.data().cartNumber,
          cvc: data.data().cvc,
          defaults: data.data().defaults,
          month: data.data().month,
          year: data.data().year
        });
      },300000)
    }

    res.status(201).send({ error: false, message: 'Vos données ont été mises à jour' });
  }
}; 
