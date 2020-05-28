const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();
const { checkAdminAuthorization } = require('../middleware/auth');

// show sign up form
router.get('/register', (req, res) => {
	res.render('userAuthViews/register');
});

// Register a new user
router.post('/register', (req, res) => {
	const newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			if (req.body.username === 'admin') {
				req.flash('error', "Can't sign up with this username, Try using some other username.");
			} else {
				req.flash('error', err.message);
			}
			return res.redirect('register');
		}

		// logs the user in
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to Spatzle, ' + user.username + '!');
			res.redirect('/items');
		});
	});
});

// show login form
router.get('/login', (req, res) => {
	res.render('userAuthViews/login');
});

// login an existing user
router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			req.flash('error', 'Incorrect username or password.');
			return res.redirect('/login');
		}

		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			if (user.username === 'admin') {
				req.logout();
				req.flash('error', 'Incorrect username or password.');
				return res.redirect('/login');
			}

			return res.redirect('/items');
		});
	})(req, res, next);
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Successfully logged out!');
	res.redirect('/login');
});

// ADMIN ROUTES
// show admin dashboard
router.get('/admin/dashboard', checkAdminAuthorization, (req, res) => {
	res.render('itemViews/adminDashboard');
});

// show admin page
router.get('/admin/login', (req, res) => {
	res.render('userAuthViews/admin');
});

// sign in as admin
router.post(
	'/admin/login',
	passport.authenticate('local', {
		successRedirect: '/admin/dashboard',
		failureRedirect: '/login'
	}),
	(req, res) => {}
);

module.exports = router;
