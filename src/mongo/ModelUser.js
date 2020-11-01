var mongoose = require('mongoose'); 
var { Schema } = mongoose;

console.log("User Model Create...");

const userSchema = new Schema({
  "username": {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  "count": {
    type: Number,
    required: true,
    default: 0,
    min: 0, 
  },
  "log": [
    {
      description: String,
      date: String,
      dateUnix: Number,
      duration: Number
    }
  ]
});

// add URL object schema to model 
module.exports = mongoose.model("User", userSchema);
 