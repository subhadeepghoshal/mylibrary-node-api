var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
    {name:{type:String,required:true,max:100,min:3}}
)

GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/gernre/' + this._id;
});

//Export model
module.exports = mongoose.model('Genre', GenreSchema);