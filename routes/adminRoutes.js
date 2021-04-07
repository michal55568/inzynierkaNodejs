const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const{isUserAuthenticated} = require('../config/customFunctions');

router.all('/*', isUserAuthenticated, (req,res,next) => {
    req.app.locals.layout = 'admin';

    next();
})
/* DEFAULT ADMIN ROUTE */
router.route('/')
    .get(adminController.index)

/* USERS ROUTES */
router.route('/users')
    .get(adminController.getUsers);

router.route('/users/edit/:id')
    .get(adminController.editUser)
    .put(adminController.editUserSubmit)

router.route('/users/delete/:id')
    .delete(adminController.deleteUser);

/* POST ROUTES */
router.route('/posts')
    .get(adminController.getPosts);

router.route('/posts/create')
    .get(adminController.createPosts)
    .post(adminController.submitPosts);

router.route('/posts/edit/:id')
    .get(adminController.editPost)
    .put(adminController.editPostSubmit);

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

/* CATEGORY ROUTES */

router.route('/category')
    .get(adminController.getCategories)
    .post(adminController.createCategories);

router.route('/category/edit/:id')
    .get(adminController.getEditCategories)
    .post(adminController.submitEditCategories);

router.route('/category/delete/:id')
    .delete(adminController.deleteCategory);

/* COMMENT ROUTES */
router.route('/comment')
    .get(adminController.getComments)
    .post(adminController.approveComments);

module.exports = router;