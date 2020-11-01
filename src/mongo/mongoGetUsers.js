const ModelUser = require('./ModelUser');

module.exports.mongoGetUsers = async () => { 
  console.log(__filename, "running query to find users...")
  return ModelUser.find({}, { username: 1 } ).exec();

}