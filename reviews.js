// Makes use of official chrome documentation - https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js

// Adds an event listener to the document that calls the script.
// Once the document is loaded, the code is run.
document.addEventListener('DOMContentLoaded', function () {

        // Below code from: https://developers.google.com/custom-search/docs/tutorial/implementingsearchbox
        // Used for accessing Google's Custom Search Engine for the related websites section.
        (function() {
          var cx = '017278011511779319034:nkm5j_-ge3g';
          var gcse = document.createElement('script');
          gcse.type = 'text/javascript';
          gcse.async = true;
          gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(gcse, s);
        })();
        // Above code from: https://developers.google.com/custom-search/docs/tutorial/implementingsearchbox

        // Function call to get the name of the site to display
        getSiteName();

/*        // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
        // An XMLHttpRequest object is created for communication with the database.
        relatedRequest = new XMLHttpRequest();

        // Definition of the function that handles the response from the database.
        relatedRequest.onreadystatechange = function() {
          // Waits for two conditions to be met, letting the extension know that communication was successful.
          if (this.readyState === 4) {
            if (this.status === 200) {

              // https://developers.google.com/custom-search/json-api/v1/using_rest#response_data

              // The response from the database is parsed into JSON format then stored as an array
              var myArr = JSON.parse(this.responseText);

              // Variables used for parsing information into HTML elements.
              var output = "";
              var x;

              // https://www.w3schools.com/js/js_json_http.asp used as reference for parsing JSON data intp HTML elements.
              for(x = 0; x < 3; x++) {
                  output += '<a href="' + myArr.items[x].link + '">' + myArr.items[x].title + '</a><p></p>';
              }

              // Set HTML element as related links
              document.getElementById("relatedLinks").innerHTML = output;
            }
          }
        }
        // Send a GET request to the URL (specific key obtained from Google Custom Search Engine API)
        relatedRequest.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyC-fu0tCtu-4TCcuCIhgw1TQQHr1gOBsmY&cx=017278011511779319034:nkm5j_-ge3g&q=google", true);
        relatedRequest.send(null);
                */


        // HTML element creation for buttons next to reviews
        var upvote = document.createElement("BUTTON");
        var downvote = document.createElement("BUTTON");
        var upText = document.createTextNode("+");
        var downText = document.createTextNode("-");

        // Add the + and - to the button
        upvote.appendChild(upText);
        downvote.appendChild(downText);

        // Retrieve username from Chrome storage and display it
        chrome.storage.sync.get("username", function(info) {
            document.getElementById("username").innerHTML = info.username;
        });

        // Retrieves the logout button from the HTML element then adds an event listener to it
        // so the user can press it to log out
        var logoutButton = document.getElementById("logoutButton");
        logoutButton.addEventListener("click", function () {
          chrome.storage.sync.set({'username': "undefined"}, function() {
            // If the user presses the logout button they are directed to the login.html page
            window.location.href = "login.html";
          });
      });
});

// The getRating function communicates with the database via XMLHttpRequest
// in order to retrieve the average user rating of the site
function getRating(url) {

  // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
  // An XMLHttpRequest object is created for communication with the database.
  ratingRequest = new XMLHttpRequest();

  // Definition of the function that handles the response from the database.
  ratingRequest.onreadystatechange = function() {
    // Waits for two conditions to be met, letting the extension know that communication was successful.
    if (ratingRequest.readyState === 4) {
      if (ratingRequest.status === 200) {

          // Splits the response text into an array
          var splitText = ratingRequest.responseText.split("@");

          // Splits the response text further
          var numbers = splitText[0].split("/");

          // Sets an HTML to display to rating
          setRating(numbers[0] / numbers[1]);
        }
      }
    }
    // URL to be sent to php script
    var extras = "?url=" + url;
    // Sends the request to a php file on the database side
  ratingRequest.open("GET", "http://127.0.0.1/db1/getRating.php" + extras, true);
  ratingRequest.send(null);
}

