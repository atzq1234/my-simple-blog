var express = require('express');
var credenticals = require('./credenticals.js');
var nodemailer = require('nodemailer');
var staticRes = require('./lib/static');
//var sassMiddleware = require('node-sass-middleware');
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        static: function (name) {
            return staticRes.map.local(name);
        },
        cloudflare: function (name) {
            return staticRes.map.cloudflare(name);
        },
        ifCond: function (a, b, cond, options) {
            switch (cond){
                case '>':
                    return (a > b) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (a < b) ? options.fn(this) : options.inverse(this);
                case '==':
                    return (a == b) ? options.fn(this) : options.inverse(this);
                default :
                    return options.inverse(this);
            }
        }
    }
});

var app = express();
var mongodb =require('./lib/mongodb.js')(app, credenticals);    // 连接mongodb
app.set('port', process.env.PORT || 3000);  // 指定node服务器端口
app.engine('handlebars', handlebars.engine);    // 设置引擎为handlebars, 默认是jade
app.set('view engine', 'handlebars');   // 设置视图引擎为handlebars
//app.set('view cache', true);    // 开启模版缓存, 提高性能, 默认关闭, 在生产环境开启
// 查询字符串中的test=1, url带有参数test=1, 测试功能开启
app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});
app.use(function (req, res, next) {
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.header = [];
    res.locals.partials.modal = [];
    res.locals.partials.sidebarleft = [];
    res.locals.partials.totop = [];
    next();
});
app.use(require('body-parser')());  // 使用插件body-parser, 令req.body可用
app.use(require('cookie-parser')(credenticals.cookieSecret));
app.use(require('express-session')({
    secret: 'user for login',
    resave: false,
    saveUninitialized: false
}));
app.use(function (req, res, next) {
    res.locals.isLogin = req.session.isLogin;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.username = req.session.username;
    res.locals.result = req.session.result;
    next();
});
/*// 注意: 中间件node-sass-middleware必须放在设置静态资源目录之前
app.use(sassMiddleware({
    src: __dirname + '/public/stylesheets/sass',
    dest: __dirname + '/public/stylesheets',
    //debug: true,
    outputStyle: 'expanded',
    prefix: '/stylesheets'  // 说明详见http://stackoverflow.com/questions/30654312/why-node-sass-middleware-is-not-working
}));*/
app.use(express.static(__dirname + '/public')); // 设置静态资源目录 __dirname代表项目根目录, static方法内置了next()方法, 作为一个中间件, ta应当定义在首个不带next()方法的中间件之前
var route = require('./router/route.js')(app); // 引入自定义的路由模块
var api = require('./api/api.js')(app, credenticals, nodemailer);
app.use(function (req, res, next) {
    res.status(404);
    res.render('404', { layout: null });
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500', { layout: null });
});

// 注册一个服务器
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminal in cmd :)');
});