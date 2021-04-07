module.exports = {
    index: (req,res) => {
        res.render('admin/index')
    },

    getPosts: (req, res) => {
        res.send('All posts')
    },

    submitPosts: (req, res) => {
        res.send('Post został dodany.')
    },

    createPosts  : (req,res) => {
        res.render('admin/posts/create')
    }
}