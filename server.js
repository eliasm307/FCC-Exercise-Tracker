const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongo = require('mongodb');

const { handlePostNewUser } = require('./src/handlers/handlePostNewUser');
const { handleGetUsers } = require('./src/handlers/handleGetUsers');
const { handlePostAddExcercise } = require('./src/handlers/handlePostAddExcercise');
const { handleGetUserExcerciseLog } = require('./src/handlers/handleGetUserExcerciseLog');
const testRequests = require('./src/testRequests');

const SPACER = "--------------------------------------------------------------------------------------------------------";

// connect to mongo
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useFindAndModify: false 
    
    });
    console.log("Connected to Mongo successfully");
  } catch (err) {
    console.log("Mongo connection initial error", {err});
    throw new Error('Mongo connection error');
  };
})()

// set mongoose error handler after connection established
mongoose.connection.on('error', err => {
  console.log("Mongo connection error", {err});
});

const app = express();
app.use(cors());

// mount body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// create static folder
app.use(express.static('public'));

// log all requests
app.use((req, res, next) => {
  console.log(SPACER);
  console.log(req.method + " " + req.path + " - " + req.ip);

  if(req.method === 'POST') console.log("req.body:", req.body)
  console.log("request details:", {reqQuery: req.query, reqParams: req.params});
 
  console.log(SPACER);
  next();
});

// route to check health status
app.get(['/is-mongoose-ok', '/u-ok'], function(req, res) {
  if (mongoose) {
    res.json({isMongooseOk: !!mongoose.connection.readyState})
  } else {
    res.json({isMongooseOk: false})
  }
});

// main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
 
});

// User Stories
//-------------------------------

// - I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
app.post("/api/exercise/new-user", async (req, res, next) => { 
  try{
      await handlePostNewUser(req, res, next); 
  }
  catch(err) {
    console.log(req.path, "POST async error: ", {path: req.path, err});
    next();
  }
});

// - I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
app.get("/api/exercise/users", async (req, res, next) => {
  try{
    await handleGetUsers(req, res, next);
  }
  catch(err) {
    console.log(req.path, "GET async error: ", {path: req.path, err});
    next();
  }
});

// - I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
app.post("/api/exercise/add", async (req, res, next) => {
  try{
    await handlePostAddExcercise(req, res, next); 
  }
  catch(err) {
    console.log(req.path, "POST async error: ", {path: req.path, err});
    next();
  }
});

// - I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
// - I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
app.get("/api/exercise/log", async (req, res, next) => {
  try{
    await handleGetUserExcerciseLog(req, res, next);
  }
  catch(err) {
    console.log(req.path, "GET async error: ", {path: req.path, err});
    next();
  }
});
 
// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})
 
// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt').send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

// test requests
// testRequests.sendTestPostCreateNewUserRequest();
// testRequests.sendTestGetRequest("https://FCC-Exercise-Tracker.eliasm307.repl.co/api/exercise/users");
// testRequests.sendTestPostCreateNewUserExcerciseRequest();
testRequests.sendTestGetRequest("https://FCC-Exercise-Tracker.eliasm307.repl.co/api/exercise/log?userId=5f9f02b21b7a4c0221ee55e6&from=2020-11-01&to=2020-11-01&limit=2");