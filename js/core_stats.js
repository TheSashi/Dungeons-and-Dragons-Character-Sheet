// core_stats.js — ability Scores, Modifiers, and some Calculations 
// This file contains the math functions used throughout the character sheet.

// Ability Score Functions

// Calculate ability modifier from a score
// In D&D, an ability score of 10 gives a +0 modifier.
// Every 2 points above 10 adds +1, every 2 below 10 subtracts 1.
// Example: 8 = -1, 10 = 0, 12 = +1, 14 = +2
function calcModifier(score) {
  return Math.floor((score - 10) / 2);
}

// Format a modifier for display with a + sign for positive numbers
// Example: 2 becomes "+2", -1 stays "-1"
function formatModifier(mod) {
  if (mod >= 0) {
    return '+' + mod;
  } else {
    return '' + mod;
  }
}

// Calculate what level a character is based on their XP
// Looks through the XP thresholds from highest to lowest
function calcLevel(xp) {
  var i = 0;
  for (i = RULES.XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= RULES.XP_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Get proficiency bonus based on character level
// Level 1-4 = +2, 5-8 = +3, 9-12 = +4, 13-16 = +5, 17-20 = +6
function calcProficiencyBonus(level) {
  // restrict level between 1 and 20, then subtract 1 for array index
  var clampedLevel = Math.max(0, Math.min(level - 1, 19));
  return RULES.PROFICIENCY_BONUS[clampedLevel];
}

// Skill and Save Calculations 

// Calculate skill modifier
// Takes the ability score modifier + proficiency bonus if the character is proficient
function calcSkillModifier(statScore, proficient, profBonus) {
  var mod = calcModifier(statScore);
  if (proficient) {
    mod = mod + profBonus;
  }
  return mod;
}

// Calculate passive Perception score
// Formula: 10 + Wisdom modifier + Proficiency bonus (if proficient)
function calcPassivePerception(wisScore, perceptionProf, profBonus) {
  return 10 + calcSkillModifier(wisScore, perceptionProf, profBonus);
}

// Calculate initiative - it's just your Dexterity modifier (this was confusing i hope this is how it works)
function calcInitiative(dexScore) {
  return calcModifier(dexScore);
}

// Utility Functions 

// restrict  a number between min and max values
// Used to keep values in valid ranges (like HP not going below 0)
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

window.calcModifier = calcModifier;
window.formatModifier = formatModifier;
window.calcLevel = calcLevel;
window.calcProficiencyBonus = calcProficiencyBonus;
window.calcSkillModifier = calcSkillModifier;
window.calcPassivePerception = calcPassivePerception;
window.calcInitiative = calcInitiative;
window.clamp = clamp;
