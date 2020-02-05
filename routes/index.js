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

router.get('/getCalculations', function(req, res, next) {
  ref.once("value", function(snapshot) {
    res.send(snapshot.val());
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/findSubsets', function(req,res,next){
  let input = req.body.input;
  let n = parseInt(req.body.n);

  let noOfSubsets = calcs(input, n);

  ref.push().set({
    input: input,
    n: n,
    output: (input.length>=n)?noOfSubsets:-1
  });

  if(input.length<n){
    res.send("No of subsets of size "+ n +" are: " + noOfSubsets);
  }
  else
    res.send("No of subsets of size "+ n +" are: " + noOfSubsets);
});

// function findAllSubsets(length, n){
//   var count = combinatorics.C(length, n);
//   return count;
// }

module.exports = router;
