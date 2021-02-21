const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const connectDB = require('./config/db');

//Load Config 

dotenv.config({path:'./config/config.env'});
connectDB();
require('./config/passport')(passport);
const app = express();


//Body Parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Method override

app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body ==="object" && '_method' in req.body){

        //look in urlencoded POST bodies and delete it 
        let method = req.body._method
        delete req.body._method 
        return method 
    }
}))

//handlebars Helpers 
const{formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs');

// Handlebars
app.engine('.hbs', exphbs({
    helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout: 'main', extname:'.hbs'}));
app.set('view engine', '.hbs'); 

//express-session middleware 
app.use(session({
    secret: 'life',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));



//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Set global var 
app.use(function(req,res, next){
    res.locals.user = req.user || null;
    next()
})


//static folder 
app.use(express.static(path.join(__dirname, 'public')));

//logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};
 

//routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`port is coming from ${process.env.NODE_ENV} mode on port ${PORT}`));

