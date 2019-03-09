#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Book = require('./models/book')
var Author = require('./models/author')
var Genre = require('./models/genre')
var BookInstance = require('./models/bookinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var genres = []
var books = []
var bookinstances = []

function authorCreate(first_name, family_name, d_birth, d_death, cb) {
  authordetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) authordetail.date_of_birth = d_birth
  if (d_death != false) authordetail.date_of_death = d_death
  
  var author = new Author(authordetail);
       
  author.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + author);
    authors.push(author)
    cb(null, author)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function bookCreate(title, summary, isbn, author, genre, votes, cb) {
  bookdetail = { 
    title: title,
    summary: summary,
    author: author,
    isbn: isbn,
    votes:votes
  }
  if (genre != false) bookdetail.genre = genre
    
  var book = new Book(bookdetail);    
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  }  );
}


function bookInstanceCreate(book, imprint, due_back, status, cb) {
  bookinstancedetail = { 
    book: book,
    imprint: imprint
  }    
  if (due_back != false) bookinstancedetail.due_back = due_back
  if (status != false) bookinstancedetail.status = status
    
  var bookinstance = new BookInstance(bookinstancedetail);    
  bookinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING BookInstance: ' + bookinstance);
      cb(err, null)
      return
    }
    console.log('New BookInstance: ' + bookinstance);
    bookinstances.push(bookinstance)
    cb(null, book)
  }  );
}


function createGenreAuthors(cb) {
    async.parallel([
        function(callback) {
          authorCreate('Sagan', 'Carl', false , false, callback);
        },
        function(callback) {
          authorCreate('Bryson', 'Bill', false, false, callback);
        },
        function(callback) {
          authorCreate('Diamond', 'Jared',false, false, callback);
        },
        function(callback) {
          genreCreate("Popular Science", callback);
        },
        ],
        // optional callback
        cb);
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('Cosmos', 'A book on cosmology', '9781473211896', authors[0], [genres[0],],1, callback);
        },
        function(callback) {
          bookCreate("Brief History of Nearly Everything","A short history of scientific discovery", '9788401352836', authors[1], [genres[0],],2, callback);
        },
        function(callback) {
          bookCreate("Rise and Fall of Third Chimpanzee", 'Story of Human', '9780756411336', authors[2], [genres[0],],3, callback);
        }
        ],
        // optional callback
        cb);
}


function createBookInstances(cb) {
    async.parallel([
        function(callback) {
          bookInstanceCreate(books[0], 'abc co', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], 'xyz co', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[2], 'abc co', false, false, callback)
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createGenreAuthors,
    createBooks,
    createBookInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});