const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const router = express.Router();

const Item = require('../models/items');
const Category = require('../models/category');
const Comment = require('../models/comments');
const ObjectID = require('mongodb').ObjectID;
const { checkAdminAuthorization } = require('../middleware/auth');

// Show all items
router.get('/items', (req, res) => {
	Category.find({}, (err, foundCats) => {
		Item.find({}, (err, foundItems) => {
			if (err) {
				return res.redirect('/items');
			}

			res.render('itemViews/itemsShowPage', { foundItems, foundCats });
		});
	});
});

// Show items specific to chosen category
router.post('/items/search', (req, res) => {
	if (req.body.category === 'all') {
		return res.redirect('/items');
	}

	Category.find({}, (err, foundCats) => {
		Item.find({ category: req.body.category }, (err, foundItems) => {
			if (err) {
				return res.redirect('/items');
			}

			res.render('itemViews/itemsShowPage', { foundItems, foundCats });
		});
	});
});

// Show add new Item form
router.get('/items/new', checkAdminAuthorization, (req, res) => {
	Category.find({}, (err, foundCats) => {
		if (!err) {
			res.render('itemViews/addItem', { foundCats });
		}
	});
});

// Configuring multer
const Storage = multer.diskStorage({
	destination: './public/uploads',
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: Storage
}).single('file');

// Configure sharp
const width = 245;
const height = 260;

// Add new item to database
router.post('/items', upload, checkAdminAuthorization, async (req, res) => {
	const compressedImage = await sharp(req.file.path)
		.resize(width, height)
		.toFile('./public/uploads/compressedImg/_compressedImg' + req.file.originalname, (err) => {});

	const croppedFilePath = '../../' + compressedImage.options.fileOut.substring(9);

	const item = new Item({
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		image: croppedFilePath,
		category: req.body.category
	});

	await item.save();
	req.flash('success', 'Item added successfully!');
	res.redirect('/items');
});

// Show an item details
router.get('/items/:id', (req, res) => {
	Item.findById(req.params.id).populate('comments').exec((err, foundItem) => {
		if (err) {
			return res.redirect('/items');
		}

		if (foundItem) {
			res.render('itemViews/showItemDetails', { foundItem });
		} else {
			res.send('Item not found!'); //SHOW 404.........
		}
	});
});

// show edit form
router.get('/items/:id/edit', checkAdminAuthorization, (req, res) => {
	Category.find({}, (err, foundCats) => {
		Item.findById(req.params.id, (err, foundItem) => {
			if (!err) {
				res.render('itemViews/editItem', { foundItem, foundCats });
			}
		});
	});
});

// Edit an existing item
router.put('/items/:id/edit', upload, checkAdminAuthorization, async (req, res) => {
	const compressedImage = await sharp(req.file.path)
		.resize(width, height)
		.toFile('./public/uploads/compressedImg/_compressedImg' + req.file.originalname, (err) => {});

	const croppedFilePath = '../../' + compressedImage.options.fileOut.substring(9);
	Item.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			image: croppedFilePath,
			category: req.body.category
		},
		(err, updatedItem) => {
			if (!err) {
				req.flash('success', 'Item updated successfully!');
				res.redirect('/items');
			}
		}
	);
});

// Delete an item
router.delete('/items/:id', checkAdminAuthorization, (req, res) => {
	Item.findById(req.params.id, async (err, foundItem) => {
		await foundItem.comments.forEach((comment) => {
			Comment.findByIdAndRemove(ObjectID(comment), (err, result) => {
				console.log('Removed succesfully');
			});
		});
	});

	Item.findByIdAndRemove(req.params.id, (err, result) => {
		req.flash('success', 'Item removed successfully!');
		res.redirect('/items');
	});
});
module.exports = router;
