var or = require('occamsrazor'),
    forrestFS = require('forrestFS'),
    getDirTraversal = forrestFS.getDirTraversal,
    getFileTraversal = forrestFS.getFileTraversal,
    validators = forrestFS.validators,
    path = require('path'),
    url = require('url');

module.exports = function setup(options, imports, register) {
    var wheel = imports.wheel,
        basepath;
        
    if (options.basepath[0] === '/'){
        basepath = options.basepath;
    }
    else {
        basepath = path.join(__dirname, options.basepath);
    }    

    //initializing file traversing    
    wheel.traversal
        .addNew([or.isAnything, validators.isDir], getDirTraversal(basepath))
        .addNew([or.isAnything, validators.isFile], getFileTraversal(basepath));

    //initializing views
    var DownloadView = function (req, context){
        this.req = req;
        this.context = context;
    };

    DownloadView.prototype.render = function (res){
        var filename = this.context.get().path;
        debugger;
        return res.download(path.join(basepath, filename));
    };

    var isDownload = or.chain(or.isAnything, function (req){
        return url.parse(req.url).pathname === '/download';
    });

    var isFile = or.chain(or.isAnything, function (context){
        return context.get().type === 'file';
    });

    wheel.views
        .addNew([isDownload, isFile], DownloadView)

    register();    
};
