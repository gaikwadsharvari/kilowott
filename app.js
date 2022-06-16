
const express = require('express'); 
const app = express();              
const port = 3000;
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const AccessControl = require('accesscontrol');
const CryptoJS = require("crypto-js");
const expsession = require('express-session')

const bookshelf = require('./db-config');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    extname: '.handlebars',
    helpers: require('./config/handlebars-helpers.js')
}));

app.set('view engine', 'handlebars');
app.use(express.static('./static'));
app.use(express.static(path.join(__dirname, './uploads')));
app.use('/uploads', express.static('./uploads'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expsession({
    resave: true,
    saveUninitialized: true,
    secret: 'Assignment'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

passport.use(new LocalStrategy(
    async function (username, password, done) {
        var UserTable = bookshelf.Model.extend({
            tableName: 'users'
        });
        username = username.toLowerCase();
        

        let user = await UserTable.where({
            email: username,
            is_active: true,
            is_delete: false
        }).fetch().then(function (user) {
            console.log(user.toJSON());
            return user.toJSON();
        }).catch(function(error) {});
        
        if (!user) {
            let err = new Error('Invalid username');
            return done(err, null);
        }
        var hashPassword = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
        let isMatch = false;
        if (hashPassword == user.password) {
            isMatch = true;
        }
        if (!isMatch) {
            let err = new Error('Invalid password');
            return done(err, null);
        }
        return done(null, user);
    }));

passport.serializeUser(function (user, done) {
    return done(null, user);
});

passport.deserializeUser(function (user, done) {
    return done(null, user);
});

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(port, () => { 
    console.log(`Now listening on port ${port}`);
});

