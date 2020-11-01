const ModelUser = require('./ModelUser');

module.exports.mongoFindOneUser = async (searchParams) => {
  console.log(__filename, "start...", {searchParams});
  
  // check if valid data was provided
  if(!searchParams || Object.keys(searchParams).length === 0) {
    console.log(__filename, "Error: no searchParams provided to find a user");
    return Promise.reject({error: "no searchParams provided to find a user", source: __filename});
  } 

  console.log(__filename, "running query to find user...")
  return ModelUser.findOne(searchParams).exec();

}