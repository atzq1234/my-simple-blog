var mongoose = require('mongoose');
module.exports = function (app, credenticals) {
    var mongooseOpt = {
        server: {
            socketOptions: {keepAlive: 1}
        }
    };
    switch (app.get('env')) {
        case 'development':
            mongoose.connect(credenticals.mongo.dep.connectionString, mongooseOpt, function (err) {
                if (err) throw new Error('connect error: ' + err);
                console.log('mongo connect success');
            });
            break;
        case 'production':
            mongoose.connect(credenticals.mongo.pro.connectionString, mongooseOpt, function (err) {
                if (err) throw new Error('connect error: ' + err);
                console.log('mongo connect success');
            });
            break;
        default :
            throw new Error('Unknown exception environment:' + app.get('env'));
    }
};