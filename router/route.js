var Article = require('./../models/article.js');
var User = require('./../models/user.js');
var ArticleType = require('./../models/article-types.js');
module.exports = function (app) {
    // 首页
    app.get('/', function (req, res) {
        var context = {};
        var searchArticle = function () {
            Article.find(function (err, articles) {
                if (err) return res.send(500, 'database error');
                var _articles = articles.map(function (el) {
                    var time = new Date(el.date);
                    el.formatDate = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                    return el;
                });
                context.title = 'blog by node-express';
                context.data = _articles;
                res.render('home', context);
            }).sort({date: -1}).limit(10);
        };
        pageCommonModule([searchArticleTypes()], context, res, searchArticle);
    });
    // 某篇文章
    app.get('/article/:id', function (req, res) {
        var context = {};
        var oneArticle = function () {
            Article.findById(req.params.id, function (err, article) {
                if (err) return res.send(500, 'database error');
                var time = new Date(article.date);
                context.title = article.title;
                context.data = article;
                context.data.formatDate = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                res.render('article', context);
            });
        };
        pageCommonModule([searchArticleTypes()], context, res, oneArticle);
    });
    // 文章管理
    app.get('/admin/ctrl-article', function (req, res) {
        if (!req.session.isAdmin) return res.redirect(303, '/');
        delete req.session.result;
        var context = {};
        var searchArticles = function () {
            Article.find(function (err, articles) {
                if (err) return res.send(500, 'database error');
                var _articles = articles.map(function (el) {
                    var time = new Date(el.date);
                    el.formatDate = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                    return el;
                });
                var now = new Date();
                context.articles = _articles;
                context.title = '文章管理';
                context.author = req.session.username;
                context.formatDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                context.layout = 'admin';
                res.render('admin/ctrl-article', context);
            }).sort({date: -1}).limit(10);
        };
        pageCommonModule([searchArticleTypes()], context, res, searchArticles);
    });
    // 编辑文章
    app.get('/admin/ctrl-article-edit/:id', function (req, res) {
        if (!req.session.isAdmin) return res.redirect(303, '/');
        var context = {};
        var searchArticles = function () {
            Article.findById(req.params.id, function (err, articles) {
                if (err) return res.send(500, 'database error');
                var time = new Date(articles.date);
                articles.formatDate = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                context.layout = 'admin';
                context.article = articles;
                res.render('admin/ctrl-article-edit', context);
            });
        };
        pageCommonModule([searchArticleTypes()], context, res, searchArticles);
    });
    // 用户管理
    app.get('/admin/ctrl-user', function (req, res) {
        if (!req.session.isAdmin) return res.redirect(303, '/');
        User.find(function (err, user) {
            if (err) return res.send(500, 'database error');
            var context = {};
            context.title = '用户管理';
            context.layout = 'admin';
            context.user = user;
            res.render('admin/ctrl-user', context);
        }).limit(10);
    });
    // 文章搜索
    app.get('/search', function (req, res) {
        var context = {};
        var searchArticles = function () {
            if (req.query.title) {    // 标题搜索
                var condition = new RegExp(req.query.title, 'i');
                Article.find({title: condition}, function (err, articles) {
                    if (err) return res.send(500, 'database error');
                    context.title = '搜索结果';
                    if (articles.length) {
                        var _articles = articles.map(function (el) {
                            var time = new Date(el.date);
                            el.formatDate = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                            return el;
                        });
                        context.data = _articles;
                    } else {
                        context.noResult = '没有相关的搜索结果';
                    }
                    res.render('search', context);
                }).sort({date: -1}).limit(10);
            } else if (req.query.type) {  // 类型搜索
                var condition = new RegExp(req.query.type, 'i');
                Article.find({articleType: condition}, function (err, articles) {
                    if (err) return res.send(500, 'database error');
                    context.title = '搜索结果';
                    if (articles.length) {
                        var _articles = articles.map(function (el) {
                            var time = new Date(el.date);
                            el.formatDate = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
                            return el;
                        });
                        context.data = _articles;
                    } else {
                        context.noResult = '没有相关的搜索结果';
                    }
                    res.render('search', context);
                }).sort({date: -1}).limit(10);
            }
        };
        pageCommonModule([searchArticleTypes()], context, res, searchArticles);
    });
};

/**
 * 页面所有需要查询的公共模块封装函数
 * 目的是避免如果如果出现多个独立的公共模块, 代码回调嵌套的写法问题- -
 * @param {Array} promiseArray    查询模块的promise数组对象
 * @param {Object} context   用于模版处理的上下文对象
 * @param {Object} res  response对象
 * @param {Function} callback   返回客户端的回调函数
 */
function pageCommonModule(promiseArray, context, res, callback) {
    Promise.all(promiseArray).then(
        function (data) {
            data.forEach(function (el) {
                for (var x in el) {
                    context[x] = el[x];
                }
            });
            callback();
        }, function (err) {
            res.send(500, err);
        });
}
/**
 * 文章种类查询
 * @returns {Promise}   文章种类查询promise对象
 */
function searchArticleTypes() {
    return new Promise(function (resolve, reject) {
        ArticleType.find(function (err, types) {
            err ? reject('database error') : resolve({articleTypes: types[0].type});
        });
    });
}