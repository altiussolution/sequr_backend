require('dotenv').config();
const hostname = 'localhost';
const port = 4500;
var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use((req, res, next) => { 
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    };
    next();
});
app.listen(port, hostname, () => {
  
    console.log(`Server running at http://${hostname}:${port}/`);
    
});
let mongoose = require('mongoose');

const dbPath = process.env['MONGODB_URI'];

const options = {useNewUrlParser: true, useUnifiedTopology: true}
// mongoose.set('useFindAndModify', false);
const mongo = mongoose.connect(dbPath,options);

mongo.then(() =>{
    console.log('mongo connected success')
}, error =>{
    console.log(error, 'error');
})