// Sets an HTML element to display the numeric score
function setRating(rating) {
  document.getElementById("starRating").innerHTML = "" + rating.toFixed(1) + " / 5";
}

// Handles the main response for the request for the reviews.
function handleResponse (responseText) {

  // Stores text in a variable
  var text = responseText;

  // Splits the text into an array
  var splitText = text.split("@");

  // Loops through the array and creates elements to display all the aspects of the review.
  for (var x = 0; x < splitText.length - 1; x++) {

    // https://www.w3schools.com/jsref/met_document_createelement.asp
    var upvote = document.createElement("BUTTON");
    var downvote = document.createElement("BUTTON");
    var upText = document.createTextNode("+");
    var downText = document.createTextNode("-");

    // http://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
    upvote.appendChild(upText);
    downvote.appendChild(downText);

    var review = document.createElement("P");
    review.appendChild(upvote);
    review.appendChild(downvote);
    var splitText1 = splitText[x].split("/");

    var reviewText = document.createTextNode(splitText1[0] + " - ");
    var voteCount = document.createTextNode(splitText1[1] + " - ");
    var relatedLinks = document.createTextNode(splitText1[3]+ " - ");
    var metric = document.createTextNode(splitText1[4]);
    review.appendChild(voteCount);
    review.appendChild(reviewText);
    review.appendChild(relatedLinks);
    review.appendChild(metric);
    document.body.appendChild(review);

    // Adds event listeners to the upvote and downvote buttons
    upvote.addEventListener("click", upvoteFuncDelegate(x, splitText1[1], splitText1[2]), false);
    downvote.addEventListener("click", downvoteFuncDelegate(x, splitText1[1], splitText1[2]), false);

  }
};

// References: // http://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
function upvoteFuncDelegate (index, voteCount, id) {
  return function() {
    upvoteFunc(index, voteCount, id);
  }
}

// References: // http://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
function downvoteFuncDelegate (index, voteCount, id) {
    return function() {
      downvoteFunc(index, voteCount, id);
    }
}

function upvoteFunc (index, voteCount, id) {
  console.log("Worked: " + index + " " + voteCount + " " + id);

  // Increment vote count
  voteCount++;

  // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
  // Send off XMLHttpRequest to increment the vote count for the review
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        }
      }
    }

    var extras = "?index=" + index + " &voteCount=" + voteCount + " &id=" + id;
  httpRequest.open("GET", "http://127.0.0.1/db1/vote.php" + extras, true);
  httpRequest.send(null);

}

function downvoteFunc (index, voteCount, id) {
    console.log("Worked: " + index + " " + voteCount + " " + id);

    // Decrement vote count
    voteCount--;

    // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
    // Send off XMLHttpRequest to decrement the vote count for the review
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          }
        }
      }

      var extras = "?index=" + index + " &voteCount=" + voteCount + " &id=" + id;
    httpRequest.open("GET", "http://127.0.0.1/db1/vote.php" + extras, true);
    httpRequest.send(null);

}

function getSiteName () {

    // This code follows the Google Example Documentation: https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js
    var queryInfo = {
     active: true,
     currentWindow: true
    };

    // This code follows the Google Example Documentation: https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js
    chrome.tabs.query(queryInfo, function(tabs) {
      var tab = tabs[0];

      var url = tab.url;

      // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
      // An XMLHttpRequest object is created for communication with the database.
      httpRequest = new XMLHttpRequest();

      // Definition of the function that handles the response from the database.
      httpRequest.onreadystatechange = function() {
        // Waits for two conditions to be met, letting the extension know that communication was successful.
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            // Sends the response off (containing the reviews) to be handled by the function.
            handleResponse(httpRequest.responseText);
          }
        }
      }
      var extras = "?site=" + url;

      httpRequest.open("GET", "http://127.0.0.1/db1/getReviews.php" + extras, true);
      httpRequest.send(null);


      document.getElementById("siteInfoName").innerHTML = "" + url;

      // Function call that obtains the average user rating from the database
      // and displays it to the user.
      getRating(url);
    });
}
