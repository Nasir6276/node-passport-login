const express = require ('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require ('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').mongoURI;

// EJS 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({extended: false }));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Mongo is connected...'))
    .catch(err => console.log(err));

// Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));