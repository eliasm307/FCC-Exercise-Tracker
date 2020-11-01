const { mongoCreateNewExcercise } = require('../mongo/mongoCreateNewExcercise');


// - I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
module.exports.handlePostAddExcercise = async (req, res, next) => {
  console.log(__filename, "start...");

  // check required query values exist
  if(!(req.body['userId'] && req.body['description'] && req.body['duration'])) {

    const err = {
      error: "Error: not all required properties are included",
      userId: req.query['userId'],
      description: req.query['description'],
      duration: req.query['duration'],
      date: req.query.date
    }

    console.log(__filename, err)
    return next(JSON.stringify(err));
  };

  // check if input duration is numeric
  if(isNaN(req.body.duration)) {
    console.log(__filename, "duration is NaN:", req.body.duration);
    return next({error: "duration is NaN: " + req.body.duration})
  }

  let parsedDate;

  if(!req.body['date']) {
    // if date doesnt exist then set it to now
    console.log(__filename, "Request didnt have date so set it to now", req.body);
    parsedDate = new Date();
  }
  else {
    // parse input date
    parsedDate = new Date(req.body.date);

  }
 
  if(isNaN(parsedDate)) {
    console.log(__filename, "Request date format is not valid");
    return next(JSON.stringify({error: "Request date format is not valid", inputDate: req.body.date}))
  }
 
  // set standard request format for date
  req.body.date = parsedDate.toDateString();
  req.body.dateUnix = parsedDate.getTime(); 

  // create new excercise
  try{  
    const data = await mongoCreateNewExcercise(req.body); 
    console.log(__filename, "New exercise created successfully", {data})
    return res.json(data);

  } 
  catch(err) { 
    console.log(__filename ,"Error", {err}); 
    return next(JSON.stringify({error: "Error finding URL", err}));

  };
   
};