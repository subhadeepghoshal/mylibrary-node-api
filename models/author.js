
var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  },
  { toObject: { virtuals: true },  // <-- These properties will configure
    toJSON: { virtuals: true }
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.first_name + ' ' + this.family_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  if(this.date_of_death && this.date_of_birth){
    return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
  }
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual('date_of_birth_formatted')
.get(function () {
  if (this.date_of_birth){
    return moment(this.date_of_birth).format('MMMM Do, YYYY');
  }
});

AuthorSchema
.virtual('date_of_death_formatted')
.get(function () {
  if (this.date_of_death){
    return moment(this.date_of_death).format('MMMM Do, YYYY');
  }
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);