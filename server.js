const express = require('express');
const router =require('./src/routes');
const cors=require('cors');
const app = express();
app.use(express.urlencoded({limit:'20MB',extended:true,parameterLimit:20000}));

app.use(express.json());
app.use(cors());
app.use(router);
const port = process.env.PORT || 8000;

// define a root route
app.get('/', (req, res) => {
    res.status(200).sendfile('index.html');
});

//app.get('/**', (req, res) => {
//    res.status(404).sendfile('404.html');
//});

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
