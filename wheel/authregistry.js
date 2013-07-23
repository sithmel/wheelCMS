var or = require('occamsrazor');

AuthRegistry = or();

// auth: req, view, context
var BaseAuth = function (req, view, context){
    this.req = req;
    this.context = context;
    this.view = view;
};

BaseAuth.prototype.check = function (next){
    return next();
};

AuthRegistry.addNew([or.isAnything, or.isAnything, or.isAnything], BaseAuth);

module.exports = AuthRegistry;
