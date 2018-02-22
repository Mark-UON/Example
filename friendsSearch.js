// Adds an event listener to the document that calls the script.
// Once the document is loaded, the code is run.
document.addEventListener('DOMContentLoaded', function () {

  // Adds an event listener to the search button in the 'Friends' tab
  searchButton.addEventListener("click", function () {

    // Gets current username
    var username = document.getElementById("usernameSearch").value;

    // https://www.w3schools.com/xml/xml_http.asp was used as reference when coding XMLHttpRequest below.
    // Send off XMLHttpRequest to retrive reviews left by specific user
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          // Split the response text into array
          var array = httpRequest.responseText.split("%");

          // Loop through the array and display the reviews
          for (var x = 0; x < array.length; x++) {
            document.getElementById("searchedReviews").innerHTML += array[x];
          }
        }
      }
    }

    // Extras sent the the php script
    var extras = "?username=" + username;

    httpRequest.open("GET", "http://127.0.0.1/db1/userSearch.php" + extras, true);
    httpRequest.send(null);

  });
});
