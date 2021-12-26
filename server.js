const express = require('express');
const router =require('./src/routes');
const cors=require('cors');
const jwt_decode = require('jwt-decode');
const app = express();
const firebase = require('./config/db.config');
app.use(express.urlencoded({limit:'20MB',extended:true,parameterLimit:20000}));

app.use(express.json());
app.use(cors());
app.use(router);
const port = process.env.PORT || 8000;

// define a root route
app.get('/', (req, res) => {
    res.status(200).sendfile('index.html');
});

app.get('/songs', async function(req, res) {
  console.log('fjldks');
  try
  {
    var decoded = jwt_decode(req.headers.authorization);
  }
  catch(error)
  {
    res.status(401).send({ error: true, message: 'Token n\'est pas correct' });
    return;
  }
  var songGot,songs=[];
    if(decoded.subscription == "PREMIUM")
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
        songGot.id=doc.id;
        songs.push(songGot);
        
      });
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

  console.log('dlf')
});

//app.get('/**', (req, res) => {
//    res.status(404).sendfile('404.html');
//});

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
