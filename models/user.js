var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    _id: Number,
    name: String,
    password: String,
    email: String,
    role: Number,
    photoUrl: String
});
var CounterSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
});
var userCounter = mongoose.model('UserCounters', CounterSchema);
userSchema.pre('save', function (next) {
    var doc = this;
    userCounter.findByIdAndUpdate({_id: 'userId'}, {$inc: {seq: 1}}, {upsert: true}, function (err, counter) {
        if(err) return next(err);
        counter ? doc._id = counter.seq + 1 : doc._id = 1;
        next();
    })
});
module.exports = mongoose.model('Users', userSchema);