const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name){
    return `
    const mongoose = require('mongoose');
    const utils = require('../utils/utils');
    const schema = require('../schemas/${_name}.schema');
    const _schema = new mongoose.Schema(schema);

    _schema.add({_id:{type:"String"}});
    _schema.pre('save',utils.getNextId('${_name}'));

    const _model = mongoose.model('${_name}',_schema);

    function _create(_req,_res){
        _model.create(_req.body,function(_err,_data){
            if(_err){
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).json(_data);
            }
        });
    }

    function _read(_req,_res){
        if(_req.params.id){
            _model.findById(_req.params.id,function(_err,_data){
                if(_err){
                    _res.status(400).json({code:_err.code,message:_err.message});
                }else{
                    _res.status(200).json(_data);
                }
            });
        }else{
            _model.find({},function(_err,_data){
                if(_err){
                    _res.status(400).json({code:_err.code,message:_err.message});
                }else{
                    _res.status(200).json(_data);
                }
            });
        }
    }

    function _update(_req,_res){
        _model.findOneAndUpdate({_id:_req.params.id},_req.body,function(_err,_data){
            if(_err){
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).json(_data);
            }
        });
    }

    function _delete(_req,_res){
        _model.findByIdAndRemove(_req.params.id,function(_err,_data){
            if(_err){
                _res.status(400).json({code:_err.code,message:_err.message});
            }else{
                _res.status(200).json(_data);
            }
        });
    }


    //Exporting CRUD controllers
    module.exports = {
        create:_create,
        read:_read,
        update:_update,
        delete:_delete
    }
    `;
}
