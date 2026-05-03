// character_creation.js — Point Buy System and Race Calculations 
// These functions handle the character creation bit
// - Point buy budget calculation
// - Race stat bonuses
// - Validating stat increases/decreases

// Calculate how many points are remaining in the point buy pool
// Goes through each ability score and calculates how many points are spent
function calcRemainingPoints(baseStats) {
  var total = 0;
  
  for (var score = 8; score <= 15; score++) {
    var count = 0;
    // Count how many stats are at this score level
    for (var stat in baseStats) {
      if (baseStats[stat] === score) {
        count++;
      }
    }
    // Add up the cost for all stats at this level
    total = total + (count * RULES.POINT_COSTS[score]);
  }
  
  return RULES.POINT_BUY_BUDGET - total;
}

// Race Bonus Functions

// Get the bonus a race provides to a specific ability score
// Returns 0 if race doesn't exist or doesn't provide bonus to that stat
function getRaceBonus(race, statKey) {
  if (RULES.RACES[race]) {
    return RULES.RACES[race][statKey] || 0;
  }
  return 0;
}

// Calculate total ability score (base + race bonus)
function getTotalStat(baseStat, race, statKey) {
  var bonus = getRaceBonus(race, statKey);
  return baseStat + bonus;
}

// Validation


function canIncrement(baseStats, statKey) {
  // Can't go above 15
  if (baseStats[statKey] >= RULES.STAT_MAX) {
    return false;
  }
  
  // Check if we have enough points to buy the next increase
  var currentScore = baseStats[statKey];
  var currentCost = RULES.POINT_COSTS[currentScore];
  var nextCost = RULES.POINT_COSTS[currentScore + 1];
  var costDiff = nextCost - currentCost;
  
  return calcRemainingPoints(baseStats) >= costDiff;
}

function canDecrement(baseStats, statKey) {
  // Can't go below 8
  if (baseStats[statKey] <= RULES.STAT_MIN) {
    return false;
  }
  return true;
}

window.calcRemainingPoints = calcRemainingPoints;
window.getRaceBonus = getRaceBonus;
window.getTotalStat = getTotalStat;
window.canIncrement = canIncrement;
window.canDecrement = canDecrement;
