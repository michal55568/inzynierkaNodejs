module.exports = {
    index: (req,res) => {
        res.render('admin/index')
    },

    getPosts: (req, res => {
        res.send('All posts')
    })
}