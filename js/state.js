// state.js — Character Data Persistence 
// I will make this handle saving/loading character data to browser storage
// Two modes: campaign iuses localStorage, oneshot - uses sessionStorage

// Key used for storing data in browser storage
var STORAGE_KEY = 'dnd_character';

// Save and Load

// Save current character state to storage
function saveState() {
  var s = window.state;
  
  // this is how its gonna update the last modified timestamp
  s.lastModified = new Date().toISOString();
  
  // how it choosews storage type based on session mode
  var storage;
  if (s.sessionMode === 'campaign') {
    storage = localStorage;
  } else {
    storage = sessionStorage;
  }
  
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.error('Save failed:', e);
  }
}

// Load character from storage
// Returns the loaded state or creates a fresh one if no save exists
function loadState() {
  // its gonna try localStorage first, then sessionStorage
  var data = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
  
  if (data) {
    try {
      var parsed = JSON.parse(data);
      window.state = mergeState(parsed);
    } catch (e) {
      console.error('Load failed:', e);
      window.state = createDefaultState();
    }
  } else {

    // No saved data - create new character
    window.state = createDefaultState();
  }
  
  return window.state;
}

// Merge saved data with default values
// This comfirms/merge new fields added in updates don't cause errors
function mergeState(parsed) {
  var def = createDefaultState();
  
  return {
    // Spread default then override with saved values
    ...def,
    ...parsed,
    
    // These need special handling because they're objects
    character: { ...def.character, ...(parsed.character || {}) },
    baseStats: { ...def.baseStats, ...(parsed.baseStats || {}) },
    hp: { ...def.hp, ...(parsed.hp || {}) },
    hitDice: { ...(def.hitDice || {}), ...(parsed.hitDice || {}) },
    deathSaves: { ...def.deathSaves, ...(parsed.deathSaves || {}) },
    skills: { ...def.skills, ...(parsed.skills || {}) },
    savingThrows: { ...(def.savingThrows || {}), ...(parsed.savingThrows || {}) },
    
    // Arrays need to be validated (in case of corrupted save)
    attacks: Array.isArray(parsed.attacks) ? parsed.attacks : def.attacks,
    equipment: Array.isArray(parsed.equipment) ? parsed.equipment : def.equipment
  };
}

// Import and Export 

// Reset character - delete saved data and start fresh
function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  window.state = createDefaultState();
  return window.state;
}

// Export character to a JSON file
function exportJSON() {
  var s = window.state;
  
  var blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  
  var a = document.createElement('a');
  a.href = url;
  a.download = 'character_' + (s.character.name || 'sheet') + '_' + Date.now() + '.json';
  
  a.click();
  URL.revokeObjectURL(url);
}

// Import character from a JSON file
function importJSON(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        window.state = mergeState(data);
        saveState();
        resolve(window.state);
      } catch (err) {
        reject(new Error('Invalid character file'));
      }
    };
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}


window.saveState = saveState;
window.loadState = loadState;
window.resetState = resetState;
window.exportJSON = exportJSON;
window.importJSON = importJSON;
