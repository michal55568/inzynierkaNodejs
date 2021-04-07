const Post = require('../models/PostModel').Post;

module.exports = {
    index: (req,res) => {
        res.render('admin/index')
    },

    getPosts: (req, res) => {
        Post.find().lean().then(posts => {
            res.render('admin/posts/index', {posts: posts});
        });
    },

    submitPosts: (req, res) => {
        // TODO: Form Data Validation Is Pending
        const newPost = new Post ({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        });
        newPost.save().then(post => {
            console.log(post);
            req.flash('success-message', 'Post został poprawnie stworzony.');
            res.redirect('/admin/posts');
        });
    },

    createPosts  : (req,res) => {
        res.render('admin/posts/create')
    },

    editPost: (req,res) => {
        const id = req.params.id;

        Post.findById(id).then(post => {
            res.render('admin/posts/edit', {post: post})
        });
    }
}