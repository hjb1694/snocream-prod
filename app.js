const express = require('express');
const path = require('path');
const session = require('express-session');
const fileupload = require('express-fileupload');
const app = express();

const {PORT, HOST, MONGO_URI, SESSION_SECRET} = require('./config/config');


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(fileupload());
app.use(express.json({extended : false}));
app.use(express.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(session({
    secret : SESSION_SECRET, 
    saveUninitialized : false, 
    resave : false, 
}));

app.use('/admin', require('./routes/admin'));
app.use(require('./routes/general')); //general routes



app.listen(PORT, () => console.log(`Listening on port ${PORT} on ${HOST}!`));