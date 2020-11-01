const { mongoGetUsers } = require('../mongo/mongoGetUsers');

// - I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
module.exports.handleGetUsers = async (req, res, next) => {
  console.log(__filename, "start, trying to get all users...");
  
  let foundData;

  try{ 
    foundData = await mongoGetUsers();
    //console.log(__filename, "found users", {foundData});
    return res.json(foundData); 

  } 
  catch(err) { 
    console.log(__filename ,"Error", {err}); 
    return next(JSON.stringify({error: "Error finding URL", err}));

  };
   
};