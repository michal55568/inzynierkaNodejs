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

        Post.findById(id)
            .lean().then(post => {

                Category.find().lean().then(cats => {
                    res.render('admin/posts/edit', {post: post, categories: cats});
                })
        });
    },

    editPostSubmit: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true : false;
        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                post.title = req.body.title;
                post.status = req.body.status;
                //post.allowComments = req.body.allowComments;
                post.description = req.body.description;
                post.category = req.body.category;

                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');
                });
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
    },

    editCategoriesGetRoute: (req, res) => {
        const catId =  req.params.id;

        const cats = Category.find();

        Category.findById(catId).then(cat => {
            res.render('admin/category/edit', {category: cat, categories: cats});
        });
    }

}