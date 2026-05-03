// combat.js — Combat Stats: HP, AC, Initiative, Speed 
// Handles HP calculations, damage/healing, and combat related values

// HP Calcs

// Calculate maximum HP based on class, level, and Constitution
// Level 1: takes full hit die + con modifier
// Level 2+: takes average of hit die (rounded up) + Constitution modifier per level
// Example: Fighter (d10) at level 3 with +2 CON = 10 + 1 + (6+2) + (6+2) = 27
function calcMaxHP(className, level, conScore) {
  var hitDie = RULES.CLASSES[className].hitDie || 0;
  
  // No HP for level 0 or classes without hit dice
  if (hitDie === 0 || level === 0) {
    return 0;
  }
  
  var conMod = calcModifier(conScore);
  
  // Average roll = half of die (rounded up) + 1
  // e.g., d10 = 5+1 = 6, d8 = 4+1 = 5
  var avgRoll = Math.ceil(hitDie / 2) + 1;
  
  // First level: full hit die + CON
  var hp = hitDie + conMod;
  
  // Additional levels: average roll + CON
  for (var i = 2; i <= level; i++) {
    hp = hp + avgRoll + conMod;
  }
  
  // Always return at least 1 HP
  return Math.max(1, hp);
}

// Damage and Healing logic

// Apply damage to the character
// Damage is absorbed by temporary HP first, then reduces current HP
function applyDamage(amount) {
  var s = window.state;
  
  if (amount <= 0) {
    return;
  }
  
  // First, damage temp HP if it exists
  if (s.hp.temp > 0) {
    var absorbed = Math.min(s.hp.temp, amount);
    s.hp.temp = s.hp.temp - absorbed;
    amount = amount - absorbed;
  }
  
  // Then reduce actual HP, clamped between 0 and max
  if (amount > 0) {
    s.hp.current = clamp(s.hp.current - amount, 0, s.hp.max);
  }
}

// Heal the character by a certain amount
// If healing from 0 HP, also reset death saves
function applyHeal(amount) {
  var s = window.state;
  
  if (amount <= 0) {
    return;
  }
  
  s.hp.current = clamp(s.hp.current + amount, 0, s.hp.max);
  
  // If character is now alive (was at 0), clear death saves
  if (s.hp.current > 0) {
    s.deathSaves.successes = 0;
    s.deathSaves.failures = 0;
  }
}

window.calcMaxHP = calcMaxHP;
window.applyDamage = applyDamage;
window.applyHeal = applyHeal;
