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
    const schema = require('./schemas/${_name}.schema');
    const logger = log4js.getLogger('Server');
    const app = express();
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || ${_port};
    const mongo_url = process.env.MONGO_URL || 'mongodb://localhost:27017/${_database}';
    
    //log4js configuration
    log4js.configure({
        appenders: { 'out': { type: 'stdout' },server: { type: 'file', filename: 'logs/server.log' ,maxLogSize:52428800} },
        categories: { default: { appenders: ['out','server'], level: 'info' } }
      });
    
    //body parser middleware
    app.use(bodyParser.json());
    
    //logging each request
    app.use((req,res,next)=>{
        logger.info(req.method,req.headers['x-forwarded-for'] || req.connection.remoteAddress,req.path,req.params,req.query,req.body);
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Methods','*');
        res.setHeader('Access-Control-Allow-Headers','*');
        next();
    });
    
    //checking mongodb is available
    app.use((req,res,next)=>{
        if (mongoose.connections.length == 0 || mongoose.connections[0].readyState != 1) {
            mongoose.connect(mongo_url, (err)=>{
                if (err) {
                    logger.error(err);
                    res.status(500).json({message:messages.error['500']});
                } else {
                    next();
                }
            });
        }else{
            next();
        }
    });
    
    // Uncomment and right your own business logic to do Authentication check
    /*app.use((req,res,next)=>{
        if(req.headers.authorization){
            next();
        }else{
            res.status(401).json({message:messages.error['401']});
        }
    });*/
    
    //CRUD routes
    app.get('${_api}/count',controller.count);
    app.get('${_api}',controller.read);
    app.post('${_api}',controller.create);
    app.get('${path.join(_api,':id')}',controller.read);
    app.put('${path.join(_api,':id')}',controller.update);
    app.delete('${path.join(_api,':id')}',controller.delete);
    

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname,'apidoc'));
    app.get('/apidoc',(req,res)=>{
        res.render('index',{
            host:host,
            port:port,
            name:'',
            api:'${_api}',
            schema:schema
        });
    });

    //Invalid routes handle
    app.use('*',(req,res)=>{
        res.status(404).json({message:messages.error['404']});
    });
    
    
    //Starting server
    app.listen(port,host,()=>{
        logger.info('Server is listening at ','http://'+host+':'+port+'/');
        logger.info('API Documentation at ','http://'+host+':'+port+'/apidoc');
    });`;

}