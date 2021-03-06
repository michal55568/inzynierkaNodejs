const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;

module.exports = {
    index: (req,res) => {
        res.render('admin/index')
    },

    getPosts: (req, res) => {
        Post.find()
            .populate('category')
            .lean().then(posts => {
            res.render('admin/posts/index', {posts: posts});
        });
    },

    submitPosts: (req, res) => {
        // TODO: Form Data Validation Is Pending
        const commentsAllowed = req.body.allowComments ?true: false;

        const newPost = new Post ({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category
        });
        newPost.save().then(post => {
            console.log(post);
            req.flash('success-message', 'Post został poprawnie stworzony.');
            res.redirect('/admin/posts');
        });
    },

    createPosts  : (req,res) => {
        Category.find().lean().then(cats => {
            res.render('admin/posts/create', {categories: cats});
        })
    },

    editPost: (req,res) => {
        const id = req.params.id;

        Post.findById(id).lean().then(post => {
            res.render('admin/posts/edit', {post: post})
        });
    },

    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `Post ${deletedPost.title} został usunięty.`);
                res.redirect('/admin/posts');
            })
    },

    // Category methods

    getCategories: (req, res) => {
        Category.find().lean().then(cats => {
            res.render('admin/category/index', {categories: cats});
        })
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;
        
        if(categoryName) {
            const newCategory = new Category({
                title: categoryName
            });
            newCategory.save().then(category => {
                res.status(200).json(category);
            })
        }
    }
}