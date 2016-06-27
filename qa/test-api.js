var chai = require('chai');
var chaiHttp = require('chai-http');
var http = require('http');
var rest = require('restler');
var assert = chai.assert;
chai.use(chaiHttp);
var baseUrl = 'http://localhost:3000';
var md5 = require('blueimp-md5');
var adminData = {
    name: 'admin',
    password: md5('123456')
};
suite('Api Tests', function () {
    this.timeout(5000); // 设置测试超时时间, 默认2秒

    test('should be able to register an account', function (done) {
       var regData = {
           name: 'user' + Math.ceil(Math.random() * 100000),
           password: md5('123456'),
           email: ''
       };
       rest.post(baseUrl + '/api/register', {data: regData}).on('success', function (data) {
           assert(data.code === 1, 'register success');
           done();
       });
    });

    //test('should be able to sign in', function (done) {
    //    var userName = 'user' + Math.ceil(Math.random() * 100000);
    //    var userData = {
    //        name: userName,
    //        password: md5('123456')
    //    };
    //    var regData = {
    //        name: userName,
    //        password: md5('123456'),
    //        email: ''
    //    };
    //    rest.post(baseUrl + '/api/register', {data: regData}).on('success', function (data) {
    //        rest.post(baseUrl + '/api/login', {data: userData}).on('success', function (data) {
    //            assert(data.code === 1, 'login success');
    //            done();
    //        });
    //    });
    //});

    //test('should be able to sign up', function (done) {
    //    var userName = 'user' + Math.ceil(Math.random() * 100000);
    //    var userData = {
    //        name: userName,
    //        password: md5('123456')
    //    };
    //    var regData = {
    //        name: userName,
    //        password: md5('123456'),
    //        email: ''
    //    };
    //    rest.post(baseUrl + '/api/register', {data: regData}).on('success', function () {
    //        rest.post(baseUrl + '/api/login', {data: userData}).on('success', function () {
    //            rest.get(baseUrl + '/api/signup').on('success', function (data) {
    //                assert(data.code === 1, 'sign up success');
    //                done();
    //            });
    //        });
    //    });
    //});

    // test('should be able to publish an article', function (done) {
    //    rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {    // 必须先登录管理员才能发表文章, TODO: 因为后台url增加了管理员session验证, 所以测试这个api, 还得先关闭session验证, 求优雅的解决方案
    //        var newArticle = {
    //            title: '123',
    //            author: 'admin',
    //            date: new Date().getTime(),
    //            description: '测试描述描述',
    //            articleType: 'javascript',
    //            content: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容'
    //        };
    //        chai.request(baseUrl).post('/api/article-publish')
    //            .send(newArticle)   // 一般的POST请求用send方法, 如果用field方法, 则表单要设置enctype="multipart/form-data"
    //            .end(function (err, res) {
    //                //assert(res.status === 200, 'publish article success');  // 服务端返回303重定向状态码给浏览器, 浏览器根据路径发起了新的GET请求, 故最后返回的状态码是200, 不管是否发布成功, 服务端总是重定向303, 故根据这种条件断言是无法正确判断的
    //                var newArticleReg = new RegExp('<td class="title-article">' + newArticle.title + '</td>', 'i');
    //                assert(res.text.match(newArticleReg).length > 0, 'publish article success');
    //                done();
    //            });
    //    });
    // });

    //test('should be able to able to edit an article', function (done) {
    //    rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {
    //        var newArticle = {
    //            title: '测试标题',
    //            author: 'admin',
    //            date: new Date().getTime(),
    //            description: '测试描述描述',
    //            articleType: 'javascript',
    //            content: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容'
    //        };
    //        chai.request(baseUrl).post('/api/article-publish')
    //            .send(newArticle)
    //            .end(function (err, res) {
    //                var articleId = (res.text.substr(res.text.indexOf('data-id')).substr(0, res.text.substr(res.text.indexOf('data-id')).indexOf('">') + 1).match(/\d+/))[0],   // 目前写过最长的获取字符串表达式= =#
    //                    newArticle = {
    //                        title: '测试标题 - 改',
    //                        author: 'admin',
    //                        date: new Date().getTime(),
    //                        description: '测试描述描述 - 改',
    //                        articleType: 'nodejs',
    //                        content: '老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ? '
    //                    };
    //                chai.request(baseUrl).post('/api/article-update/' + articleId)
    //                    .send(newArticle)
    //                    .end(function (err, res) {
    //                        var newArticleReg = new RegExp('<td class="title-article">' + newArticle.title + '</td>', 'i');
    //                        assert(res.text.match(newArticleReg).length > 0, 'publish article success');
    //                        done();
    //                    });
    //            });
    //    });
    //});

    //test('should be able to able to delete an article', function (done) {
    //    rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {
    //        var newArticle = {
    //            title: '测试标题',
    //            author: 'admin',
    //            date: new Date().getTime(),
    //            description: '测试描述描述',
    //            articleType: 'javascript',
    //            content: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容'
    //        };
    //        chai.request(baseUrl).post('/api/article-publish')
    //            .send(newArticle)
    //            .end(function (err, res) {
    //                var articleId = (res.text.substr(res.text.indexOf('data-id')).substr(0, res.text.substr(res.text.indexOf('data-id')).indexOf('">') + 1).match(/\d+/))[0];   // 目前写过最长的获取字符串表达式= =#, TODO: 有更简单的思路, 先匹配第一个data-id="", 再获取数字, 有空搞
    //                rest.get(baseUrl + '/api/article-delete/' + articleId).on('success', function (data) {
    //                    assert(data.code === 1, 'delete article successfully');
    //                    done();
    //                });
    //            });
    //    });
    //});

    //test('should be able to edit a user', function (done) {
    //    var userName = 'user' + Math.ceil(Math.random() * 100000),
    //        regData = {
    //            name: userName,
    //            password: md5('123456'),
    //            email: ''
    //        };
    //    rest.post(baseUrl + '/api/register', {data: regData}).on('success', function (data) {
    //        var userId = data.userId;
    //        rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {
    //            var editData = {
    //                id: userId,
    //                password: '99998',
    //                email: '998@gmail.com'
    //            };
    //            rest.post(baseUrl + '/api/user-edit', {data: editData}).on('success', function (data) {
    //                assert(data.code === 1, 'edit user successfully');
    //                done();
    //            });
    //        });
    //    });
    //});

    //test('should be able to delete a user', function (done) {
    //    var userName = 'user' + Math.ceil(Math.random() * 100000),
    //        regData = {
    //            name: userName,
    //            password: md5('123456'),
    //            email: ''
    //        };
    //    rest.post(baseUrl + '/api/register', {data: regData}).on('success', function (data) {
    //        var userId = data.userId;
    //        rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {
    //            rest.get(baseUrl + '/api/user-delete/' + userId).on('success', function (data) {
    //                assert(data.code === 1, 'edit user successfully');
    //                done();
    //            });
    //        });
    //    });
    //});

    // 参考 https://github.com/chaijs/chai-http
    //test('should be able to search articles by title', function (done) {
    //    var searchTitle = {title: '测试'};
    //    chai.request(baseUrl).get('/search').query(searchTitle).end(function (err, res) {
    //        console.log(res);
    //        assert(res.status === 200, 'search article success');
    //        done();
    //    });
    //});

    // test('should be able to load more articles', function (done) {
    //     rest.get(baseUrl + '/api/load-more-article/1').on('success', function (data) {
    //         assert(data.code === 1, 'load articles successfully');
    //         done();
    //     });
    // });

});