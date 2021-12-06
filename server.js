const express = require('express');
const usersRoutes = require('./src/routes/user.r');
const resourcesRoutes = require('./src/routes/resources.r');
const cartRoutes = require('./src/routes/cart.r');

const authJwt = require('./src/middleware/authJwt');

/*let firebase = require("firebase-admin");

let serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    // databaseURL: "https://cart.dLs0VSkh8X0ezFrmdzjN.firebaseio.com"
});

let db = firebase.firestore();
let ref = db.ref("restricted_access/secret_document");
ref.once("value", function (snapshot) {
    console.log(snapshot.val());
});

let usersRef = ref.child("users");
usersRef.set({
    user: {
        firstname: "June 23, 1912",
        lastname: "Alan Turing",
        password: "Alan Turing",
        email: "Alan Turing",
        date_naissance: "Alan Turing",
        sexe: "Alan Turing",
    }
});*/

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8000;

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



// define a root route
app.get('/', (req, res) => {
    res.sendfile('index.html');
});


// using as middleware
// for user
app.use('/user'/*, authJwt.verifyToken*/, usersRoutes);
// app.use('/login', usersRoutes);
// app.use('/register', usersRoutes);

// for resources
app.use('/resource'/*, authJwt.verifyToken*/, resourcesRoutes);
// app.use('/songs', authJwt.verifyToken, resourcesRoutes);
// app.use('/api/a', authJwt.verifyToken, resourcesRoutes);

// for cart
app.use('/cart'/*, authJwt.verifyToken*/, cartRoutes);


// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
