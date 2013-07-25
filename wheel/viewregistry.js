var or = require('occamsrazor'),
    url = require('url');
    
var ViewRegistry = or();

// view: req, context
var BaseView = function (req, context){
    this.req = req;
    this.context = context;
};

BaseView.prototype.render = function (res){
    return res.send(this.context.get());
};

var isEmptyUrl = or.chain(or.isAnything, function (req){
    return url.parse(req.url).pathname === '/';
});

ViewRegistry.addNew([isEmptyUrl, or.isAnything], BaseView);

module.exports = ViewRegistry;
