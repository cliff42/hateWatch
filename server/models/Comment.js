const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
    body: String,
    author: String,
    redditID: String,
    isHateSpeech: Boolean,
    certainty: Number,
    subreddit: String,
    datePosted: Date
});

const Comment = mongoose.model("comment", CommentSchema);
module.exports = Comment;