// Initialize game variables
let map, marker, targetLatLng, timer, timeLeft, score = 0;
let currentLandmarkIndex = 0;
const landmarks = [
  { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945, img: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg" },
  { name: "Great Wall of China", lat: 40.4319, lng: 116.5704, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/20090529_Great_Wall_8216.jpg/640px-20090529_Great_Wall_8216.jpg" },
  { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445, img: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg" }
];

// Initialize the map
function initMap() {
  map = L.map('map').setView([20, 0], 2); // Center on the world map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  map.on('click', (e) => {
    if (marker) map.removeLayer(marker);
    marker = L.marker(e.latlng).addTo(map);
  });
}

// Load the next landmark
function loadLandmark() {
  const landmark = landmarks[currentLandmarkIndex];
  document.getElementById('hint-text').textContent = `Where is the ${landmark.name}?`;
  document.getElementById('hint-image').src = landmark.img;
  targetLatLng = L.latLng(landmark.lat, landmark.lng);
}

// Start the game
function startGame() {
  resetGame();
  document.getElementById('start-game').disabled = true;
  document.getElementById('submit-guess').disabled = false;
  document.getElementById('reset-game').disabled = false;

  score = 0;
  timeLeft = 30;
  currentLandmarkIndex = 0;
  updateScore();
  startTimer();
  loadLandmark();
}

// Submit the guess
function submitGuess() {
  if (!marker) return alert("Please place a marker on the map!");

  const distance = map.distance(marker.getLatLng(), targetLatLng);
  const points = Math.max(0, 1000 - Math.floor(distance / 1000));
  score += points;
  updateScore();

  if (currentLandmarkIndex < landmarks.length - 1) {
    currentLandmarkIndex++;
    loadLandmark();
    if (marker) map.removeLayer(marker);
  } else {
    alert(`Game Over! Your final score is ${score}`);
    endGame();
  }
}

// Start the countdown timer
function startTimer() {
  document.getElementById('timer').textContent = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up!");
      endGame();
    }
  }, 1000);
}

// End the game
function endGame() {
  clearInterval(timer);
  document.getElementById('start-game').disabled = false;
  document.getElementById('submit-guess').disabled = true;
  document.getElementById('reset-game').disabled = true;
}

// Reset the game
function resetGame() {
  clearInterval(timer);
  if (marker) map.removeLayer(marker);
  score = 0;
  timeLeft = 30;
  currentLandmarkIndex = 0;
  updateScore();
  document.getElementById('timer').textContent = "Time: 30";
}

// Update the score display
function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

// Event listeners
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('submit-guess').addEventListener('click', submitGuess);
document.getElementById('reset-game').addEventListener('click', resetGame);

// Initialize the map on page load
window.onload = initMap;
