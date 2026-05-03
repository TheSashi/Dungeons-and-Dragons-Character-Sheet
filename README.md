# D&D 5e Character Sheet

A simple web-based character sheet for Dungeons & Dragons 



## How to Use This Site


### Creating a Character

1. Start on the Stats tab - use the + and - buttons to adjust your ability scores
2. The points remaining will update automaticaly (27 point buy budget)
3. Go to the Overview tab to select your race and class
4. HP will calculate automaticaly based on your class and Constitution score

### During Play

Damage and Healing
- Enter an amount in the HP input box
- Click "Damage" to take damage (temp HP absorbs it first)
- Click "Heal" to add HP (healing from 0 clears death saves)

Death Saves
- When at 0 HP, click the pips to mark success or failure saves
- 3 successes = stabilized, 3 failures = character dies

Adding Attacks and Equipment
- Go to the Combat tab
- Fill in the attack fields (name, bonus, damage, type) and click Add Attack
- Fill in equipment name and quantity, click Add Equipment

Leveling Up
- Enter XP in the XP input box and click Add XP
- When you hit the threshold, you'll level up automaticaly
- HP recalculates when you level

### Saving Your Character

- Campaign mode - Character saves to localStorage (persists between sessions)
- Session mode - Character saves to sessionStorage (clears when tab closes)
- Toggle between modes using the buttons in the Settings/Options area
- Click Export to download your character as a JSON file
- Click Import to load a previously exported character file



## How Things Calculate Automatically

This section explains all the math that happens behind in the js stuff



### Ability Modifiers

Every ability score has a modifier. The formula is:

(Ability Score - 10) ÷ 2, rounded down

Exemples:
- Score of 8 = -1 modifier
- Score of 10 = +0 modifier
- Score of 12 = +1 modifier
- Score of 14 = +2 modifier
- Score of 16 = +3 modifier

### Proficiency Bonus

Your proficiency bonus depends on your level:

- 1-4 levels: +2 bonus
- 5-8 levels: +3 bonus
- 9-12 levels: +4 bonus
- 13-16 levels: +5 bonus
- 17-20 levels: +6 bonus

### Maximum HP

HP is calculated automaticaly when you select a class and set your level

Level 1: Full hit die + Constitution modifier

Level 2+: Average hit die roll + Constitution modifier per level

The "average" here means half the die (rounded up) plus 1. For example, a d10 averages 6 per level (5 rounded up = 6, plus 1 = 6)

Exemple: Fighter (d10) at level 3 with +2 Constitution
- Level 1: 10 + 2 = 12
- Level 2: 12 + 6 + 2 = 20
- Level 3: 20 + 6 + 2 = 28

### Skill Modifiers

Each skill is tied to an ability score. The modifier is:

Ability Modifier + Proficiency Bonus (if proficient)


If your not proficient in a skill, you just get the ability modifier with no bonus

### Passive Perception

Passive Perception is used for noticing things without actively rolling. The formula is:

10 + Wisdom Modifier + Proficiency Bonus (if proficient)


### Initiative

Your initiative roll is just your Dexterity modifier. Simple as that

### Race Stat Bonuses

When you select a race, certain ability scores get automatic bonuses. For example:
- Humans get +1 to all abilities
- Dwarves get +2 Constitution
- Elves get +2 Dexterity
- Half-Elves get +1 to two different stats plus +2 Charisma

The total (base + race bonus) is used for all calculations

### Hit Dice Display

On the Combat tab, the Hit Dice section shows what kind of die your class uses:
- Barbarian: d12
- Fighter, Paladin, Ranger: d10
- Bard, Cleric, Druid, Monk, Rogue, Warlock: d8
- Sorcerer, Wizard: d6

This displays automaticaly based on your selected class

### XP and Level

XP thresholds for each level:
- Level 2 needs 300 XP
- Level 3 needs 900 XP
- Level 4 needs 2,700 XP
- And so on, up to level 20 at 355,000 XP

The progress bar shows how close you are to the next level

### Damage and Temporary HP

When you take damage:
1. Temporary HP absorbs damage first
2. Any remaining damage reduces your actual HP
3. HP cannot go below 0

When you heal:
1. HP increases by the healing amount, up to your maximum
2. If you were at 0 HP and get healed, your death saves reset to zero

