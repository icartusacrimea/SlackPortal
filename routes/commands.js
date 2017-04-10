var bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash        = require("connect-flash"),
    Portal = require("../models/portals"),
    Team = require("../models/teams"),
    request = require("request"),
    express     = require("express");

var router = express.Router();

var website = "https://a5342780.ngrok.io/";

//===================
//SLASH COMMANDS START
//===================

//COMMAND FOR HELPING PEOPLE
router.post("/portalhelp", function(req, res ){
    // console.log(req.body);
    res.json({
        "text": "*The available commands are:*\n*/openportal - Opens a portal.* \n*/closeportal - Closes a portal that you've already created.* \n*/portalhelp - Shows this information message.*",
        "username": "Portal"
    });
});

//SLASH COMMAND FOR OPENING A PORTAL
router.post("/openportal", function(req, res){
    // console.log(req.body);
    Portal.find({teamid: req.body.team_id, channelid : req.body.channel_id}).exec()
    .then(function(foundportal){
        if(foundportal.length > 0){
            // console.log(foundportal + "this is the found portal");
            res.json({text: "You've already created a portal using this channel. Your portal id is: " + foundportal[0].url});
        } else {
            var newportal = {};
            newportal.teamid = req.body.team_id;
            newportal.teamname = req.body.team_domain;
            newportal.channelid = req.body.channel_id;
            Portal.create(newportal, function(error, portal){
                // console.log("this is a new portal" + portal);
                var newurl = website + portal._id;
                Portal.findByIdAndUpdate(portal._id, {url: newurl}, {new: true}).exec()
                .then(function(newportal){
                    // console.log(newportal);
                    res.json({text: "The URL for your new portal is: " + newportal.url + "\nShare it with whoever you wish to invite to this channel.\nTo close the portal, use command */closeportal*.\nRemember that once a portal for this channel is closed, it cannot be reopened with this URL."});
                });
            });
        }
    });
});

//SLASH COMMAND FOR CLOSING A PORTAL
router.post("/closeportal", function(req, res){
    console.log(req.body);
    Portal.find({teamid: req.body.team_id, channelid : req.body.channel_id}).exec()
    .then(function(foundportal){
        if(foundportal.length > 0){
            console.log(foundportal + "this is the found portal");
            Portal.remove({_id: foundportal[0]._id}).exec()
            .then(function(){
                // console.log(newportal);
                res.json({text: "The portal for this channel has closed."});
            });
        } else {
            res.json({text: "You haven't opened a portal for this channel yet. To create one, try the */openportal* command."})
        }
    });
});

module.exports = router;

//===================
//SLASH COMMANDS END
//===================
