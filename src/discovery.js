var express=require('express');
var router=express.Router();
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

let cred=require('./credentials');
var discovery = new DiscoveryV1({
  username: cred.dis_username,
  password: cred.dis_password,
  version: 'v1',
  version_date: '2017-09-01'
});

router.get('/environments',function(req,res){
    discovery.getEnvironments({}, function(error, data) {
        res.status(200).json(data);
    });
})

router.get('/environments/:id',function(req,res){
    discovery.getEnvironment(({environment_id:req.params.id}), function(error, data) {
        res.status(200).json(data);
    });
})

router.get('/configurations/:id',function(req,res){
    discovery.getConfigurations(({environment_id:req.params.id}), function(error, data) {
        res.status(200).json(data);
    });
});

router.get('/configurations/:e_id/:c_id',function(req,res){ 
    discovery.getConfiguration(({environment_id:req.params.e_id,configuration_id:req.params.c_id}), function(error, data) {
        res.status(200).json(data);
    });
})

router.get('/collections/:id',function(req,res){
    discovery.getCollections(({environment_id:req.params.id}), function(error, data) {
        res.status(200).json(data);
    });
});

router.get('/collections/:e_id/:c_id',function(req,res){ 
    discovery.getCollection(({environment_id:req.params.e_id,collection_id:req.params.c_id}), function(error, data) {
        res.status(200).json(data);
    });
})

router.get('/query/:e_id/:c_id',function(req,res){ 
    discovery.query({environment_id:req.params.e_id,collection_id:req.params.c_id,query_string:req.query.query}, function(error, data) {
       res.status(200).json(data);
    });
})

module.exports=router;