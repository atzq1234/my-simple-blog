var User = require('../models/user.js');
var Article = require('../models/article.js');
module.exports = function (app, credenticals, nodemailer) {
    // 登录
    app.post('/api/login', function (req, res) {
        User.find({name: req.body.name, password: req.body.password}, function (err, user) {
            if (err) return res.json({code: 0, msg: '数据库查询失败'});
            if (!user.length) return res.json({code: 0, msg: '用户名或密码错误'});
            if (user[0].role == 0) req.session.isAdmin = true;
            req.session.isLogin = true;
            req.session.username = user[0].name;
            res.json({code: 1});
        });
    });
    // 登出
    app.get('/api/signup', function (req, res) {
        delete req.session.isLogin;
        delete req.session.isAdmin;
        res.json({code: 1});
    });
    // 注册
    app.post('/api/register', function (req, res) {
        User.find({name: req.body.name}, function (err, user) {
            if (err) return res.json({code: 0, msg: '数据库查询失败'});
            if (user.length) return res.json({code: 0, msg: '用户名已存在'});
            req.body.role = 1;
            new User(req.body).save(function (err, user) {
                if (err) return res.json({code: 0, msg: '数据库添加失败'});
                // 如果提交了邮箱, 则发送一封邮件
                if (req.body.email) {
                    var mailTransport = nodemailer.createTransport({
                        host: 'smtp.qq.com',
                        secureConnection: true,
                        port: 465,
                        auth: {
                            user: credenticals.email.qq.user,
                            pass: credenticals.email.qq.password
                        }
                        //logger: true,
                        //debug: true
                    });
                    mailTransport.sendMail({
                        from: '174777723@qq.com',
                        to: req.body.email,
                        subject: 'Thank you to register my blog!',
                        text: 'hello world!'
                    }, function (err, info) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(info.response);
                        }
                    });
                }
                req.session.isLogin = true;
                req.session.username = req.body.name;
                res.json({code: 1, userId: user._id});
            });
        });
    });
    // 文章发表表单处理
    app.post('/api/article-publish', function (req, res) {
        for (var x in req.body) {
            if (req.body[x] == '') {
                req.session.result = {class: 'danger', msg: '休想绕过前端验证'};
                return res.redirect(303, '../../admin/ctrl-article');
            }
        }
        req.body.date = (new Date(req.body.date)).getTime();
        new Article(req.body).save(function (err) {
            if (err) {
                req.session.result = {class: 'danger', msg: '保存文章时出现了问题TAT'};
                return res.redirect(303, '../../admin/ctrl-article');
            }
            req.session.result = {
                class: 'success',
                msg: '成功发表了一篇文章- 3-'
            };
            res.redirect(303, '../../admin/ctrl-article');
        });
    });
    // 修改文章
    app.post('/api/article-update/:id', function (req, res) {
        Article.update({_id: req.params.id}, {
            title: req.body.title,
            author: req.body.author,
            date: (new Date(req.body.date)).getTime(),
            description: req.body.description,
            articleType: req.body.articleType,
            content: req.body.content
        }, function (err, raw) {
            if (err) return res.send(500, 'database error');
            req.session.result = {
                class: 'success',
                msg: '修改成功- .-'
            };
            res.redirect(303, '../../admin/ctrl-article');
        });
    });
    // 删除文章
    app.get('/api/article-delete/:id', function (req, res) {
        Article.remove({_id: req.params.id}, function (err) {
            if (err) return res.json({code: 0, msg: '数据库删除失败'});
            res.json({code: 1});
        });
    });
    // 编辑用户密码, 邮箱
    app.post('/api/user-edit', function (req, res) {
        User.update({_id: req.body.id}, {
            password: req.body.password,
            email: req.body.email
        }, function (err) {
            if (err) return res.json({code: 0, msg: '数据库保存失败'});
            res.json({code: 1});
        });
    });
    // 删除用户
    app.get('/api/user-delete/:id', function (req, res) {
        User.remove({_id: req.params.id}, function (err) {
            if (err) return res.json({code: 0, msg: '数据库删除失败'});
            res.json({code: 1});
        });
    });
    // 加载更多文章(首页)
    app.get('/api/load-more-article/:times', function (req, res) {
        Article.find(function (err, articles) {
            if (err) return res.json({code: 0, msg: '数据库查询失败'});
            res.json({code: 1, content: articles});
        }).sort({date: -1}).limit(10).skip(10 * req.params.times + 1);
    });
    // 加载更多文章(搜索结果)
    app.get('/api/load-more-article/:type/:typeContent/:times', function (req, res) {
        var type = req.params.type,
            typeContent = req.params.typeContent,
            times = req.params.times,
            condition = new RegExp(typeContent, 'i');
        if (type == 'title') {
            Article.find({title: condition}, function (err, articles) {
                if(err) return res.json({code: 0, msg: '数据库查询失败'});
                res.json({code: 1, content: articles});
            }).sort({date: -1}).limit(10).skip(10 * times + 1);
        } else {
            Article.find({articleType: condition}, function (err, articles) {
                if(err) return res.json({code: 0, msg: '数据库查询失败'});
                res.json({code: 1, content: articles});
            }).sort({date: -1}).limit(10).skip(10 * times + 1);
        }
    });
    // 加载更多用户
    app.get('/api/load-more-user/:times', function (req, res) {
        User.find(function (err, articles) {
            if (err) return res.json({code: 0, msg: '数据库查询失败'});
            res.json({code: 1, content: articles});
        }).limit(10).skip(10 * req.params.times + 1);
    });
    // 搜索用户(后台)
    app.get('/api/search-user/:name', function (req, res) {
        var condition = new RegExp(req.params.name, 'i');
        User.find({name: condition}, function (err, users) {
            if(err) return res.json({code: 0, msg: '数据库查询失败'});
            res.json({code: 1, content: users});
        });
    });
    // 搜索文章(后台)
    app.get('/api/search-article/:name', function (req, res) {
        var condition = new RegExp(req.params.name, 'i');
        Article.find({title: condition}, function (err, articles) {
            if(err) return res.json({code: 0, msg: '数据库查询失败'});
            res.json({code: 1, content: articles});
        });
    });

};
