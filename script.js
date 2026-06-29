// Attendance tracking variables
let totalAttendees = 0;
let teamAttendance = {
  water: 0,
  zero: 0,
  power: 0,
};
let goalReached = false;
let attendeeList = [];

// Attendance goal
const ATTENDANCE_GOAL = 50;

// Get DOM elements
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingElement = document.getElementById("greeting");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");
const attendeeListContainer = document.getElementById("attendeeList");

// Greeting messages
const greetings = [
  "Welcome to the Team Sustainability Summit!",
  "Great to see you here!",
  "Thanks for checking in!",
  "Excited to have you join us!",
  "Welcome aboard!",
  "Thanks for your commitment to sustainability!",
  "Glad you made it!",
];

// Function to get a random greeting
function getRandomGreeting() {
  let randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

// Function to get team name
function getTeamName(teamValue) {
  let teamNames = {
    water: "Team Water Wise",
    zero: "Team Net Zero",
    power: "Team Renewables",
  };
  return teamNames[teamValue];
}

// Function to get winning team
function getWinningTeam() {
  let winningTeam = "water";
  let maxAttendees = teamAttendance.water;

  if (teamAttendance.zero > maxAttendees) {
    winningTeam = "zero";
    maxAttendees = teamAttendance.zero;
  }

  if (teamAttendance.power > maxAttendees) {
    winningTeam = "power";
    maxAttendees = teamAttendance.power;
  }

  return winningTeam;
}

// Function to display celebration message
function displayCelebration(teamValue) {
  let teamName = getTeamName(teamValue);
  let celebrationMessage = `🎉 We've reached 50 attendees! 🎉 Congratulations to ${teamName}! 🌟`;

  greetingElement.textContent = celebrationMessage;
  greetingElement.style.display = "block";
  greetingElement.style.backgroundColor = "#FFD700";
  greetingElement.style.color = "#333";
  greetingElement.style.padding = "20px";
  greetingElement.style.fontSize = "18px";
  greetingElement.style.fontWeight = "bold";
  greetingElement.style.borderRadius = "8px";
  greetingElement.style.marginBottom = "20px";
}

// Function to display attendee list
function displayAttendeeList() {
  if (attendeeList.length === 0) {
    attendeeListContainer.innerHTML =
      '<p class="no-attendees">No attendees yet</p>';
    return;
  }

  let listHTML = "";

  for (let i = 0; i < attendeeList.length; i++) {
    let attendee = attendeeList[i];
    let teamName = getTeamName(attendee.team);
    listHTML =
      listHTML +
      `<div class="attendee-item ${attendee.team}">
      <span class="attendee-name">${attendee.name}</span>
      <span class="attendee-team">${teamName}</span>
    </div>`;
  }

  attendeeListContainer.innerHTML = listHTML;
}

// Function to add attendee to list
function addAttendee(name, team) {
  let newAttendee = {
    name: name,
    team: team,
  };
  attendeeList.push(newAttendee);
  displayAttendeeList();
}

// Function to display greeting with attendee name
function displayGreeting(attendeeName, teamName) {
  let randomGreeting = getRandomGreeting();
  let message = `${randomGreeting} Hello ${attendeeName}, welcome to ${teamName}!`;
  greetingElement.textContent = message;
  greetingElement.style.display = "block";

  // Clear greeting after 4 seconds
  setTimeout(function () {
    greetingElement.style.display = "none";
  }, 4000);
}

// Function to update total attendee count
function updateAttendeeCount() {
  attendeeCountDisplay.textContent = totalAttendees;
}

// Function to update team counts
function updateTeamCounts() {
  waterCountDisplay.textContent = teamAttendance.water;
  zeroCountDisplay.textContent = teamAttendance.zero;
  powerCountDisplay.textContent = teamAttendance.power;
}

// Function to update progress bar
function updateProgressBar() {
  let percentage = (totalAttendees / ATTENDANCE_GOAL) * 100;

  // Cap percentage at 100%
  if (percentage > 100) {
    percentage = 100;
  }

  progressBar.style.width = percentage + "%";
}

// Function to save attendance data to local storage
function saveAttendanceData() {
  let attendanceData = {
    totalAttendees: totalAttendees,
    teamAttendance: teamAttendance,
    goalReached: goalReached,
    attendeeList: attendeeList,
  };

  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}

// Function to load attendance data from local storage
function loadAttendanceData() {
  let savedData = localStorage.getItem("attendanceData");

  if (savedData) {
    let attendanceData = JSON.parse(savedData);
    totalAttendees = attendanceData.totalAttendees;
    teamAttendance = attendanceData.teamAttendance;
    goalReached = attendanceData.goalReached;
    attendeeList = attendanceData.attendeeList || [];

    // Update all displays with loaded data
    updateAttendeeCount();
    updateTeamCounts();
    updateProgressBar();
    displayAttendeeList();

    // If goal was reached, display celebration again
    if (goalReached) {
      let winningTeam = getWinningTeam();
      displayCelebration(winningTeam);
    }
  }
}

// Function to handle form submission
function handleCheckIn(event) {
  event.preventDefault();

  let attendeeName = attendeeNameInput.value.trim();
  let selectedTeam = teamSelect.value;

  // Validate inputs
  if (!attendeeName || !selectedTeam) {
    alert("Please fill in all fields");
    return;
  }

  // Update total attendees
  totalAttendees = totalAttendees + 1;

  // Update team attendance
  teamAttendance[selectedTeam] = teamAttendance[selectedTeam] + 1;

  // Get team name
  let teamName = getTeamName(selectedTeam);

  // Add attendee to list
  addAttendee(attendeeName, selectedTeam);

  // Display personalized greeting
  displayGreeting(attendeeName, teamName);

  // Update all displays
  updateAttendeeCount();
  updateTeamCounts();
  updateProgressBar();

  // Check if goal is reached
  if (totalAttendees === ATTENDANCE_GOAL && !goalReached) {
    goalReached = true;
    let winningTeam = getWinningTeam();
    displayCelebration(winningTeam);
  }

  // Save attendance data to local storage
  saveAttendanceData();

  // Reset form
  checkInForm.reset();
  attendeeNameInput.focus();
}

// Add event listener to form
checkInForm.addEventListener("submit", handleCheckIn);

// Load saved attendance data when page loads
loadAttendanceData();
