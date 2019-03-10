var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookInstanceController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);  //This actually maps to /catalog/ because we import the route with a /catalog prefix
// Get List of all books
router.get('/books', book_controller.book_list);
// Get a particular book
router.get('/book/:id', book_controller.book_detail);
// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);
// POST request for deleting Book.
router.post('/book/:id/delete', book_controller.book_delete_post);


/// AUTHOR ROUTES ///
router.get('/authors', author_controller.author_list);
// Get a particular author
router.get('/author/:id', author_controller.author_detail);
// POST request for creating author.
router.post('/author/create', author_controller.author_create_post);

module.exports = router;