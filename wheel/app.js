
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    forrest = require('forrest'),
    ViewRegistry = require('./viewregistry'),
    AuthRegistry = require('./authregistry'),
    TraversalRegistry = require('./traversalregistry'),
    EventsRegistry = require('./eventsregistry');    

module.exports = function setup(options, imports, register) {

    var expr = express();

    // all environments
    expr.set('port', options.port);
    expr.set('views', "/");
        
    expr.set('view engine', 'ejs');
    expr.use(express.favicon());
    expr.use(express.logger('dev'));
    expr.use(express.bodyParser());
    expr.use(express.methodOverride());
    expr.use(express.cookieParser('your secret here'));
    expr.use(express.session());

    expr.use(forrest.traversalMiddleware(TraversalRegistry, {type: 'directory', path: ''}));
    expr.use(forrest.viewMiddleware(ViewRegistry));
    expr.use(forrest.authMiddleware(AuthRegistry));
    
    
    expr.use(forrest.renderMiddleware);


//    expr.use(expr.router);

    // development only
    if ('development' == expr.get('env')) {
      expr.use(express.errorHandler());
    }

    http.createServer(expr).listen(expr.get('port'), function(){
      console.log('Express server listening on port ' + expr.get('port'));
    });

    register(null, {
        wheel: {
            opt: options,
            http: http,
            express: expr,
            views: ViewRegistry,
            auth: AuthRegistry,
            traversal: TraversalRegistry,
            events: EventsRegistry
        }
    });
};

