const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const User = require('../models/UserModel').User;
const {isEmpty} = require('../config/customFunctions');


module.exports = {
    index: (req,res) => {
        res.render('admin/index')
    },
    /* ROUTE USERS SECTION */
    /*addUser: (req) => {
        const { firstName, lastName, email, password } =  req.body;
        const user = new User({firstName, lastName, email, password});
        user.save();
        return user;
    },*/

    getUsers: (req, res) => {
        User.find()
            .lean().then(users => {
            res.render('admin/users/index', {users: users});
        });
    },

    editUser: (req,res) => {
        const id = req.params.id;

        User.findById(id).lean().then(users =>{
                    res.render('admin/users/edit', {users: users});
                })
    },

    editUserSubmit: (req, res) => {
        const id = req.params.id;

        User.findById(id)
            .then(user => {
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.email = req.body.email
                user.save().then(updateUser => {
                    req.flash('success-message', `Dane użytkownika zostały zaktualizowane.`);
                    res.redirect('/admin/users');
                });
            });
    },

    deleteUser: (req, res) => {
        User.findByIdAndDelete(req.params.id)
            .then(deletedUser => {
                req.flash('success-message', `Użytkownik ${deletedUser.firstName} ${deletedUser.lastName} został usunięty`);
                res.redirect('/admin/users');
            })
    },

    /* ROUTE POSTS SECTION */

    getPosts: (req, res) => {
        Post.find()
            .populate('category')
            .lean().then(posts => {
            res.render('admin/posts/index', {posts: posts});
        });
    },

    submitPosts: (req, res) => {
        const commentsAllowed = req.body.allowComments ?true: false;
        let filename = '';

        if(!isEmpty(req.files)){
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+filename, (err) => {
                if(err)
                    throw err;
            });
        }

        const newPost = new Post ({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
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
                post.allowComments = Boolean(req.body.allowComments);
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
                req.flash('success-message', `Post ${deletedPost.title} autora został usunięty.`);
                res.redirect('/admin/posts');
            })
    },

    /* ROUTE CATEGORY SECTION */

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

    getEditCategories: async(req, res) => {
        const catId =  req.params.id;
        const cats = await Category.find().lean();

        Category.findById(catId).lean().then(cat => {
            res.render('admin/category/edit', {category: cat, categories: cats});
        });
    },

    submitEditCategories: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;
        if(newTitle){
            Category.findById(catId).then(category => {
                category.title = newTitle;
                category.save().then(updated => {
                    req.flash('success-message', `Nazwa została zmieniona na ${updated.title}.`);
                    res.status(200).json({url: '/admin/category'});
                })
            })
        }
    },

    deleteCategory: (req, res) => {
        Category.findByIdAndDelete(req.params.id)
            .then(deletedCategory => {
                req.flash('success-message', `Kategoria ${deletedCategory.title} została usunięta.`);
                res.redirect('/admin/category');
            })
    },

    /* ROUTE COMMENT SECTION */

    getComments: (req, res) => {
        Comment.find().populate('user').lean().then(comments => {
            res.render('admin/comments/index', {comments: comments});
        })
    },

    approveComments: (req, res) => {
        var data = req.body.data;
        var commentId = req.body.id;

        console.log(data, commentId);

        Comment.findById(commentId).then(comment => {
            comment.commentIsApproved = data;
            comment.save().then(saved => {
                res.status(200).send('OK');
            }).catch(err => {
                res.status(201).send('FAIL');
            });
        });
    }

}