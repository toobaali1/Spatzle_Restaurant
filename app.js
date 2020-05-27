const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
require('./db/mongoose');

const passport = require('passport');
const localStrategy = require('passport-local');
const expresSession = require('express-session');

const User = require('./models/user');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(flash());

const PORT = process.env.PORT || 3000;

app.use(methodOverride('_method'));

// PASSPORT CONFIGURATION
app.use(
	expresSession({
		secret: 'process.env.SECRET_MESSAGE',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new localStrategy(User.authenticate()));

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use((req, res, next) => {
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// Landing Page
app.get('/', (req, res) => {
	res.render('home');
});

const itemsRoute = require('./routes/items');
app.use(itemsRoute);

const commentsRoute = require('./routes/comments');
app.use(commentsRoute);

const usersRoute = require('./routes/users');
app.use(usersRoute);

const categoryRoute = require('./routes/category');
app.use(categoryRoute);

app.listen(PORT, () => {
	console.log('Server is up on port', PORT);
});
