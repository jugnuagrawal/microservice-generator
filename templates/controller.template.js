const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name) {
    return `
    const mongoose = require('mongoose');
    const utils = require('../utils/utils');
    const schemaJSON = require('../schemas/${_name}.schema');
    const schema = new mongoose.Schema(schemaJSON);
    const log4js = require('log4js');
    const logger = log4js.getLogger('Controller');
    schema.add({_id:{type:"String"}});
    schema.pre('save',utils.getNextId('${_name}'));

    const model = mongoose.model('${_name}',schema);

    log4js.configure({
        appenders: { 'out': { type: 'stdout' },controller: { type: 'file', filename: 'logs/controller.log',maxLogSize:52428800 } },
        categories: { default: { appenders: ['out','controller'], level: 'info' } }
    });

    function _create(req,res){
        model.create(req.body,(err,data)=>{
            if(err){
                logger.error(err);
                res.status(400).json({code:err.code,message:err.message});
            }else{
                res.status(200).json(data);
            }
        });
    }

    function _retrive(_req,_res){
        var query = null;
        var skip = 0;
        var count = 10;
        var filter = {};
        if(req.query.count && (+req.query.count)>0){
            count = +req.query.count;
        }
        if(req.query.page && (+req.query.page)>0){
            skip = count*((+req.query.page)-1);
        }
        if(req.query.filter){
            try{
                filter = JSON.parse(req.query.filter,(_key, _value) =>{
                    if(typeof _value == 'string' && _value.match(/^(\\/)*[\\w]+(\\/)*[a-z]{0,1}/)){
                        if(_value.charAt(_value.length-1)!='/'){
                            return new RegExp(_value.replace(/^\\/*([\\w]+)\\/*[a-z]*$/,'$1'),_value.replace(/^.*\\/([a-z]+)$/,'$1'));
                        }else{
                            return new RegExp(_value.replace(/^\\/*([\\w]+)\\/*[a-z]*$/,'$1'));
                        }
                    }
                    return _value;
                });
            }catch(_e){
                logger.error(_e);
            }
        }
        if(req.params.id){
            query = model.findById(req.params.id);
        }else{
            query = model.find(filter);
            query.skip(skip);
            query.limit(count);
        }
        if(req.query.select){
            query.select(req.query.select.split(',').join(' '));
        }
        if(_req.query.sort){
            query.sort(_req.query.sort.split(',').join(' '))
        }
        query.exec().then(data => {
            res.status(200).json(data);
        }).catch(err => {
            logger.error(err);
            _res.status(400).json({code:err.code, message:err.message});
        });
    }

    function _update(req,res){
        model.findOneAndUpdate({_id:req.params.id},req.body,(err,data)=>{
            if(err){
                logger.error(err);
                res.status(400).json({code:err.code,message:err.message});
            }else{
                res.status(200).json(data);
            }
        });
    }

    function _delete(req,res){
        model.findByIdAndRemove(req.params.id,(err,data)=>{
            if(err){
                logger.error(err);
                res.status(400).json({code:err.code,message:err.message});
            }else{
                res.status(200).json(data);
            }
        });
    }

    function _count(req,res){
        if(req.query.filter){
            model.where(req.query.filter);
        }
        model.countDocuments((err,result)=>{
            if(err){
                logger.error(err);
                res.status(400).json({code:err.code,message:err.message});
            }else{
                res.status(200).json(result);
            }
        });
    }


    //Exporting CRUD controllers
    module.exports = {
        create:_create,
        retrive:_retrive,
        update:_update,
        delete:_delete,
        count:_count
    }
    `;
}
