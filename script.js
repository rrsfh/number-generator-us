// Function to get URL parameter
function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Extract and store the participant ID and completion token from the URL
var participantID = getURLParameter('pid'); // Extract PID from URL
var completionToken = getURLParameter('completion_token');

// Variables to store the generated number and input number
var generatedNumber;
var inputNumber;

// Function to check if participantID is present
function checkParticipantID() {
  if (!participantID) {
    document.getElementById("error-message").style.display = "block";  // Show error message
    document.getElementById("generateButton").disabled = true;  // Disable the generate button
    return false;  // Stop further execution
  } else {
    document.getElementById("error-message").style.display = "none";  // Hide error message
    return true;  // Continue execution
  }
}

// Automatically populate the participantID field when the page loads
document.addEventListener("DOMContentLoaded", function() {
  if (checkParticipantID()) {
    document.getElementById("participantID").value = participantID;
  }
});

// Set-up the Number Generator Function
function generateNumber() {
  if (!checkParticipantID()) {
    return; // Prevent generating a number if participant ID is missing
  }

  var numberDisplay = document.getElementById("number-display");
  var generateButton = document.getElementById("generateButton");

  // Disable the generate button during animation
  generateButton.disabled = true;

  // After 4 seconds, display a random number and enable the generate button
  setTimeout(function() {
    var randomNumber = Math.floor(Math.random() * 6) + 1;
    numberDisplay.textContent = randomNumber;
    generateButton.disabled = false;

    // Show the input box after a delay
    var inputBox = document.getElementById("inputBox");
    inputBox.style.display = "block";

    // Store the generated number in the global variable
    generatedNumber = randomNumber;

    // Populate the generatedNumber field
    document.getElementById("generatedNumber").value = generatedNumber;

    // Hide the generate button after it's disabled
    generateButton.style.display = "none";

    // Disable the generate button permanently
    generateButton.onclick = null;
  }, 1000);
}

// Function to submit the participant's number
function submitNumber() {
  var numberInput = document.getElementById("numberInput").value;
  var successMessage = document.getElementById("successMessage");

  // Check if a number is entered
  if (numberInput.trim() === "") {
    alert("Please enter your number.");
    return;
  }

  // Hide the input box after submission
  var inputBox = document.getElementById("inputBox");
  inputBox.style.display = "none";

  // Store the input number in the global variable
  inputNumber = numberInput;

  // Populate the inputNumber field
  document.getElementById("inputNumber").value = inputNumber;

  // Show success message
  successMessage.style.display = "block";

  // Submit form to Google Sheets
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyiFTgybZQuGye9M_u2DO67Oj5gr6j0Rih8CinO6w7tnPzc4SH1jK9MHCwWCXfyRv7D/exec'
  const form = document.forms['submit-to-google-sheet']

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      console.log('Success!', response);

      // Delay showing the link button by 2 seconds
      setTimeout(function() {
        var linkButton = document.getElementById("linkButton");
        linkButton.style.display = "inline-block";

        // Hide success message when link button appears
        successMessage.style.display = "none";
      }, 2000); // 2000 milliseconds = 2 seconds
    })
    .catch(error => console.error('Error!', error.message));
}

// Function to redirect to a link with the completion token
function goToLink() {
  if (completionToken) {
    // Replace the URL with the actual URL containing the completion token
    var url = `https://research.sc/participant/login/resume/${completionToken}`;
    window.location.href = url;
  } else {
    alert('Completion token is missing!');
  }
}

// Function to show alerts for different tabs
function showAlert(tabName) {
  let message;
  switch (tabName) {
    case 'Home':
      message = "Welcome to the Number Generator. Please follow the instructions on screen to advance to the next part of our study.";
      break;
    case 'Instructions':
      message = "Instructions: Generate a number to use for your experiment. Make sure you remember the number as you will need it later.";
      break;
    case 'Contact':
      message = "If you are stuck on this page, please contact us via Prolific and we will provide assistance as quickly as possible.";
      break;
    default:
      message = "No information available.";
  }
  alert(message);
}
