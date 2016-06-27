var mongoose = require('mongoose');
var articleTypeSchema = mongoose.Schema(
    {
        type: Array
    },
    {
        collection: 'article_types'
    }
);
module.exports = mongoose.model('ArticleTypes', articleTypeSchema);