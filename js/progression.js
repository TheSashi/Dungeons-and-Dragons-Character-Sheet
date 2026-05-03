// progression.js — Level and XP System 
// Handles XP gain, level up logic, and HP recalculation when leveling

// How much XP is needed to reach the next level?
// Returns the XP threshold for the given level
function xpForNextLevel(level) {
  // Level 20 is max - no more XP thresholds
  if (level >= 20) {
    return RULES.XP_THRESHOLDS[19]; // Return max XP
  }
  return RULES.XP_THRESHOLDS[level];
}

// Calculate what fraction of progress has been made toward the next level
// Returns a number between 0 and 1
function xpProgress(xp, level) {
  if (level >= 20) {
    return 1; // Max level = 100% progress
  }
  
  var current = RULES.XP_THRESHOLDS[level - 1];
  var next = RULES.XP_THRESHOLDS[level];
  
  if (next === current) {
    return 1;
  }
  
  // Calculate percentage: (current XP - current threshold) / (next threshold - current threshold)
  var progress = (xp - current) / (next - current);
  return Math.min(1, progress);
}

// Level Up Logic

// Add XP to the character and handle level up if it occurs
// Returns true if the character leveled up
function addXP(amount) {
  var s = window.state;
  var oldLevel = s.character.level;
  
  // Add XP, stopped at max (355,000 for level 20)
  s.character.xp = clamp(s.character.xp + amount, 0, 355000);
  
  // Recalculate level based on new XP
  s.character.level = calcLevel(s.character.xp);
  
  // Did it level up?
  var leveled = s.character.level > oldLevel;
  
  // Recalculate HP if level changed
  recalcAfterLevelChange();
  
  return leveled;
}

// HP Recalculation 

// Called when level changes to recalculate max HP
// This happens when XP changes enough to level up
function recalcAfterLevelChange() {
  var s = window.state;
  
  // Get total Constitution score (base + race bonus)
  var conTotal = getTotalStat(s.baseStats.CON, s.character.race, 'CON');
  
  // Calculate what max HP should be with current class/level
  var calculatedMax = calcMaxHP(s.character.class, s.character.level, conTotal);
  
  // Only apply if we have a class selected and got a valid HP number
  if (s.character.class !== 'None' && calculatedMax > 0) {
    var oldMax = s.hp.max;
    
    s.hp.max = calculatedMax;
    
    // If HP was 0 (unconscious) or exactly at old max, update it
    // This handles leveling up from 0 HP appropriately
    if (s.hp.current === 0 || s.hp.current === oldMax) {
      s.hp.current = s.hp.max;
    }
    
    // Make sure current HP doesn't exceed new max
    s.hp.current = clamp(s.hp.current, 0, s.hp.max);
  }
}
 
window.xpForNextLevel = xpForNextLevel;
window.xpProgress = xpProgress;
window.addXP = addXP;
window.recalcAfterLevelChange = recalcAfterLevelChange;
