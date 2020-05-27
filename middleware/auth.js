const Comment = require('../models/comments');

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash('error', 'Login First!');
		res.redirect('/login');
	}
};

const checkAdminAuthorization = (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user.username === 'admin') {
			next();
		} else {
			req.logout();
			req.flash('error', 'Enter username and password here to login!');
			res.redirect('/login');
		}
	} else {
		res.redirect('/items');
	}
};

const checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.commentID, (err, foundComment) => {
			if (!err) {
				if (req.user._id.equals(foundComment.author.id)) {
					next();
				} else {
					req.flash('error', 'You are not authenticated to make changes to this comment!');
					res.redirect('/items');
				}
			}
		});
	} else {
		req.flash('error', 'Login First!');
		res.redirect('/login');
	}
};

module.exports = {
	isLoggedIn,
	checkAdminAuthorization,
	checkCommentOwnership
};
