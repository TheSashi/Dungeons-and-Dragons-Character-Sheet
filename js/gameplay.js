// gameplay.js — Skills and Passive Perception
// Handles skill proficiency and passive ability calculations

// Skills 

// Get data for all skills, including their ability modifier and proficiency status
// Used to render the skill list in the Stats panel
function getSkillsData() {
  var s = window.state;
  var profBonus = calcProficiencyBonus(s.character.level);
  
  var skillsArray = [];
  
  // how it goes through each skill defined in RULES
  for (var skillName in RULES.SKILLS) {
    var stat = RULES.SKILLS[skillName];
    
    // Calculates total stat (base + race bonus)
    var total = getTotalStat(s.baseStats[stat], s.character.race, stat);
    
    // Checks if character is proficient in this skill
    var proficient = s.skills[skillName] || false;
    
    // Calculate the skill modifier
    var mod = calcSkillModifier(total, proficient, profBonus);
    
    skillsArray.push({
      skill: skillName,
      stat: stat,
      statName: RULES.STAT_NAMES[stat],
      mod: mod,
      proficient: proficient
    });
  }
  
  return skillsArray;
}

// Passive Perception 

// Calculate the Passive Wisdom (Perception) score
// Passive checks are used when no one is actively making a check
function getPassivePerception() {
  var s = window.state;
  
  // Get proficiency bonus for this level
  var profBonus = calcProficiencyBonus(s.character.level);
  
  // Get total Wisdom score (base + race)
  var wisTotal = getTotalStat(s.baseStats.WIS, s.character.race, 'WIS');
  
  // Check if character is proficient in Perception
  var perceptionProf = s.skills['Perception'] || false;
  
  // Calculate passive perception
  return calcPassivePerception(wisTotal, perceptionProf, profBonus);
}


window.getSkillsData = getSkillsData;
window.getPassivePerception = getPassivePerception;
