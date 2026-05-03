// gui.js — Rendering, SVG Icons, Tab Management

// ICONS 
const ICONS = {
  overview: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  stats: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
  combat: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  progression: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="18" y2="12"/><path d="M18 12 15 21 9 3 6 12 2 12"/></svg>',
  storage: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  x: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  export: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  import: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  heart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  skull: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="8"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/><path d="M9 18v3"/><path d="M12 18v3"/><path d="M15 18v3"/><path d="M9 14c.6.5 1.5 1 3 1s2.4-.5 3-1"/></svg>'
};

const TABS = [
  { id: 'overview',    label: 'Overview',    icon: ICONS.overview },
  { id: 'stats',       label: 'Stats',       icon: ICONS.stats },
  { id: 'combat',      label: 'Combat',      icon: ICONS.combat },
  { id: 'progression', label: 'Level',       icon: ICONS.progression },
  { id: 'storage',     label: 'Storage',     icon: ICONS.storage }
];

let activeTab = 'overview';


function esc(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function selectOptions(items, selected) {
  return items.map(item =>
    `<option value="${item}"${item === selected ? ' selected' : ''}>${item}</option>`
  ).join('');
}

function initUI() {
  renderTabBar();
  renderAllPanels();
  switchTab('overview');
}

// TAB BAR 
function renderTabBar() {
  const bar = document.getElementById('tab-bar');
  bar.innerHTML = TABS.map(t => `
    <button class="tab-btn${t.id === activeTab ? ' active' : ''}"
            role="tab" data-tab="${t.id}" aria-selected="${t.id === activeTab}">
      <span class="tab-icon">${t.icon}</span><span class="tab-label">${t.label}</span>
    </button>
  `).join('');
}

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabId}`);
  });
  updateActivePanel();
}

// RENDER ALL PANELS
function renderAllPanels() {
  document.getElementById('main-content').innerHTML =
    overviewPanel() + statsPanel() + combatPanel() + progressionPanel() + storagePanel();
}

// OVERVIEW PANEL
function overviewPanel() {
  const s = window.state;
  return `
  <section id="panel-overview" class="tab-panel" role="tabpanel">
    <div class="card">
      <div class="card-title">Identity</div>
      <div class="form-group">
        <label class="label" for="char-name">Character Name</label>
        <input class="input" type="text" id="char-name" data-field="name"
               placeholder="Enter name..." value="${esc(s.character.name)}" maxlength="50">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="label" for="char-race">Race</label>
          <select class="select" id="char-race" data-field="race">
            ${selectOptions(Object.keys(RULES.RACES), s.character.race)}
          </select>
        </div>
        <div class="form-group">
          <label class="label" for="char-class">Class</label>
          <select class="select" id="char-class" data-field="class">
            ${selectOptions(Object.keys(RULES.CLASSES), s.character.class)}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="label" for="char-faction">Faction</label>
        <input class="input" type="text" id="char-faction" data-field="faction"
               placeholder="Optional" value="${esc(s.faction)}" maxlength="50">
      </div>
      <div class="form-group">
        <label class="label" for="char-dci">DCI Number</label>
        <input class="input" type="text" id="char-dci" data-field="dciNumber"
               placeholder="Optional" value="${esc(s.dciNumber)}" maxlength="20">
      </div>
    </div>

    <div class="card">
      <div class="card-title">Ability Scores</div>
      <div class="stat-grid" id="stat-summary"></div>
    </div>

    <div class="card">
      <div class="card-title">Quick Info</div>
      <div class="quick-row">
        <div class="quick-stat"><div class="quick-val" id="ov-level">${s.character.level}</div><div class="quick-lbl">Level</div></div>
        <div class="quick-stat"><div class="quick-val" id="ov-prof">${formatModifier(calcProficiencyBonus(s.character.level))}</div><div class="quick-lbl">Prof</div></div>
        <div class="quick-stat"><div class="quick-val" id="ov-hp">${s.hp.current}/${s.hp.max}</div><div class="quick-lbl">HP</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Proficiencies & Languages</div>
      <div class="form-group">
        <label class="label" for="char-proficiencies">Other Proficiencies</label>
        <textarea class="input input-sm" id="char-proficiencies" data-field="proficiencies"
                  placeholder="Armor, weapons, tools...">${esc(s.proficiencies)}</textarea>
      </div>
      <div class="form-group">
        <label class="label" for="char-languages">Languages</label>
        <textarea class="input input-sm" id="char-languages" data-field="languages"
                  placeholder="Common, Elvish...">${esc(s.languages)}</textarea>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Personality</div>
      <div class="form-group">
        <label class="label">Personality Traits</label>
        <textarea class="input input-sm" data-field="personalityTraits"
                  placeholder="Describe your character...">${esc(s.personalityTraits)}</textarea>
      </div>
      <div class="form-group">
        <label class="label">Ideals</label>
        <textarea class="input input-sm" data-field="ideals"
                  placeholder="What drives your character...">${esc(s.ideals)}</textarea>
      </div>
      <div class="form-group">
        <label class="label">Bonds</label>
        <textarea class="input input-sm" data-field="bonds"
                  placeholder="Connections to people, places...">${esc(s.bonds)}</textarea>
      </div>
      <div class="form-group">
        <label class="label">Flaws</label>
        <textarea class="input input-sm" data-field="flaws"
                  placeholder="Weaknesses, vices...">${esc(s.flaws)}</textarea>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Features & Traits</div>
      <textarea class="input" data-field="featuresTraits"
                placeholder="Racial traits, class features, feats...">${esc(s.featuresTraits)}</textarea>
    </div>

    <div class="card">
      <div class="card-title">Notes</div>
      <textarea class="input" data-field="notes"
                placeholder="Backstory, session notes...">${esc(s.notes)}</textarea>
    </div>
  </section>`;
}

// STATS Place
function statsPanel() {
  const s = window.state;
  const profBonus = calcProficiencyBonus(s.character.level);
  return `
  <section id="panel-stats" class="tab-panel" role="tabpanel">
    <div class="point-budget">
      <div class="label">Point Buy Budget</div>
      <div class="point-budget-value" id="points-remaining">${calcRemainingPoints(window.state.baseStats)}</div>
      <div class="muted" style="font-size:var(--fs-xs)">of ${RULES.POINT_BUY_BUDGET} points remaining</div>
    </div>
    <div id="stat-rows"></div>
    <div class="card">
      <div class="card-title">Proficiency Bonus</div>
      <div class="passive-row">
        <span class="passive-label">Level ${s.character.level}</span>
        <span class="passive-value" id="prof-bonus-display">+${profBonus}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Passive Wisdom (Perception)</div>
      <div class="passive-row">
        <span class="passive-label">Passive Perception</span>
        <span class="passive-value" id="passive-perc">${getPassivePerception()}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Skills</div>
      <div id="skills-list"></div>
    </div>
  </section>`;
}

// COMBAT PANEL
function combatPanel() {
  const s = window.state;
  return `
  <section id="panel-combat" class="tab-panel" role="tabpanel">
    <div class="hp-display">
      <div class="hp-label">${ICONS.heart} Hit Points</div>
      <div class="hp-numbers">
        <span class="hp-current" id="hp-current">${s.hp.current}</span>
        <span class="hp-sep">/</span>
        <span class="hp-max" id="hp-max">${s.hp.max}</span>
      </div>
      <div class="hp-bar"><div class="hp-bar-fill" id="hp-bar-fill"></div></div>
      <div class="hp-controls">
        <button class="btn btn-danger btn-sm" data-action="damage">DMG</button>
        <input class="input hp-input" type="number" id="hp-amount" value="1" min="1" max="999">
        <button class="btn btn-heal btn-sm" data-action="heal">HEAL</button>
      </div>
    </div>

    <div class="temp-hp-row">
      <span class="label">Temporary HP</span>
      <input class="input input-narrow" type="number" id="temp-hp" value="${s.hp.temp}" min="0" max="999">
    </div>

    <div class="combat-row">
      <div class="combat-stat">
        <div class="combat-stat-value" id="combat-ac">${s.ac}</div>
        <div class="combat-stat-label">Armour Class</div>
        <input class="input input-narrow mt-sm" type="number" id="ac-input" value="${s.ac}" min="1" max="30">
      </div>
      <div class="combat-stat">
        <div class="combat-stat-value" id="combat-init">${formatModifier(calcInitiative(getTotalStat(s.baseStats.DEX, s.character.race, 'DEX')))}</div>
        <div class="combat-stat-label">Initiative</div>
      </div>
      <div class="combat-stat">
        <div class="combat-stat-value" id="combat-speed">${s.speed}</div>
        <div class="combat-stat-label">Speed</div>
        <input class="input input-narrow mt-sm" type="number" id="speed-input" value="${s.speed}" min="0" max="120">
      </div>
    </div>

    <div class="combat-row">
      <div class="combat-stat">
        <div class="combat-stat-value" id="hit-die-type">${RULES.CLASSES[s.character.class]?.hitDieDisplay || '—'}</div>
        <div class="combat-stat-label">Hit Die</div>
        <div class="muted" id="hit-die-level" style="font-size:var(--fs-xs); margin-top:4px;">Level ${s.character.level}</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Attacks & Spellcasting</div>
      <div id="attacks-list"></div>
      <div class="add-form">
        <input class="input input-sm input-name" type="text" id="atk-name" placeholder="Name" maxlength="30">
        <input class="input input-sm input-xs" type="text" id="atk-bonus" placeholder="+Hit" maxlength="6">
        <input class="input input-sm input-xs" type="text" id="atk-damage" placeholder="Dmg" maxlength="20">
        <input class="input input-sm input-xs" type="text" id="atk-type" placeholder="Type" maxlength="15">
        <button class="btn btn-icon-sm" data-action="addAttack">${ICONS.plus}</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Equipment</div>
      <div id="equipment-list"></div>
      <div class="add-form">
        <input class="input input-sm input-name" type="text" id="equip-name" placeholder="Item name" maxlength="40">
        <input class="input input-sm input-xs" type="number" id="equip-qty" placeholder="Qty" min="1" max="999" value="1">
        <button class="btn btn-icon-sm" data-action="addEquipment">${ICONS.plus}</button>
      </div>
    </div>

    <div class="card death-saves-card">
      <div class="card-title">${ICONS.skull} Death Saves</div>
      <div class="death-row">
        <span class="death-label">Successes</span>
        <div class="death-pips" id="death-successes"></div>
      </div>
      <div class="death-row">
        <span class="death-label">Failures</span>
        <div class="death-pips" id="death-failures"></div>
      </div>
      <div class="death-status" id="death-status"></div>
    </div>
  </section>`;
}

// PROGRESSION PANEL
function progressionPanel() {
  const s = window.state;
  const level = s.character.level;
  return `
  <section id="panel-progression" class="tab-panel" role="tabpanel">
    <div class="level-display">
      <div class="level-label">Level</div>
      <div class="level-number" id="prog-level">${level}</div>
      <div class="label mt-sm">Proficiency: <span class="text-accent" id="prog-prof">${formatModifier(calcProficiencyBonus(level))}</span></div>
    </div>
    <div class="xp-section">
      <div class="xp-container">
        <div class="xp-info">
          <span id="xp-current">${s.character.xp.toLocaleString()} XP</span>
          <span id="xp-next">${level >= 20 ? 'MAX LEVEL' : 'Next: ' + xpForNextLevel(level).toLocaleString() + ' XP'}</span>
        </div>
        <div class="xp-bar"><div class="xp-bar-fill" id="xp-bar-fill"></div></div>
        <div class="xp-controls">
          <input class="input" type="number" id="xp-amount" value="100" min="0" max="355000">
          <button class="btn btn-primary btn-sm" data-action="addXP">Add XP</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Milestones</div>
      <div id="milestones" class="milestones-scroll"></div>
    </div>
  </section>`;
}

// Finnally the storage place 
function storagePanel() {
  const s = window.state;
  return `
  <section id="panel-storage" class="tab-panel" role="tabpanel">
    <div class="card">
      <div class="card-title">Session Mode</div>
      <div class="toggle-group">
        <button class="toggle-option${s.sessionMode === 'campaign' ? ' active' : ''}"
                data-action="setMode" data-mode="campaign">Campaign</button>
        <button class="toggle-option${s.sessionMode === 'oneshot' ? ' active' : ''}"
                data-action="setMode" data-mode="oneshot">One-Shot</button>
      </div>
      <p class="muted" id="mode-desc" style="font-size:var(--fs-xs)">
        ${s.sessionMode === 'campaign' ? 'Character persists between sessions (localStorage).' : 'Character cleared when tab closes (sessionStorage).'}
      </p>
    </div>
    <div class="card">
      <div class="card-title">Data</div>
      <button class="btn btn-primary btn-block mb-md" data-action="export">
        ${ICONS.export} Export Character
      </button>
      <label class="btn btn-secondary btn-block mb-md" style="cursor:pointer">
        ${ICONS.import} Import Character
        <input type="file" accept=".json" id="import-file" style="display:none">
      </label>
      <div class="divider"></div>
      <button class="btn btn-danger btn-block" data-action="reset">
        ${ICONS.trash} Reset Character
      </button>
    </div>
  </section>`;
}

// UPDATE FUNCTIONS 
// These functions update the displayed values on the page when data changes.
// Instead of reloading the whole page, we just update the parts that need changing.

// Update just the panel that's currently showing - saves time and looks smoother
function updateActivePanel() {
  if (activeTab === 'overview') {
    updateOverview();
  } else if (activeTab === 'stats') {
    updateStats();
  } else if (activeTab === 'combat') {
    updateCombat();
  } else if (activeTab === 'progression') {
    updateProgression();
  }
}

// Update ALL panels at once - used when something big changes like leveling up
function updateAll() {
  updateOverview();
  updateStats();
  updateCombat();
  updateProgression();
}

// Update the header at the top - shows character name if set
function updateHeader() {
  var logo = document.getElementById('char-logo');
  if (!logo) return;
  
  var name = window.state.character.name;
  if (name) {
    name = name.trim();
  }
  
  // If character has a name, show it - otherwise show default text
  if (name) {
    logo.textContent = name;
  } else {
    logo.textContent = 'Character Sheet';
  }
  
  // Add styling class if name exists for better look
  if (name) {
    logo.classList.add('has-name');
  } else {
    logo.classList.remove('has-name');
  }
}

// Update Overview tab - shows the big ability scores and quick stats
function updateOverview() {
  var s = window.state;
  var grid = document.getElementById('stat-summary');
  
  // Rebuild the stat circles (STR, DEX, CON, etc.)
  // Each circle shows: stat name, total score, and modifier (+2, -1, etc)
  if (grid) {
    var html = '';
    var i = 0;
    for (i = 0; i < RULES.STATS.length; i++) {
      var stat = RULES.STATS[i];
      var total = getTotalStat(s.baseStats[stat], s.character.race, stat);
      var mod = calcModifier(total);
      
      html = html + '<div class="stat-circle">';
      html = html + '<div class="stat-circle-label">' + RULES.STAT_NAMES[stat] + '</div>';
      html = html + '<div class="stat-circle-score">' + total + '</div>';
      html = html + '<div class="stat-circle-mod">' + formatModifier(mod) + '</div>';
      html = html + '</div>';
    }
    grid.innerHTML = html;
  }
  
  // Update quick info section - Level, Prof, HP, Passive Perception
  var lv = document.getElementById('ov-level');
  var prof = document.getElementById('ov-prof');
  var hp = document.getElementById('ov-hp');
  var pp = document.getElementById('ov-passive');
  
  if (lv) lv.textContent = s.character.level;
  if (prof) prof.textContent = formatModifier(calcProficiencyBonus(s.character.level));
  if (hp) hp.textContent = s.hp.current + '/' + s.hp.max;
  if (pp) pp.textContent = getPassivePerception();
}

// Update Stats tab - point buy system, proficiency, and skills
function updateStats() {
  var s = window.state;
  
  // Update point buy budget - shows how many points you have left to spend
  var remaining = calcRemainingPoints(s.baseStats);
  var el = document.getElementById('points-remaining');
  if (el) {
    el.textContent = remaining;
    if (remaining < 0) {
      // Show red styling if over budget
      el.classList.add('over-budget');
    } else {
      el.classList.remove('over-budget');
    }
  }
  
  // Update proficiency bonus - shows +2, +3, etc based on level
  var profEl = document.getElementById('prof-bonus-display');
  if (profEl) {
    var profBonus = calcProficiencyBonus(s.character.level);
    profEl.textContent = '+' + profBonus;
  }
  
  // Update passive perception - the "always on" version of Wisdom (Perception)
  var ppEl = document.getElementById('passive-perc');
  if (ppEl) {
    ppEl.textContent = getPassivePerception();
  }
  
  // Update stat rows - the buttons for increasing/decreasing ability scores
  var container = document.getElementById('stat-rows');
  if (container) {
    var html = '';
    var i = 0;
    for (i = 0; i < RULES.STATS.length; i++) {
      var stat = RULES.STATS[i];
      var base = s.baseStats[stat];
      var bonus = getRaceBonus(s.character.race, stat);
      var total = base + bonus;
      var mod = calcModifier(total);
      var cost = RULES.POINT_COSTS[base];
      
      var canDec = canDecrement(s.baseStats, stat);
      var canInc = canIncrement(s.baseStats, stat);
      
      html = html + '<div class="stat-row">';
      html = html + '<span class="stat-name">' + RULES.STAT_NAMES[stat] + '</span>';
      html = html + '<div class="stat-controls">';
      
      if (canDec) {
        html = html + '<button class="stepper-btn" data-action="decStat" data-stat="' + stat + '">' + ICONS.minus + '</button>';
      } else {
        html = html + '<button class="stepper-btn" data-action="decStat" data-stat="' + stat + '" disabled>' + ICONS.minus + '</button>';
      }
      
      html = html + '<span class="stat-value">' + base + '</span>';
      
      if (canInc) {
        html = html + '<button class="stepper-btn" data-action="incStat" data-stat="' + stat + '">' + ICONS.plus + '</button>';
      } else {
        html = html + '<button class="stepper-btn" data-action="incStat" data-stat="' + stat + '" disabled>' + ICONS.plus + '</button>';
      }
      
      html = html + '</div>';
      
      if (bonus > 0) {
        html = html + '<span class="stat-bonus">+' + bonus + '</span>';
      } else {
        html = html + '<span class="stat-bonus"></span>';
      }
      
      html = html + '<span class="stat-modifier">' + formatModifier(mod) + '</span>';
      html = html + '<span class="stat-cost">' + cost + 'pts</span>';
      html = html + '</div>';
    }
    container.innerHTML = html;
  }
  
  // Update skills list
  var skillsList = document.getElementById('skills-list');
  if (skillsList) {
    var skillsData = getSkillsData();
    var html = '';
    var i = 0;
    for (i = 0; i < skillsData.length; i++) {
      var d = skillsData[i];
      
      // Skip Perception - handled by passive perception
      if (d.skill === 'Perception') {
        continue;
      }
      
      html = html + '<label class="skill-row">';
      html = html + '<input class="skill-check" type="checkbox" data-action="toggleSkill" data-skill="' + d.skill + '"';
      if (d.proficient) {
        html = html + ' checked';
      }
      html = html + '>';
      html = html + '<span class="skill-name">' + d.skill + '</span>';
      html = html + '<span class="skill-stat">' + RULES.STAT_NAMES[d.stat] + '</span>';
      html = html + '<span class="skill-mod">' + formatModifier(d.mod) + '</span>';
      html = html + '</label>';
    }
    skillsList.innerHTML = html;
  }
}

// Update Combat tab - HP, AC, initiative, speed, hit dice, attacks, equipment
function updateCombat() {
  var s = window.state;
  
  // Calculate HP percentage for the health bar
  // how i figure out what color the HP should be (green, yellow, red)
  var pct = 0;
  if (s.hp.max > 0) {
    pct = (s.hp.current / s.hp.max) * 100;
  }
  
  var hpClass = '';
  if (pct <= 25) {
    hpClass = 'critical';  // Red - really low HP
  } else if (pct <= 50) {
    hpClass = 'hurt';     // Yellow - getting low
  }
  // Green (normal) if above 50%
  
  // Update HP display - current HP, max HP, and the bar
  var cur = document.getElementById('hp-current');
  var max = document.getElementById('hp-max');
  var bar = document.getElementById('hp-bar-fill');
  
  if (cur) {
    cur.textContent = s.hp.current;
    cur.className = 'hp-current ' + hpClass;
  }
  if (max) {
    max.textContent = s.hp.max;
  }
  if (bar) {
    bar.style.width = pct + '%';
    bar.className = 'hp-bar-fill ' + hpClass;
  }
  
  // Update combat stats
  var init = document.getElementById('combat-init');
  if (init) {
    init.textContent = formatModifier(calcInitiative(getTotalStat(s.baseStats.DEX, s.character.race, 'DEX')));
  }
  
  var ac = document.getElementById('combat-ac');
  if (ac) {
    ac.textContent = s.ac;
  }
  
  var spd = document.getElementById('combat-speed');
  if (spd) {
    spd.textContent = s.speed;
  }
  
  // Update Hit Dice display
  var hdType = document.getElementById('hit-die-type');
  if (hdType) {
    var hitDieInfo = RULES.CLASSES[s.character.class];
    if (hitDieInfo && hitDieInfo.hitDieDisplay) {
      hdType.textContent = hitDieInfo.hitDieDisplay;
    } else {
      hdType.textContent = '—';
    }
  }
  
  var hdLevel = document.getElementById('hit-die-level');
  if (hdLevel) {
    hdLevel.textContent = 'Level ' + s.character.level;
  }
  
  // Update death saves - success pips
  var succEl = document.getElementById('death-successes');
  if (succEl) {
    var html = '';
    var i = 0;
    for (i = 0; i < 3; i++) {
      var isActive = i < s.deathSaves.successes;
      html = html + '<div class="death-pip';
      if (isActive) {
        html = html + ' active-success';
      }
      html = html + '" data-action="deathSuccess" data-index="' + i + '" role="button"></div>';
    }
    succEl.innerHTML = html;
  }
  
  // Update death saves - failure pips
  var failEl = document.getElementById('death-failures');
  if (failEl) {
    var html = '';
    var i = 0;
    for (i = 0; i < 3; i++) {
      var isActive = i < s.deathSaves.failures;
      html = html + '<div class="death-pip';
      if (isActive) {
        html = html + ' active-fail';
      }
      html = html + '" data-action="deathFailure" data-index="' + i + '" role="button"></div>';
    }
    failEl.innerHTML = html;
  }
  
  // Update death status
  var status = document.getElementById('death-status');
  if (status) {
    var deathStatus = getDeathStatus();
    status.className = 'death-status';
    
    if (deathStatus === 'dead') {
      status.classList.add('show', 'dead');
      status.textContent = 'Character Has Died';
    } else if (deathStatus === 'stable') {
      status.classList.add('show', 'stable');
      status.textContent = 'Stabilized';
    } else {
      status.textContent = '';
    }
  }
  
  // Update attacks list
  var atkList = document.getElementById('attacks-list');
  if (atkList) {
    var attacks = s.attacks;
    if (!attacks) {
      attacks = [];
    }
    
    var html = '';
    if (attacks.length === 0) {
      html = '<div class="empty-list">No attacks added</div>';
    } else {
      var i = 0;
      for (i = 0; i < attacks.length; i++) {
        var atk = attacks[i];
        html = html + '<div class="list-entry">';
        html = html + '<span class="list-entry-name">' + esc(atk.name) + '</span>';
        html = html + '<span class="list-entry-tag">' + esc(atk.bonus) + '</span>';
        html = html + '<span class="list-entry-tag">' + esc(atk.damage) + '</span>';
        html = html + '<span class="list-entry-tag">' + esc(atk.type) + '</span>';
        html = html + '<button class="btn-remove" data-action="removeAttack" data-index="' + i + '">' + ICONS.x + '</button>';
        html = html + '</div>';
      }
    }
    atkList.innerHTML = html;
  }
  
  // Update equipment list
  var eqList = document.getElementById('equipment-list');
  if (eqList) {
    var equipment = s.equipment;
    if (!equipment) {
      equipment = [];
    }
    
    var html = '';
    if (equipment.length === 0) {
      html = '<div class="empty-list">No equipment added</div>';
    } else {
      var i = 0;
      for (i = 0; i < equipment.length; i++) {
        var item = equipment[i];
        var qty = item.qty;
        if (!qty) {
          qty = 1;
        }
        html = html + '<div class="list-entry">';
        html = html + '<span class="list-entry-name">' + esc(item.name) + '</span>';
        html = html + '<span class="list-entry-qty">x' + qty + '</span>';
        html = html + '<button class="btn-remove" data-action="removeEquipment" data-index="' + i + '">' + ICONS.x + '</button>';
        html = html + '</div>';
      }
    }
    eqList.innerHTML = html;
  }
}

function updateProgression() {
  var s = window.state;
  var level = s.character.level;
  
  var lv = document.getElementById('prog-level');
  var prof = document.getElementById('prog-prof');
  
  if (lv) lv.textContent = level;
  if (prof) prof.textContent = formatModifier(calcProficiencyBonus(level));
  
  var curXP = document.getElementById('xp-current');
  var nextXP = document.getElementById('xp-next');
  var bar = document.getElementById('xp-bar-fill');
  
  if (curXP) curXP.textContent = s.character.xp.toLocaleString() + ' XP';
  
  if (nextXP) {
    if (level >= 20) {
      nextXP.textContent = 'MAX LEVEL';
    } else {
      var nextXpValue = xpForNextLevel(level);
      nextXP.textContent = 'Next: ' + nextXpValue.toLocaleString() + ' XP';
    }
  }
  
  if (bar) {
    var progress = xpProgress(s.character.xp, level) * 100;
    bar.style.width = progress + '%';
  }
  
  var ms = document.getElementById('milestones');
  if (ms) {
    var html = '';
    var i = 0;
    for (i = 0; i < RULES.XP_THRESHOLDS.length; i++) {
      var xp = RULES.XP_THRESHOLDS[i];
      var reached = s.character.xp >= xp;
      
      html = html + '<div class="milestone-row';
      if (reached) {
        html = html + ' reached';
      }
      html = html + '">';
      html = html + '<span>Level ' + (i + 1) + '</span>';
      html = html + '<span>' + xp.toLocaleString() + ' XP</span>';
      html = html + '</div>';
    }
    ms.innerHTML = html;
  }
}

// POPUP 
var popupTimer;
function showPopup(message, type) {
  if (!type) {
    type = 'info';
  }
  
  var popup = document.getElementById('popup');
  popup.textContent = message;
  popup.className = 'popup show ' + type;
  
  clearTimeout(popupTimer);
  popupTimer = setTimeout(function() {
    popup.className = 'popup';
  }, 2500);
}

window.ICONS = ICONS;
window.initUI = initUI;
window.switchTab = switchTab;
window.updateAll = updateAll;
window.updateStats = updateStats;
window.updateCombat = updateCombat;
window.updateOverview = updateOverview;
window.updateProgression = updateProgression;
window.showPopup = showPopup;
window.updateHeader = updateHeader;
window.renderAllPanels = renderAllPanels;
