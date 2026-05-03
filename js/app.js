// app.js — Initialization & Event Handling
// This is the main controller that ties everything together
// It handles all user interactions and coordinates between UI and everyhing else

// Initialization

// Called when the page loads - sets up the character sheet
document.addEventListener('DOMContentLoaded', function() {
  // Load saved character data or create new default
  window.loadState();

  // Make sure HP is correct based on class/level
  recalcAfterLevelChange();

  // Build the UI panels
  window.initUI();

  // Update header with character name if set
  window.updateHeader();

  // Set up all click and input handlers
  bindEvents();
});

// Event Binding

// Set up all the event listeners for user interactions
// This uses event delegation - instead of adding listeners to each button,
// we add one listener to the main container and check which element was clicked

function bindEvents() {
  // Tab Navigation
  // Handle clicking on tab buttons to switch between panels
  // Tab buttons have class "tab-btn" and data-tab attribute
  document.getElementById('tab-bar').addEventListener('click', function(e) {
    // Find the closest tab button (in case user clicked child element)
    var btn = e.target.closest('.tab-btn');
    if (btn) {
      // Switch to the tab stored in data tab attribute
      window.switchTab(btn.dataset.tab);
    }
  });

  var main = document.getElementById('main-content');

  // Button Click Actions
  // Most buttons in the UI have a "data-action" attribute
  // This listener handles all button clicks in one place
  main.addEventListener('click', function(e) {
    // Find the clicked element with data-action
    var el = e.target.closest('[data-action]');
    if (!el) return; // Exit if no action button clicked

    var action = el.dataset.action;
    var s = window.state;

    switch (action) {
      // Stat Buttons (Point Buy)
      // These handle increasing/decreasing ability scores during character creation
      case 'incStat': {
        var stat = el.dataset.stat;
        // Check if we can increase this stat (within point buy limits)
        if (canIncrement(s.baseStats, stat)) {
          s.baseStats[stat] = s.baseStats[stat] + 1;
          // Recalculate HP when stats change (CON modifier affects HP)
          recalcAfterLevelChange();
          window.saveState();
          window.updateAll();
        }
        break;
      }

      case 'decStat': {
        var stat = el.dataset.stat;
        // Can't go below 8
        if (canDecrement(s.baseStats, stat)) {
          s.baseStats[stat] = s.baseStats[stat] - 1;
          // Recalculate HP when stats change
          recalcAfterLevelChange();
          window.saveState();
          window.updateAll();
        }
        break;
      }

      // Combat: Damage & Healing
      // These handle taking damage or healing during combat
      case 'damage': {
        var amount = parseInt(document.getElementById('hp-amount').value) || 0;
        if (amount <= 0) return; // Don't allow negative or zero damage

        applyDamage(amount); // Apply damage to current HP
        window.saveState();
        window.updateCombat(); // Refresh combat panel display
        window.updateOverview(); // Update HP display in overview too
        window.showPopup('Took ' + amount + ' damage', 'error');
        break;
      }

      case 'heal': {
        var amount = parseInt(document.getElementById('hp-amount').value) || 0;
        if (amount <= 0) return; // Don't allow anything less than 0 or 0 to healing
        

        applyHeal(amount); // Add HP up to max
        window.saveState();
        window.updateCombat();
        window.updateOverview();
        window.showPopup('Healed ' + amount + ' HP', 'success');
        break;
      }

      // Death Saves (Pips)
      // When at 0 HP, player makes death saves - 3 success pips or 3 failure pips
      case 'deathSuccess': {
        var idx = parseInt(el.dataset.index);
        toggleDeathSuccess(idx); // Toggle a specific success pip
        window.saveState();
        window.updateCombat();
        if (isDead()) {
          window.showPopup('Character has died.', 'error');
        } else if (isStabilized()) {
          window.showPopup('Stabilized!', 'success');
        }
        break;
      }

      case 'deathFailure': {
        var idx = parseInt(el.dataset.index);
        toggleDeathFailure(idx); // Toggle a specific failure pip
        window.saveState();
        window.updateCombat();
        if (isDead()) {
          window.showPopup('Character has died.', 'error');
        }
        break;
      }

      // XP & Level
      // Add experience points - triggers level up when threshold reached
      case 'addXP': {
        var amount = parseInt(document.getElementById('xp-amount').value) || 0;
        if (amount <= 0) return;

        var leveled = addXP(amount); // Add XP and check if leveled up
        window.saveState();
        // Update multiple panels since level affects many things
        window.updateProgression();
        window.updateOverview();
        window.updateCombat();
        window.updateStats();

        if (leveled) {
          window.showPopup('Level up! Now level ' + s.character.level, 'success');
        } else {
          window.showPopup('+' + amount + ' XP', 'success');
        }
        break;
      }

      // Storage: -  Mode Toggle
      // Switch between saving character locally (campaign) or temporarily (session)
      case 'setMode': {
        var oldMode = s.sessionMode;
        var newMode = el.dataset.mode;
        if (oldMode === newMode) return; // No change needed

        // Clear the old storage when switching modes
        if (oldMode === 'campaign') {
          localStorage.removeItem('dnd_character');
        } else {
          sessionStorage.removeItem('dnd_character');
        }

        s.sessionMode = newMode;
        window.saveState();

        // Update the toggle buttons visually to show which is active
        document.querySelectorAll('.toggle-option').forEach(function(btn) {
          btn.classList.toggle('active', btn.dataset.mode === newMode);
        });

        // Update the description text to explain the mode
        var desc = document.getElementById('mode-desc');
        if (desc) {
          if (newMode === 'campaign') {
            desc.textContent = 'Character persists between sessions (localStorage).';
          } else {
            desc.textContent = 'Character cleared when tab closes (sessionStorage).';
          }
        }

        window.showPopup('Switched to ' + newMode + ' mode');
        break;
      }

      // Export Character
      // Download character as JSON file for backup/sharing
      case 'export': {
        window.exportJSON();
        window.showPopup('Character exported!', 'success');
        break;
      }

      // Attacks & Spellcasting
      // Add weapons, spells, and other attacks to the character sheet
      case 'addAttack': {
        var name = document.getElementById('atk-name').value.trim();
        if (!name) {
          window.showPopup('Enter attack name', 'error');
          break;
        }

        // Get all the attack details from the input fields
        s.attacks.push({
          name: name,
          bonus: document.getElementById('atk-bonus').value.trim(),
          damage: document.getElementById('atk-damage').value.trim(),
          type: document.getElementById('atk-type').value.trim()
        });

        window.saveState();
        window.updateCombat();

        // Clear the input fields after adding so user can add another
        document.getElementById('atk-name').value = '';
        document.getElementById('atk-bonus').value = '';
        document.getElementById('atk-damage').value = '';
        document.getElementById('atk-type').value = '';

        window.showPopup('Added ' + name, 'success');
        break;
      }

      case 'removeAttack': {
        var idx = parseInt(el.dataset.index);
        var removed = s.attacks.splice(idx, 1); // Remove attack at index
        window.saveState();
        window.updateCombat();
        window.showPopup('Removed ' + (removed[0] ? removed[0].name : 'attack'), 'error');
        break;
      }

      // Equipment
      // Add items to inventory with optional quantity
      case 'addEquipment': {
        var name = document.getElementById('equip-name').value.trim();
        if (!name) {
          window.showPopup('Enter item name', 'error');
          break;
        }

        var qty = parseInt(document.getElementById('equip-qty').value) || 1;
        s.equipment.push({
          name: name,
          qty: qty
        });

        window.saveState();
        window.updateCombat();

        // Reset input fields
        document.getElementById('equip-name').value = '';
        document.getElementById('equip-qty').value = '1';

        window.showPopup('Added ' + name, 'success');
        break;
      }

      case 'removeEquipment': {
        var idx = parseInt(el.dataset.index);
        var removed = s.equipment.splice(idx, 1);
        window.saveState();
        window.updateCombat();
        window.showPopup('Removed ' + (removed[0] ? removed[0].name : 'item'), 'error');
        break;
      }

      // Reset Character
      // Wipe all character data and start fresh
      case 'reset': {
        if (confirm('Reset character? This cannot be undone.')) {
          window.resetState();
          recalcAfterLevelChange();
          window.initUI();
          window.updateHeader();
          window.showPopup('Character reset', 'error');
        }
        break;
      }
    }
  });

  // Select/Change Events
  // Handle dropdown selects and checkbox changes
  main.addEventListener('change', function(e) {
    var el = e.target;
    var s = window.state;

    // Race selection - triggers HP recalculation
    // Different races may have different HP bonuses (though most don't)
    if (el.dataset.field === 'race') {
      s.character.race = el.value;
      recalcAfterLevelChange();
      window.saveState();
      window.updateAll();
      window.showPopup('Race: ' + el.value);
    }
    // Class selection - triggers HP recalculation
    // This is the main factor in HP calculation - different classes have different hit dice
    else if (el.dataset.field === 'class') {
      s.character.class = el.value;
      recalcAfterLevelChange();
      window.saveState();
      window.updateAll();
      window.showPopup('Class: ' + el.value);
    }
    
    // Skill proficiency toggles
    // Pthey select herE
    else if (el.dataset.action === 'toggleSkill') {
      s.skills[el.dataset.skill] = el.checked;
      window.saveState();
      window.updateStats(); // Update modifiers based on proficiency
      window.updateOverview(); // Update skills display
    }
    // File import
    // Load character from a previously exported JSON file
    else if (el.id === 'import-file' && el.files.length > 0) {
      window.importJSON(el.files[0]).then(function() {
        recalcAfterLevelChange();
        window.initUI();
        window.showPopup('Character imported!', 'success');
      }).catch(function(err) {
        window.showPopup(err.message, 'error');
      });
    }
  });

  // Text/Number Input Events
  var DIRECT_FIELDS = [
    'notes', 'proficiencies', 'languages', 'dciNumber', 'faction',
    'personalityTraits', 'ideals', 'bonds', 'flaws', 'featuresTraits'
  ];

  main.addEventListener('input', function(e) {
    var el = e.target;
    var s = window.state;

    // Character name - how it updates the title/heading of the page
    // Name is special - we update the header bar as user types
    if (el.dataset.field === 'name') {
      s.character.name = el.value;
      window.updateHeader();
      window.saveState();
    }
    // These are stored in state but don't need immediate UI updates
    else if (el.dataset.field && DIRECT_FIELDS.indexOf(el.dataset.field) !== -1) {
      s[el.dataset.field] = el.value;
      window.saveState();
    }
    // Armor Class input
    // AC is a combat stat - clamp between 1 and 30
    else if (el.id === 'ac-input') {
      s.ac = clamp(parseInt(el.value) || 10, 1, 30);
      var display = document.getElementById('combat-ac');
      if (display) display.textContent = s.ac;
      window.saveState();
    }
    // Speed input
    // Movement speed in feet - clamp reasonable range
    else if (el.id === 'speed-input') {
      s.speed = clamp(parseInt(el.value) || 30, 0, 120);
      var display = document.getElementById('combat-speed');
      if (display) display.textContent = s.speed;
      window.saveState();
    }
    // Temporary HP input
    // Temp HP from effects like False Life spell
    else if (el.id === 'temp-hp') {
      s.hp.temp = clamp(parseInt(el.value) || 0, 0, 999);
      window.saveState();
    }
  });
}