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

var tentative = 0;

exports.findAll = function (req, res) {
    let user = new User("Aina", "Kum", "aina@gmail.com", "testeteste", "02/02/20", "M");
    res.send(user);
};


exports.login = async function (req, res) {
  let found=false;
    if (req.body.username == "" || req.body.password == "") {
        res.status(400).send({ error: true, message: 'Email/Password manquant' });
    } else {
        const snapshot = await firebase.collection('user').get();
        snapshot.forEach((doc) => {
            if (req.body.email === doc.data().email) {
              found=true;
                bcrypt.compare(req.body.password, doc.data().password, function (err, res_) {
                    if (res_) {
                        var token = jwt.sign({ username: doc.data().username, lastname: doc.data().lastname, email: doc.data().email, }, authConfig.secret, {
                            expiresIn: 86400 // 24 hours
                        });
                      res.status(200).send({ error: false, message: "L'utilisateur a été authentifié succès", user: doc.data(), token: token });
                      Localstorage.setItem('token', token);
                      Localstorage.setItem('subscription', doc.data().abonnement);
                      Localstorage.setItem('role', doc.data().role);
                    } else {
                      res.status(400).send({ error: true, message: 'Password incorrect' });
                    }
                });

            }

        });
      if(!found)
      {
         tentative = tentative + 1;
        if (tentative == 3) {
          found=false;
          tentative=0;
          console.log("trop de tentative");
          res.status(400).send({ error: true, message: `trop de tentative sur l'email ${req.body.email} veuillez patienter (2min)` });
          return;
        }
        res.status(400).send({ error: true, message: 'Email incorrect' });


      }

    }

    // res.send("login");
    // const new_user = new User(req.body);
    // if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    //     res.status(400).send({ error: true, message: 'Please provide all required field' });
    // } else {
    //     User.login(new_user.username, function (err, res_match) {
    //         if (err) {
    //             res.send(err);
    //         } else {
    //             //create token
    //             var token = jwt.sign({ id: new_user.id }, authConfig.secret, {
    //                 expiresIn: 86400 // 24 hours
    //             });
    //             // Load hash from the db, which was preivously stored                 
    //             bcrypt.compare(new_user.password, res_match[0].password, function (err, res) {
    //                 if (res) {
    //                     console.log("User logged");
    //                     resLogin.status(200).send({ accessToken: token })
    //                 } else {
    //                     console.log("User not match");
    //                     resLogin.status(400).send({ accessToken: "none" });
    //                 }
    //             });

    //         }
    //     })

    // }
}

exports.register = async function (req, res) {
    if (req.body.username == "" || req.body.lastname == "" || req.body.email == "" || req.body.password == "" || req.body.date_naissance == "" || req.body.sexe == "") {
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
                    username: req.body.username,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hashed,
                    date_naissance: req.body.date_naissance,
                    sexe: req.body.sexe
                });
                res.status(201).send({ error: false, message: 'utilisateur créé avec succès' });
            }
        }
    }
};

exports.delete = async function (req, res) {
    //var decoded = jwt_decode(req.headers.authorization);
  
    if (Localstorage.getItem('token')) {
      try{
        const id = req.params.id;
        await firebase.collection('user').doc(id).delete();
        res.send("delete");
      }

      catch (error){
        res.status(400).send(error.message);
      }
    } 
  else
  {
    res.status(401).send({ "error":true, "message": "Votre token n\'est pas correct" })
  }

 // else {
 //   res.status(401).send({ error: true, message: 'Token n\est pas correct' });
 // }
  // User.delete(req.params.id, function (err, user) {
  //     if (err)
    //         res.send(err);
    //     res.json({ error: false, message: 'Employee successfully deleted' });
    // });
};

async function checkEmail(email) {
    let isSame = false;
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
