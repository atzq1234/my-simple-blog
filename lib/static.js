var baseUrl = '';
var cloudflare = '//cdnjs.cloudflare.com/ajax/libs';
exports.map = {
    local: function (name) {
        return baseUrl + name;
    },
    cloudflare: function (name) {
        return cloudflare + name;
    }
};