// rules.js — D&D Rules Constants & Default State 
// This thing contains all the game rules, stat arrays, and the starting state for a new character.

const RULES = {
  // Ability score abbreviations and their full names cause it ez to loop through them in code
  STATS: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
  STAT_NAMES: {
    STR: 'Strength', 
    DEX: 'Dexterity', 
    CON: 'Constitution',
    INT: 'Intelligence', 
    WIS: 'Wisdom', 
    CHA: 'Charisma'
  },

  // Point Buy System - standard 27 point budget for 5e
  POINT_BUY_BUDGET: 27,
  STAT_MIN: 8,
  STAT_MAX: 15,
  // How many points each ability score costs in the point buy system
  // 8 costs 0, 9 costs 1, etc. Going from 14 to 15 costs 7 points because 15 is the max you can buy with point buy
  POINT_COSTS: { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 },

  // XP needed to reach each level (1-20). 
  // Level 1 = 0 XP, Level 2 = 300 XP, and blah blah blah up to Level 20 = 355000 XP
  XP_THRESHOLDS: [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
  ],

  // Proficiency bonus based on character level
  // +2 for levels 1-4, +3 for 5-8, +4 for 9-12, +5 for 13-16, +6 for 17-20
  PROFICIENCY_BONUS: [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6],
  // Race stat bonuses - each race gives +2 to some stats
// "None" means no race selected (no bonuses)
  RACES: {
    'None':             { STR:0, DEX:0, CON:0, INT:0, WIS:0, CHA:0 },
    'Human':            { STR:1, DEX:1, CON:1, INT:1, WIS:1, CHA:1 },
    'Dwarf (Hill)':     { STR:0, DEX:0, CON:2, INT:0, WIS:1, CHA:0 },
    'Dwarf (Mountain)': { STR:2, DEX:0, CON:2, INT:0, WIS:0, CHA:0 },
    'Elf (High)':       { STR:0, DEX:2, CON:0, INT:1, WIS:0, CHA:0 },
    'Elf (Wood)':       { STR:0, DEX:2, CON:0, INT:0, WIS:1, CHA:0 },
    'Halfling (Lightfoot)': { STR:0, DEX:2, CON:0, INT:0, WIS:0, CHA:1 },
    'Halfling (Stout)':     { STR:0, DEX:2, CON:1, INT:0, WIS:0, CHA:0 },
    'Dragonborn':       { STR:2, DEX:0, CON:0, INT:0, WIS:0, CHA:1 },
    'Gnome (Forest)':   { STR:0, DEX:1, CON:0, INT:2, WIS:0, CHA:0 },
    'Gnome (Rock)':     { STR:0, DEX:0, CON:1, INT:2, WIS:0, CHA:0 },
    'Half-Elf':         { STR:0, DEX:1, CON:1, INT:0, WIS:0, CHA:2 },
    'Half-Orc':         { STR:2, DEX:0, CON:1, INT:0, WIS:0, CHA:0 },
    'Tiefling':         { STR:0, DEX:0, CON:0, INT:1, WIS:0, CHA:2 }
  },

  

  // Classes and their hit die (how many HP you get per level)
  // Barbarian = d12, Fighter/Paladin/Ranger = d10, etc.
  CLASSES: {
    'None':       { hitDie: 0 },
    'Barbarian':  { hitDie: 12 },
    'Bard':       { hitDie: 8 },
    'Cleric':     { hitDie: 8 },
    'Druid':      { hitDie: 8 },
    'Fighter':    { hitDie: 10 },
    'Monk':       { hitDie: 8 },
    'Paladin':    { hitDie: 10 },
    'Ranger':     { hitDie: 10 },
    'Rogue':      { hitDie: 8 },
    'Sorcerer':   { hitDie: 6 },
    'Warlock':    { hitDie: 8 },
    'Wizard':     { hitDie: 6 }
  },

  // Skills and which ability score they use
  // e.g. Athletics uses Strength, Investigation uses Intelligence
  SKILLS: {
    'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT',
    'Athletics': 'STR', 'Deception': 'CHA', 'History': 'INT',
    'Insight': 'WIS', 'Intimidation': 'CHA', 'Investigation': 'INT',
    'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS',
    'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT',
    'Sleight of Hand': 'DEX', 'Stealth': 'DEX', 'Survival': 'WIS'
  },

  };

// Creating Default State 
// This function returns a fresh character state with all values at their defaults.
// Used when starting a new character or resetting.
function createDefaultState() {
  // Set all skills to false (not proficient) by default
  const skills = {};
  Object.keys(RULES.SKILLS).forEach(function(skill) {
    skills[skill] = false;
  });

  // Return the default character object
  return {
    character: {
      name: '',
      race: 'None',
      class: 'None',
      level: 1,
      xp: 0
    },
    // All abilities start at 8 (minimum for point buy)
    baseStats: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
    hp: { current: 0, max: 0, temp: 0 },
    ac: 10,
    speed: 30,
    deathSaves: { successes: 0, failures: 0 },
    skills,
    proficiencies: '',
    languages: '',
    dciNumber: '',
    faction: '',
    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    featuresTraits: '',
    attacks: [],
    equipment: [],
    notes: '',
    sessionMode: 'campaign',
    created: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
}

// these r available globally so other files can use them
window.RULES = RULES;
window.createDefaultState = createDefaultState;
