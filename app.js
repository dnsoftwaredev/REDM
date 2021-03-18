if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // dotenv loads env var into process.env
}

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const EError = require('./utils/EError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users')
const propertyRoutes = require('./routes/properties');
const helpRoutes = require('./routes/helps');

mongoose.connect('mongodb://localhost:27017/redm', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
const app = express();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database ready');
});

app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate); // template engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'hehe',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        express: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,
    }
}

app.use(session(sessionConfig));
app.use(flash());

// e session needs to be before passport session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/properties', propertyRoutes);
app.use('/properties/:id/helps', helpRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new EError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong!";
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('On Port 3000')
});
