const { mongoFindOneUser } = require("./mongoFindOneUser"); 
const ModelUser = require('./ModelUser');

module.exports.mongoCreateNewUser = async (data) => { 
  console.log(__filename, "start...", {data});

  try { 
    // check if valid data was provided
    if(!data || Object.keys(data).length === 0) {
      console.log(__filename, {error: "no data provided to create new user"});
      return Promise.reject({error: "no data provided to create new user"});
    }

    // check if username was provided
    if(!data.username) {
      console.log(__filename, {error: "No username defined, cant create new user"});
      return Promise.reject({error: "No username defined, cant create new user"});
    } 

    // check if User already exists
    const foundData = await mongoFindOneUser(data);
    console.log(__filename,"async result: ",{foundData});
      
    if(foundData) {
      console.log(__filename ,'User already exists:', foundData);  
      // return existing user
      return foundData;
    } 
    else {
      console.log(__filename ,'User doesnt currently exist:', foundData);  
    } 

    // create new user
    const newUser = new ModelUser({
      "username": data.username
    });

    console.log("Created new User:", newUser);
    console.log("Saving new user...");
    return newUser.save();
  
  }
  catch(e) {
    return Promise.reject(e);
  }
 
};