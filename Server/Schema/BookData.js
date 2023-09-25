const mongoose = require("mongoose");
const BookData = mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  bookReview: {
    type: String,
  },
});
const Book = mongoose.model("Bookdetails", BookData);
module.exports = Book;
