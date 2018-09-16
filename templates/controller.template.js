const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name){
    return `
    const mongoose = require('mongoose');
    const utils = require('../utils/utils');
    const schema = require('../schemas/${_name}.schema');
    const _schema = new mongoose.Schema(schema);
    const log4js = require('log4js');
    const logger = log4js.getLogger('Controller');
    _schema.add({_id:{type:"String"}});
    _schema.pre('save',utils.getNextId('${_name}'));

    const _model = mongoose.model('${_name}',_schema);

    log4js.configure({
        appenders: { 'out': { type: 'stdout' },controller: { type: 'file', filename: 'logs/controller.log',maxLogSize:52428800 } },
        categories: { default: { appenders: ['out','controller'], level: 'info' } }
    });

    function _create(_req,_res){
        _model.create(_req.body,function(_err,_data){
            if(_err){
                logger.error(_err);
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).json(_data);
            }
        });
    }

    function _retrive(_req,_res){
        var query = null;
        var skip = 0;
        var count = 10;
        var filter = {};
        if(_req.query.count && (+_req.query.count)>0){
            count = +_req.query.count;
        }
        if(_req.query.page && (+_req.query.page)>0){
            skip = count*((+_req.query.page)-1);
        }
        if(_req.query.filter){
            try{
                filter = JSON.parse(_req.query.filter,(_key, _value) =>{
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
        if(_req.params.id){
            query = _model.findById(_req.params.id);
        }else{
            query = _model.find(filter);
            query.skip(skip);
            query.limit(count);
        }
        if(_req.query.select){
            query.select(_req.query.select.split(',').join(' '));
        }
        if(_req.query.sort){
            query.sort(_req.query.sort.split(',').join(' '))
        }
        query.exec(_handler);
        function _handler(_err,_data){
            if(_err){
                logger.error(_err);
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).json(_data);
            }
        }
    }

    function _update(_req,_res){
        _model.findOneAndUpdate({_id:_req.params.id},_req.body,function(_err,_data){
            if(_err){
                logger.error(_err);
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).json(_data);
            }
        });
    }

    function _delete(_req,_res){
        _model.findByIdAndRemove(_req.params.id,function(_err,_data){
            if(_err){
                logger.error(_err);
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).json(_data);
            }
        });
    }

    function _count(_req,_res){
        var filter = {};
        if(_req.query.filter){
            filter = _req.query.filter;
        }
        _model.count(filter,function(_err,_count){
            if(_err){
                logger.error(_err);
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).end(_count);
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
