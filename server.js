// Required Modules 
require('dotenv').config();

// Express
var express = require('express');
const path = require('path')

// Creating Express App
var app = express();
const { logger } = require('./middleware/logEvent')
const cors = require('cors');
const corsOptions=require('./config/corsOptions')
const errorHandler = require('./middleware/errorHandler');
const verifyJwt = require('./middleware/verifyJwt');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

//MongoDb Modules
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')

// Define Port
const port = process.env.port || 3000;

// Connect DataBase
connectDB();
mongoose.set('strictQuery', true);


// View Engines
const ejs = require('ejs');
app.set('view engine', 'ejs');

// Handle Credentials
app.use(credentials)
// Avoid Cors Error 
app.use(cors(corsOptions));

// Built Middleare To Handle Form data (urlcoded Data)
// app.use(express.urlencoded({ encoded: true }));

// JSON Data  - applied to All Above Routes
app.use(express.json());

// MiddleWare To Serve Static Files - Html,css,js
// And  Also Paste css and other static folders in public folder
app.use('/', express.static(path.join(__dirname, 'public','style.css')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));
// Middleware for Cookie

app.use(cookieParser());

// Middle-Wares
app.use(logger);
app.use('/',require('./routes/root'))
app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/employee', require('./routes/api/employee'))
app.use(verifyJwt)   // like waterfalll everything after this will use verifyJwt

// $404
app.all('*', (req, res) => {
    // fire.emit('connection', req)
    console.log('404 Error')
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, 'views', '404Page.html'))
    } else if(req.accepts('json')){
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler)
// app.get('/myEjs', (req, res) => {
//     res.render(path.join(__dirname, 'views', 'Home.ejs'));
// });
mongoose.connection.once('open', () => {
    console.log('Connected To MongoDB')
    app.listen(port, () => {
        console.warn(`Server Running On ${port}`);
    });
});


// ACCESS_TOKEN_SECRET=c2923fe5d17ca1a9df5b8f0259e75d23f6d69c92969e11bc6518e82f9f237dffa9c687f0175184c03669a6d1e256068ac243abaf0d0e0af7f0d5f7ff5771a211
// REFRESH_TOKEN_SECRET=947f853cb661b36f1866d3ff04ee962931cb4fbc6d9eebf43ac4bcbf81bc7065db6fb6a7720ae96ba2c10daa38f20ae472f9a58ce9934aea0a468c714ebf9773