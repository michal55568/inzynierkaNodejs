const Post = require('../models/PostModel').Post;

module.exports = {
    index: (req,res) => {
        res.render('admin/index')
    },

    getPosts: (req, res) => {
        res.send('All posts')
    },

    submitPosts: (req, res) => {
        const newPost = new Post ({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        });
    },

    createPosts  : (req,res) => {
        res.render('admin/posts/create')
    }
}