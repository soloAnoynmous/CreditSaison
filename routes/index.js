var express = require('express');
var router = express.Router();
var firebase = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
var combinatorics = require('js-combinatorics');
var calcs = require('./calculation.js');

const https = require('https');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://creditsaisonassignment.firebaseio.com/"
});

var db = firebase.database();
var ref = db.ref("restricted_access/calculations");

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

// check for empty object
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// get all history
router.get('/getCalculations', function(req, res, next) {
  ref.once("value", function(snapshot) {
    res.send(snapshot.val());
  });
});

// sucess history
router.get('/getValidLogs', function(req, res, next) {
  ref.orderByChild("timestamp").once("value", snap => {
    ref.orderByChild("is_valid_request").equalTo(1).once("value", snap => {
      res.send(snap.val());
    });
  });
});

// error history
router.get('/getInvalidLogs', function(req, res, next) {
  ref.orderByChild("timestamp").once("value", snap => {
    ref.orderByChild("is_valid_request").equalTo(0).once("value", snap => {
      let result = snap.val();
      res.send(result);
    });
  });
});

// filter by timestamp
router.get('/sortByTime', function(req,res,next){
  let startTime = parseInt(req.body.start);
  let endTime = parseInt(req.body.end);

  ref.orderByChild("timestamp").startAt(startTime).endAt(endTime).once("value", snap => {
    let result = snap.val();
    if(result){
      res.send(result);
    }else{
      res.send("Sorry, no matching result found..");
    }
  });
});

// filter by timestamp - valid
router.get('/sortByTimeValid', function(req,res,next){
  let startTime = parseInt(req.body.start);
  let endTime = parseInt(req.body.end);

  ref.orderByChild("timestamp").startAt(startTime).endAt(endTime).once("value", snap => {
    ref.orderByChild("is_valid_request").equalTo(1).once("value", snap => {
      let result = snap.val();
      if(result){
        res.send(result);
      }else{
        res.send("Sorry, no matching result found..");
      }
    });
  });
});

// filter by timestamp - Invalid
router.get('/sortByTimeInValid', function(req,res,next){
  let startTime = parseInt(req.body.start);
  let endTime = parseInt(req.body.end);

  ref.orderByChild("timestamp").startAt(startTime).endAt(endTime).once("value", snap => {
    ref.orderByChild("is_valid_request").equalTo(0).once("value", snap => {
      let result = snap.val();
      if(result){
        res.send(result);
      }else{
        res.send("Sorry, no matching result found..");
      }
    });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/findSubsets', function(req,res,next){
  let input = req.body.input;
  let n = req.body.n;

  const gen_err = "Invalid data type received";
  const msg_success = "Valid Request";
  let is_valid_request = 1;

  if(typeof n === "number" && n<input.length){
    let noOfSubsets = calcs(input, n);
    let data = {
      input: input,
      n: n,         
      output: (input.length>=n)?noOfSubsets:-1,
      timestamp : new Date().getTime(),
      //timestamp: new Date().today()+" - "+ new Date().timeNow(),
      msg: msg_success,
      is_valid_request : is_valid_request
    }

    ref.push().set(data);
    res.send(data);
  }
  else{
    res.send(gen_err);
    is_valid_request = 0;

    let data = {
      input: input,
      n: n,
      err: gen_err,
      timestamp : new Date().getTime(),
      is_valid_request: is_valid_request
      //timestamp: new Date().today()+" - "+ new Date().timeNow()
    }

    ref.push().set(data);
    res.send(data);
  }
});

module.exports = router;

