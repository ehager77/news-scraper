const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
  	type: String
  }, 
  body: {
  	type: String
  },
  saved: {
		type: Boolean,
		default: false
  }
  
});

const note = mongoose.model("note", noteSchema);

module.exports = note;