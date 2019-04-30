
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema ({
	article: {
		type: String,
		unique: true
	},
	summary: {
		type: String
	},
	link: {
		type: String
	},
	photo: {
		type: String
	},
	date: {
		type: Date
	},
	saved: {
		type: Boolean,
		default: false
	},
	note: [
		{
			type: Schema.Types.ObjectId,
			ref: "note"
		}
	]
});

const article = mongoose.model("article", articleSchema);

module.exports = article;