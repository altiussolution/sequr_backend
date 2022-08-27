require('dotenv').config();
// const hostname = process.env['USER'] == 'ubuntu' ? '172.31.45.190' : 'localhost';
const hostname = '172.31.45.190'
const TortoiseDB = require('tortoisedb');
var mkdirp = require('mkdirp');
const port = 4500; 
var express = require('express')
var cors = require('cors')
var app = express() 
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/templates'));
const routesIndex = require('./routes/index');
routesIndex(app);  

const {CartModel} = require('./models')

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
    mkdirp(__dirname + '/public/uploads/').then(made =>
        console.log(`made directories, starting with ${made}`))
});

app.use(express.static(__dirname + '/public'))
const server = new TortoiseDB({
    // Choose database name  - defaults to 'default' if not provided
    name: 'sequr6',
    // Set server port - defaults to process.env.PORT if not provided
    port: 3000,
    // Provide mongodb URI - defaults to process.env.MONGODB_URI if not provided
    mongoURI: 'mongodb://localhost:27017',
    // Set batch limit - defaults to 1000 if not provided
    batchLimit: 1000
  });
   
server.start();
let mongoose = require('mongoose');
 mongoose.pluralize(null);

const dbPath = process.env['MONGODB_URI'];

const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex : false}
// mongoose.set('useFindAndModify', false);
const mongo = mongoose.connect(dbPath);



mongo.then(async () =>{
    console.log('mongo connected success')
    // await CartModel.deleteMany({},(err,res) =>{
    //     if(!err){
    //         console.log(res)
    //     }else{
    //         console.log(err);
    //     }
    // })
}, error =>{
    console.log(error, 'error');
})
