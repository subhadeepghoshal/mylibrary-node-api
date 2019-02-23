var Author = require('../models/author');

// Display list of all Authors.
exports.author_list = function(req, res, next) {
    Author.find({})
    .exec(function (err, list_authors) {
      if (err) { return next(err); }
      //Successful, so render
      filtered_authors = list_authors.map(author=>{
          return {
                  id:author.id,
                  name:author.name, 
                  date_of_birth:author.date_of_birth_formatted,
                  date_of_death:author.date_of_death_formatted,
                  url:author.url
                }
      })
      res.json({ title: 'Author List', author_list: filtered_authors });
    });
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
    Author.findById(req.params.id)
    .exec(function(err, results) {
        if (err) { return next(err); }
        if (results==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.json({ title: 'author_detail', book: results} );
    });
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res, next) {
    // Create a Author object with escaped and trimmed data.
    var author = new Author(
        { 
          first_name: req.body.first_name,
          family_name: req.body.last_name,
          date_of_birth: req.body.date_of_birth,
          date_of_death: req.body.date_of_death
        });

    author.save(function (err) {
        if (err) { return next(err); }
            //successful - redirect to new author record.
            res.redirect(author.url);
        });
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};