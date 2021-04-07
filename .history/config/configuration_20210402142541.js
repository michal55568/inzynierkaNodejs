module.exports = {
    mongoDbUrl: 'mongodb+srv://admin:admin@cluster0.fdzva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');

        next();
    },
}