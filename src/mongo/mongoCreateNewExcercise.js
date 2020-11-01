const { mongoFindOneUser } = require("./mongoFindOneUser"); 
const ModelExcercise = require('./ModelExcercise');
const ModelUser = require('./ModelUser');

// example result from creating new exercise
//{"_id":"5ec3c38cc530e526ad533782","username":"5WfZFvsBK","date":"Sun Nov 01 2020","duration":22,"description":"jogging"}

module.exports.mongoCreateNewExcercise = async (data) => { 
  console.log(__filename, "start...", {data});

  try { 
    // check if valid data was provided
    if(!data || Object.keys(data).length === 0) {
      console.log(__filename, {error: "no data provided to create new excercise"});
      return Promise.reject({error: "no data provided to create new excercise"});
    } 

    // check if User specified exists
    const foundData = await mongoFindOneUser({_id: data['userId']});
    console.log(__filename,"async result: ",{foundData});
      
    // if user doesnt exist then return error
    if(!foundData || Object.keys(foundData).length === 0) {
      console.log(__filename ,'User doesnt exists:', foundData);   
      return Promise.reject('User doesnt exist with password: ' + foundData['_id']);
    }  

    // create new Excercise for user 
    const newExcercise = {
      description: data.description,
      date: data.date,
      dateUnix: data.dateUnix,
      duration: data.duration,
    }

    console.log(__filename, "new excercise created", {newExcercise}); 

    // add new excercise to user
    console.log(__filename, "Adding excercise to user ", {foundData});
    console.log(__filename, "user log:", foundData.log)
    foundData.log.push(newExcercise);

    console.log(__filename, "trying to edit user with id", foundData._id)
    const newUser = await ModelUser.findOneAndUpdate({_id: foundData._id}, foundData, {new: true}).exec();
    console.log(__filename, "user editted successfully:", {newUser}); 

    // delete unix date key from output
    delete newExcercise.dateUnix;

    console.log(__filename, "returning data", {newExcercise});

    // return object with required keys
    return {
      _id: foundData._id,
      username: foundData.username, 
      duration: parseInt(newExcercise.duration),
      date: newExcercise.date,
      description: newExcercise.description
    };
  
  }
  catch(e) {
    return Promise.reject(e);
  }
 
};
 