const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 

module.exports.sendTestGetRequest = (url) => {
  // Test GET request after 1 second 
  setTimeout(() => {
    console.log("Sending test GET request..."); 

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); 
    xhr.send();
    xhr.onload = function() {
      console.log("REPSONSE RECEIVED")  
      // console.log(JSON.parse(this.responseText));
    };

  }, 1000);
};

module.exports.sendTestPostCreateNewUserRequest = () => {
  // Test POST request after 1 second after load
  setTimeout(() => {
    console.log("Sending create new user test POST request...");

    let data = {username: "test user " + Math.random() * 1000};

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://FCC-Exercise-Tracker.eliasm307.repl.co/api/exercise/new-user", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
      console.log("REPSONSE RECEIVED")  
      // console.log(JSON.parse(this.responseText));
    };

  }, 1000);
};

module.exports.sendTestPostCreateNewUserExcerciseRequest = () => {
  // Test POST request after 1 second after load
  setTimeout(() => {
    console.log("Sending create new user excercise test POST request...");

    const data = {
      username: "test user " + Math.random() * 1000,
      userId: "5f9ee5f71ec3e800372477fb",
      description: "new exercise " + Math.random() * 1000,
      duration: parseInt(Math.random() * 1000)
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://FCC-Exercise-Tracker.eliasm307.repl.co/api/exercise/add", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
      console.log("REPSONSE RECEIVED")  
      // console.log(JSON.parse(this.responseText));
    };

  }, 1000);
}