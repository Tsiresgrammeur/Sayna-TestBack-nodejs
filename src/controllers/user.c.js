'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config");

const User = require('../models/user.m');

const firebase = require('../../config/db.config');
const jwt_decode = require('jwt-decode');

const Tentative = require('../models/tentative.m');

var tentative_array = new Array();


exports.login = async function (req, res) {
  var wrongMailSame = false;
  var sameError = false;
  var tentative;
  var booleans = new Array();
  if (req.body.email == "" || req.body.password == "") {
    res.status(400).send({ error: true, message: 'Email/Password manquant' });
  } else {
    const snapshot = await firebase.collection('user').get();
    snapshot.forEach((doc) => {
      if (req.body.email === doc.data().email) {
        bcrypt.compare(req.body.password, doc.data().password, function (err, res_) {
          if (res_) {
            var token = jwt.sign({ firstname: doc.data().firstname, lastname: doc.data().lastname, email: doc.data().email,role:doc.data().role, subscription: doc.data().subscription }, authConfig.secret, {
              expiresIn: 3600 // 1 hour
            });
            var refresh_token = jwt.sign({ firstname: doc.data().firstname, lastname: doc.data().lastname, email: doc.data().email,role:doc.data().role, subscription: doc.data().subscription  }, authConfig.secret, {
              expiresIn: 86400 // 24 hours
            });
            let createdAt=doc.data().createdAt;
            let dateInMillis = createdAt._seconds * 1000;
            var dateCreate= new Date(dateInMillis).toDateString() + ' at ' + new Date(dateInMillis).toLocaleTimeString();
            let updatedAt=doc.data().updateAt;
            let dateInMillis2 = updatedAt._seconds * 1000;
            var dateUpdate= new Date(dateInMillis2).toDateString() + ' at ' + new Date(dateInMillis2).toLocaleTimeString();
            res.status(200).send({ error: false, message: "L'utilisateur a été authentifié avec succès",
              user: {
                firstname:doc.data().firstname,
                lastname:doc.data().lastname,
                email:doc.data().email,
                sexe:doc.data().sexe,
                dateNaissance:doc.data().dateNaissance,
                createdAt: dateCreate,
                updatedAt: dateUpdate
              },
              access_token: token, 
              refresh_token: refresh_token
            });
          } else {
            res.status(400).send({ error: true, message: 'Password incorrect' });
          }
        });
        booleans.push(true);
      }
      else {
        booleans.push(false);
      }

    });
    if (!treatBooleans(booleans)) {
      if (tentative_array.length == 0) {
        tentative = new Tentative(req.body.email, 1, "");
        wrongMailSame = true;
        sameError = true;
      } else {
        tentative_array.forEach((tenta) => {
          if (tenta.getEmail() === req.body.email) {
            wrongMailSame = false;
            if (tenta.getNbTentative() < 5) {
              tenta.setNbTentative((tenta.getNbTentative() + 1));
              sameError = true;
            } else {
              if (tenta.getToken() == "") {
                var token_tenta = jwt.sign({ email: tenta.getEmail(), nbTentative: tenta.getNbTentative() }, authConfig.secret, {
                  expiresIn: 60 // 1 minute
                });
                let nb = (tenta.getNbTentative() + 1);
                tenta.setNbTentative(nb);
                tenta.setToken(token_tenta);
                sameError = false;
                res.status(429).send({ error: true, message: `trop de tentative sur l'email ${tenta.getEmail()} (5 - Max) - Veuillez patienter (1 - Min)` });
              } else {
                if (isTokenTentativeExpired(tenta.getToken())) {
                  tenta.setNbTentative(1);
                  tenta.setToken("");
                  sameError = true;
                } else {
                  var token_tenta = jwt.sign({ email: tenta.getEmail(), nbTentative: tenta.getNbTentative() }, authConfig.secret, {
                    expiresIn: 60 // 1 minutes
                  });
                  sameError = false;
                  tenta.setToken(token_tenta);
                  res.status(429).send({ error: true, message: `trop de tentative sur l'email ${tenta.getEmail()} (5 - Max) - Veuillez patienter (1 - Min)` });
                }
              }

            }
          } else {
            tentative = new Tentative(req.body.email, 1, "");
            sameError = true;
            wrongMailSame = true;
          }
        });
      }
    } else {
      wrongMailSame = true;
    }
    var bool = await treatBooleans(booleans);
    if (!bool) {
      wrongMailSame ? tentative_array.push(tentative) : console.log("the same");
    }
    if (sameError) {
      res.status(400).send({ error: true, message: 'Email/Password incorrect' });
    }
  }

}


