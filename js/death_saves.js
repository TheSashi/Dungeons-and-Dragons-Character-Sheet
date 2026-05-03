// death_saves.js — Death Save Logic 
// Handles death saves - when a character drops to 0 HP
// In D&D, you make a death save at the start of your turn when at 0 HP
// 3 successes = stabilized (alive but unconscious i thinkkk)
// 3 failures = character dies

// Toggle Functions 

// Toggle a success pip on or off
// Clicking an already-filled pip clears it
function toggleDeathSuccess(index) {
  var s = window.state;
  var current = s.deathSaves.successes;
  
  if (index < current) {
    // Clicking a filled pip clears it and all after it
    s.deathSaves.successes = index;
  } else {
    // Clicking an empty pip fills it
    s.deathSaves.successes = index + 1;
  }
}

// Toggle a failure pip on or off
function toggleDeathFailure(index) {
  var s = window.state;
  var current = s.deathSaves.failures;
  
  if (index < current) {
    s.deathSaves.failures = index;
  } else {
    s.deathSaves.failures = index + 1;
  }
}

// Status Check 

// Get the current death status for display purposes
function getDeathStatus() {
  if (isDead()) {
    return 'dead';
  }
  if (isStabilized()) {
    return 'stable';
  }
  return '';
}

// Check if character has died (3 failed saves)
function isDead() {
  return window.state.deathSaves.failures >= 3;
}

// Check if character has stabilized (3 successful saves)
function isStabilized() {
  return window.state.deathSaves.successes >= 3;
}

// Reset death saves - called when character is healed
function resetDeathSaves() {
  var s = window.state;
  s.deathSaves.successes = 0;
  s.deathSaves.failures = 0;
}

window.toggleDeathSuccess = toggleDeathSuccess;
window.toggleDeathFailure = toggleDeathFailure;
window.getDeathStatus = getDeathStatus;
window.isDead = isDead;
window.isStabilized = isStabilized;
window.resetDeathSaves = resetDeathSaves;
