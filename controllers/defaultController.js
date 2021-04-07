const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;

module.exports = {
    index: async(req,res) => {
        const posts = await Post.find().lean();
        const categories = await Category.find().lean();
        res.render('default/index', {posts: posts, categories: categories});
    },

    /* LOGIN ROUTES */
    loginGet: (req,res) => {
        res.render('default/login', {message: req.flash('error')});
    },

    loginPost: (req,res) => {

    },

    /* REGISTER ROUTES */
    registerGet: (req,res) => {
        res.render('default/register');
    },

    registerPost: (req,res) => {
        let errors = [];

        if(!req.body.firstName){
            errors.push({message: 'Podanie imienia jest obowiązkowe!'});
        }
        if(!req.body.lastName){
            errors.push({message: 'Podanie nazwiska jest obowiązkowe!'});
        }
        if(!req.body.email){
            errors.push({message: 'Email jest obowiązkowy!'});
        }
        if(req.body.password !== req.body.passwordConfirm){
            errors.push({message: 'Podane hasła muszą się zgadzać!'});
        }

        if(errors.length > 0){
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        }

        else{
            User.findOne({email: req.body.email}).then(user => {
                if(user){
                    req.flash('error-message', 'Ten email jest już zajęty, spróbuj się zalogować.');
                    res.redirect('/login');
                }
                else{
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'Zostałeś zarejestrowany!');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    },

    getSinglePost: (req,res) => {
        const id = req.params.id;

        Post.findById(id).lean()
        .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
        .then(post => {
            if(!post){
                res.status(404).json({message: 'Nie znaleziono artykułu'});
            }
            else{
                res.render('default/singlePost', {post: post, comments: post.comments});
            }
        })
    },

    submitComment: (req,res) => {

        if(req.user){
            Post.findById(req.body.id).then(post => {
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                });

                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                        req.flash('success-message', 'Twój komentarz został przesłany do oceny.');
                        res.redirect(`/post/${post._id}`);
                    });
                });
            })
        }

        else{
            req.flash('error-message', 'Zaloguj się aby skomentować artykuł!');
            res.redirect('/login');
        }
    }
}