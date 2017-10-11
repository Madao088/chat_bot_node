var express=require('express');
var router=express.Router();
var watson = require("watson-developer-cloud");
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

var fs = require('fs');
let cred=require('./credentials');
var conversation = new watson.ConversationV1({
        username: cred.username,
        password: cred.password,
        version_date: '2017-05-26'
     });

     

var text_to_speech = new TextToSpeechV1({
  username: cred.tts_username,
  password: cred.tts_password
});

var discovery = new DiscoveryV1({
  username: cred.dis_username,
  password: cred.dis_password,
  version: 'v1',
  version_date: '2017-09-01'
});

router.get('/discovery',function(req,res){
    discovery.getEnvironments({}, function(error, data) {
    res.status(200).json(data);
});
})
router.get('/tts_test/:id', function (req, res) {
    
        var filePath="./hello_world.wav";
        var stat = fs.statSync(filePath);

         var filePath="./hello_world.wav";
        var stat = fs.statSync(filePath);
        console.log(stat);
        res.writeHead(200, {
            'Content-Type': 'audio/wav',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res); 

    
})


router.post('/query', function (req, res) {

    var context = {};
    conversation.message({
        workspace_id: '36be7e85-a209-4261-a568-4ee7a8bc2671',
        input: {'text': req.body.query},
        context: req.body.context,
        },  function(err, response) {
        if (err)
            res.status(500).json(err);
        else{
            console.log(response);
             if(response.entities[0]||(response.intents[0]&&response.intents[0].confidence<0.5))
                console.log("yes");
            else
                console.log("no"); 
            var params = {
                text: response.output.text[0],
                voice: 'en-US_AllisonVoice', // Optional voice
                accept: 'audio/wav'
            };

        // Pipe the synthesized text to a file
            text_to_speech.synthesize(params).on('error', function(error) {
                res.status(200).json(error);
            }).pipe(fs.createWriteStream('hello_world.wav')).on('finish',function(){
            res.status(200).json(response);
            })
        }
            
    });
    

})

router.get('/workspace',function(err,res){
    var params = {
        workspace_id: 'e8508967-78f0-421d-9be6-bd8521a7cbcb'
    };

    conversation.getWorkspace(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response);
        }

    });
})

router.get('/entities',function(err,res){
    var params = {
        workspace_id: 'e8508967-78f0-421d-9be6-bd8521a7cbcb',
        export:true
    };

    conversation.getEntities(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response);
        }

    });
})

router.get('/intents',function(err,res){
    var params = {
        workspace_id: 'e8508967-78f0-421d-9be6-bd8521a7cbcb',
        export:true
    };

    conversation.getIntents(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response);
        }

    });
})


router.get('/intent/:intent',function(err,res){
    var params = {
        workspace_id: 'e8508967-78f0-421d-9be6-bd8521a7cbcb',
        intent:req.params.intent
    };

    conversation.getIntent(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response);
        }

    });
})

router.get('/entity/:entity',function(err,res){
    var params = {
        workspace_id: 'e8508967-78f0-421d-9be6-bd8521a7cbcb',
        entity:req.params.entity
    };

    conversation.getEntity(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response);
        }

    });
})

router.post('/intent',function(req, res){
    var params = {
        workspace_id: 'e8508967-78f0-421d-9be6-bd8521a7cbcb',
        intent:req.body.intent,
        examples:req.body.data
    };

    conversation.createIntent(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response);
        }

    });
})

router.post('/entity',function(req, res){
    var params = {
        workspace_id: 'e8508967-78f0-421d-9be6-bd8521a7cbcb',
        entity:req.body.entity,
        values:req.body.data
    };

    conversation.createEntity(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response);
        }

    });
})

router.get('/logs',function(req, res){
    var params = {
        workspace_id: '36be7e85-a209-4261-a568-4ee7a8bc2671'
    };

    conversation.getLogs(params, function(err, response) {
        if (err) {
            res.status(200).json(err);
        } else {
           res.status(200).json(response.logs[8]);
        }

    });
})

module.exports = router;