function isTokenTentativeExpired(token) {
  const payloadBase64 = token.split('.')[1];
  const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
  const decoded = JSON.parse(decodedJson);
  const exp = decoded.exp;
  const expired = (Date.now() >= exp * 1000);
  return expired;
}

function treatBooleans(booleans) {
  var bool = false;
  for (let i = 0; i < booleans.length; i++) {
    bool += booleans[i];
  }
  return bool;
}

exports.register = async function (req, res) {
  if (req.body.firstname == "" || req.body.lastname == "" || req.body.email == "" || req.body.password == "" || req.body.dateNaissance == "" || req.body.sexe == "") {
    res.status(400).send({ error: true, message: 'Une ou plusieur données obligatoires manquantes' });
  } else {
    if (!validateEmail(req.body.email) || ((req.body.sexe != "M") && (req.body.sexe != "F"))) {
      res.status(409).send({ error: true, message: 'une ou plusieur données sont éronnées' });
    } else {
      //mail existant
      if (await checkEmail(req.body.email)) {
        res.status(409).send({ error: true, message: 'un compte utilisant cette adresse mail est déjà enregistré' });
      } else {
        let hashed = "";

        const salt = await bcrypt.genSalt(10);
        hashed = await bcrypt.hash(req.body.password, salt);
        const docRef = firebase.collection('user').doc();
        await docRef.set({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          role: req.body.role,
          password: hashed,
          subscription: req.body.subscription,
          dateNaissance: req.body.dateNaissance,
          sexe: req.body.sexe,
          createdAt: new Date(),
          updateAt: new Date()
        });
        res.status(201).send({ 
          error: false,
          message: 'utilisateur créé avec succès',
          user: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashed,
            dateNaissance: req.body.dateNaissance,
            sexe: req.body.sexe,
            createdAt: new Date().toDateString(),
            updateAt: new Date().toDateString(),
            subscription: req.body.subscription
          },
        });
      }
    }
  }
};

exports.update = async function (req, res){
  try
  {
    var decoded = jwt_decode(req.headers.authorization);
  }
  catch(error)
  {
    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
    return;
  }
  
  if( req.body.sexe !== "F" && req.body.sexe !== "M")
  {
    res.status(409).send({ error: true, message: 'Une ou plusieurs données sont erronées' });
  }
  else
  {
    if(await checkEmail(req.body.email))
    {
      res.status(409).send({ error: true, message: 'un compte utilisant cette adresse mail est déjà enregistré' });
    }
    else
    {
      const id = req.body.id;
      const data = req.body;
      const docRef = firebase.collection('user').doc(req.body.id);
      if(id != undefined && id != "")
      {
        if(!validateEmail(req.body.email))
        {
          res.status(409).send({ error: true, message: 'Format Email non validé' });
        }
        else
        {
          await docRef.set({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password:req.body.password,
            dateNaissance: req.body.dateNaissance,
            sexe: req.body.sexe,
            role: req.body.role,
            updatedAt: new Date()
          });
          res.status(200).send({ error: false, message: 'Vos données ont été mises à jour' });
        }
      }

    }
  }

  try
  {

    var date = new Date(req.body.dateNaissance).toISOString();
    var datePrint=date.replace('T', " ").substring(0,10)
  }
  catch(error)
  {
    res.status(409).send({ error: true, message: 'Une ou plusieurs données sont erronées' });
  }

};

exports.logOut = async function (req, res) {
  try
  {
    var decoded = jwt_decode(req.headers.authorization);
  }
  catch(error)
  {
    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
    return;
  }

  res.status(200).send({ error: false, message: 'L\'utilisateur a été déconnecté avec succès' });

};


exports.delete = async function (req, res) {
  //var decoded = jwt_decode(req.headers.authorization);
  try
  {
    var decoded = jwt_decode(req.headers.authorization);
  }
  catch(error)
  {
    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
    return;
  }

    try{
      const id = req.body.id;
      await firebase.collection('user').doc(id).delete();
      res.status(200).send({ error: false, message: 'Votre compte et le compte de vos enfants ont été supprimés avec succès' });
    }

    catch (error){
      res.status(400).send(error.message);
    }

};

async function checkEmail(email) {
  var isSame = false;
  const snapshot = await firebase.collection('user').get();
  await snapshot.forEach((doc) => {
    if (email === doc.data().email) {
      isSame = true;
    }
  });
  return isSame;
}

async function checkEmailAndPassword(email, password) {
  let isSame = false;
  const snapshot = await firebase.collection('user').get();
  await snapshot.forEach((doc) => {
    if (email === doc.data().email && password === doc.data().password) {
      isSame = true;
    }
  });
  return isSame;
}

function validateEmail(elementValue) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // console.log(emailPattern.test(elementValue));
  return emailPattern.test(elementValue);
}


