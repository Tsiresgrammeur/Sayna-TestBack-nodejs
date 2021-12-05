
'use strict';

// let firebase = require("firebase-admin");

// const app = firebase.initializeApp({
//     apiKey: "",
//     authDomain: "essai-f0fd5.firebaseapp.com",
//     databaseURL: "https://essai-f0fd5.firebaseio.com/"
// });

// module.exports = app;


const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('../essaiAccount.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;