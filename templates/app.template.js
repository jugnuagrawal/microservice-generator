const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name,_api,_database,_port){
    return `const path = require('path');
    const express = require('express');
    const bodyParser = require('body-parser');
    const log4js = require('log4js');
    const mongoose = require('mongoose');
    const controller = require('./controllers/${_name}.controller');
    const messages = require('./messages/${_name}.messages');
    const logger = log4js.getLogger('Server');
    const app = express();
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || ${_port};
    const mongo_url = process.env.MONGO_URL || 'mongodb://localhost:27017/${_database}';
    
    //log4js configuration
    log4js.configure({
        appenders: { 'out': { type: 'stdout' } },
        categories: { default: { appenders: ['out'], level: 'info' } }
      });
    
    //body parser middleware
    app.use(bodyParser.json());
    
    //logging each request
    app.use(function(_req,_res,_next){
        logger.info(_req.method,_req.path,_req.params);
        _next();
    });
    
    //checking mongodb is available
    app.use(function(_req,_res,_next){
        if (mongoose.connections.length == 0 || mongoose.connections[0].readyState != 1) {
            mongoose.connect(mongo_url, function (_err) {
                if (_err) {
                    logger.error(_err);
                    _res.status(500).json({message:messages.error['500']});
                } else {
                    _next();
                }
            });
        }else{
            _next();
        }
    });
    
    // Uncomment and right your own business logic to do Authentication check
    /*app.use(function(_req,_res,_next){
        if(_req.headers.Authorization){
            next();
        }else{
            _res.status(401).json({message:messages.error['401']});
        }
    });*/
    
    //CRUD routes
    app.get('${_api}',controller.read);
    app.post('${_api}',controller.create);
    app.get('${path.join(_api,':id')}',controller.read);
    app.put('${path.join(_api,':id')}',controller.update);
    app.delete('${path.join(_api,':id')}',controller.delete);
    
    //Invalid routes handle
    app.use('*',function(_req,_res){
        _res.status(404).json({message:messages.error['404']});
    });
    
    
    //Starting server
    app.listen(port,host,function(){
        console.log('Server is listening at ','http://'+host+':'+port+'/');
    });`;

}