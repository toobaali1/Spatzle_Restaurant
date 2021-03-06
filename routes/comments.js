const express = require('express');
const router = express.Router();

const Comment = require('../models/comments');
const Item = require('../models/items');
const { isLoggedIn, checkCommentOwnership } = require('../middleware/auth');
const ObjectID = require('mongodb').ObjectID;

// show new comment form
router.get('/items/:id/comments/new', isLoggedIn, (req, res) => {
	Item.findById(req.params.id, (err, foundItem) => {
		res.render('commentViews/addComment', { foundItem });
	});
});

// Add comment to database
router.post('/items/:id/comments', isLoggedIn, async (req, res) => {
	const comment = new Comment({
		text: req.body.comment,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	});

	await comment.save();

	Item.findById(req.params.id, async (err, foundItem) => {
		foundItem.comments.push(comment);
		await foundItem.save();
		req.flash('success', 'Published your comment!');
		res.redirect('/items/' + req.params.id);
	});
});

// show edit comment form
router.get('/items/:id/comments/:commentID/edit', checkCommentOwnership, (req, res) => {
	Item.findById(req.params.id, (err, foundItem) => {
		if (!err) {
			Comment.findById(req.params.commentID, (err, foundComment) => {
				res.render('commentViews/editComment', { foundItem, foundComment });
			});
		}
	});
});

//  edit review
router.put('/items/:id/comments/:commentID', checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.commentID, { text: req.body.comment }, (err, updatedComment) => {
		if (!err) {
			req.flash('success', 'Comment updated successfully!');
			res.redirect('/items/' + req.params.id);
		}
	});
});

// Delete comment
router.delete('/items/:id/comments/:commentID', checkCommentOwnership, (req, res) => {
	Item.findById(req.params.id, (err, foundItem) => {
		foundItem.comments = foundItem.comments.filter((comment) => {
			return !ObjectID(comment).equals(req.params.commentID);
		});
		foundItem.save();
	});

	Comment.findByIdAndRemove(req.params.commentID, (err, result) => {
		if (!err) {
			req.flash('success', 'Comment removed successfully!');
			res.redirect('/items/' + req.params.id);
		}
	});
});

module.exports = router;
