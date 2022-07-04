// @/models.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: Text,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updated_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = { Post };