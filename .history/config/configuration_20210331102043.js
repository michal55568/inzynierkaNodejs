module.exports = {
    mongoDbUrl: 'mongodb+srv://admin:admin@cluster0.fdzva.mongodb.net/blogDatabase?retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
        res.locals.success_messange = req.flash('success-message');
        res.locals.error_messange = req.flash('error-message');

        next();
    }
}