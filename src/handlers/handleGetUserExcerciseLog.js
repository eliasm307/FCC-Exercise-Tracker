const { mongoGetFilteredUserLogs } = require('../mongo/mongoGetFilteredUserLogs');


// example log
//{"_id":"5ec3c38cc530e526ad533782","username":"5WfZFvsBK","count":239,"log":[{"description":"jogging","duration":22,"date":"Sun Nov 01 2020"},{"description":"play football","duration":45,"date":"Wed Oct 28 2020"}

// - I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
// - I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
module.exports.handleGetUserExcerciseLog = async (req, res, next) => {
  console.log(__filename, "start...", {reqQuery: req.query});

  if(!req.query.userId) {
    console.log(__filename, "Error: request doesnt have id specified");
    return next({error: "Error: request doesnt have id specified"});
  }

  let parsedDate;
  let error;

  // check from date format if defined
  if(req.query.from) {
    parsedDate = new Date(req.query.from); 
    if(isNaN(parsedDate)) {
      error = {error: "from date is invalid format '" + req.query.from + "'"};
      console.log(__filename, error)
      return next(error);
    };
    // change from to the date before at the last moment
    parsedDate.setDate(parsedDate.getDate() - 1);
    parsedDate.setHours(23);
    parsedDate.setMinutes(59);
    parsedDate.setSeconds(59);
    // add unix time to request query
    req.query.fromUnix = parsedDate.getTime();
  }

  // check to date format if defined
  if(req.query.to) {
    parsedDate = new Date(req.query.to); 
    if(isNaN(parsedDate)) { 
      error = {error: "to date is invalid format '" + req.query.to + "'"};
      console.log(__filename, error)
      return next(error);
    };
    // change date to day after at first moment
    parsedDate.setDate(parsedDate.getDate() + 1);
    parsedDate.setHours(0);
    parsedDate.setMinutes(0);
    parsedDate.setSeconds(1);
    // add unix time to request query
    req.query.toUnix = parsedDate.getTime();
  }

  try {
    const foundData = await mongoGetFilteredUserLogs(req.query);
    console.log(__filename, "user with filtered log", {foundData});
    return res.json(foundData);

  }
  catch (err) {
    console.log(__filename, "Error", { err });
    return next(JSON.stringify({ error: "Error finding URL", err }));

  };

};