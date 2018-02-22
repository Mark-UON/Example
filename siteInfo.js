// Makes use of official chrome documentation - https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js

document.addEventListener('DOMContentLoaded', function () {

  // This code follows the Google Example Documentation: https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js
  var queryInfo = {
   active: true,
   currentWindow: true
  };

  // This code follows the Google Example Documentation: https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var url = tab.url;

    // Retrieve username from Chrome storage and display it
    chrome.storage.sync.get("username", function(info) {
        document.getElementById("sessionName").value = "" + info.username;
    });

    document.getElementById("siteInfoName").innerHTML = "" + url;
    document.getElementById("siteName").value = "" + url;
  });
});
