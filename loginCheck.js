// Makes use of official chrome documentation - https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js

// Adds an event listener to the document that calls the script.
// Once the document is loaded, the code is run.
document.addEventListener('DOMContentLoaded', function () {

  var submitButton = document.getElementById("button");
  var signUpButton = document.getElementById("button2");

  // Check if user is already logged in
  // If they are go to main tab
  chrome.storage.sync.get("username", function(info) {
      if (info.username !== "undefined") {
        window.location.href = "siteInfo.html";
      }
  });

  // Add event listener to submit button of log in page
  submitButton.addEventListener("click", function () {

    // Get the user entered details
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
    // Use XMLHttpRequest to check if details match those in the database
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {

          // If the details match then proceed else display error message.
          if (httpRequest.responseText === 'Password Match!')
          {
            document.getElementById("status").innerHTML = "Logging In";

            chrome.storage.sync.set({'username': username}, function() {
              loggedIn();
            });
          } else {
            document.getElementById("status").innerHTML = "Incorrect Details";
          }
        }
      }
    }
    var extras = "?username=" + username + " &password=" + password;
    httpRequest.open("GET", "http://127.0.0.1/db1/loginCheck.php" + extras, true);
    httpRequest.send(null);

  });

  // Add event listener to sign up button
  signUpButton.addEventListener("click", function () {

    // Get user details
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
    // Store details in the database to create an account
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            document.getElementById("test").innerHTML = httpRequest.responseText;
        }
      }
    }
    var extras = "?username=" + username + " &password=" + password;
    httpRequest.open("GET", "http://127.0.0.1/db1/signUpCheck.php" + extras, true);
    httpRequest.send(null);

  });
});

// Go to main tab if logged in
function loggedIn() {
  window.location.href = "siteInfo.html";
}
