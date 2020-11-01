const ModelUser = require('./ModelUser');

module.exports.mongoGetFilteredUserLogs = async (filterParams) => {
  console.log(__filename, "start...", {filterParams});

  let foundUser;
  
  // check if valid data was provided
  if(!filterParams || Object.keys(filterParams).length === 0) {
    console.log(__filename, "Error: no filterParams provided to find a user");
    return Promise.reject({error: "no filterParams provided to find a user", source: __filename});
  } 

  // find user 
  try {
    console.log(__filename, "running query to find user...", {filterParams})
    foundUser = await ModelUser.findById(filterParams.userId).exec();
    console.log(__filename, "found user", {foundUser});

    if(!foundUser) return Promise.reject("No user found for id: " + filterParams.userId);
  }
  catch(err) {
    console.log(__filename, "Error finding user", {filterParams, err});
  }

  //filter logs
  let filteredUserLog = foundUser.log.filter(log => {

    // if log date is before from date then remove it
    if(filterParams.fromUnix && log.dateUnix < filterParams.fromUnix) return false;

    // if log date is after to date then remove it
    if(filterParams.toUnix && log.dateUnix > filterParams.toUnix) return false;

    // keep log if it doesnt meet the conditions above
    return true;
 
  });

  console.log(__filename, {originalUserLog: foundUser.log, filteredUserLog: filteredUserLog});
 
  if(filterParams.limit) {
    console.log(__filename, "filterParams.limit:", filterParams.limit)
    if(isNaN(filterParams.limit) || filterParams.limit < 1) {
      console.log(__filename, "limit is not a number or below 1:", filterParams.limit);

    }
    else if(filteredUserLog.length > filterParams.limit) {
      console.log(__filename, "limiting filtered array to", filterParams.limit);
      filteredUserLog = filteredUserLog.slice(0, filterParams.limit);

    }
    else {
      console.log(__filename, "filtered array is below limit, no limiting applied")
    }
  
  }
 
  console.log(__filename, "setting filtered log");
  foundUser.log = filteredUserLog;

  // return
  console.log(__filename, "returning user with filtered log", {foundUser});
  return foundUser;
 
}