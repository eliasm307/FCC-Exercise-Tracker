var mongoose = require('mongoose'); 
var { Schema } = mongoose;

console.log("Excercise Model Create...");

const excerciseSchema = new Schema({
  "username": {
    type: String,
    required: true,
    index: true, 
  },
  "duration": {
    type: Number,
    required: true,
    min: 0,
  },
  "description": {
    type: String,
    required: true, 
  },
  "date": {
    type: String,
    required: true, 
  }, 
});

// add URL object schema to model 
module.exports = mongoose.model("Excercise", excerciseSchema);
 