const { mongoCreateNewUser } = require('../mongo/mongoCreateNewUser');

module.exports.handlePostNewUser = async (req, res, next) => {
  console.log(__filename, "start...");

  try{ 
    const data = await mongoCreateNewUser(req.body); 

    // send response using data
    console.log("Sending response: ", data);

    return res.json({
      "username": data["username"], 
      "_id":data["_id"]
    }); 
  
  } 
  catch(err) { 
    console.log(__filename ,"Error", {err}); 
    return next(JSON.stringify({error: "Error finding URL", err}));

  };
   
};