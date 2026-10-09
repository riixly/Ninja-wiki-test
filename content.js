export const scrolls = [
  {
    id: 'chunin-exams', title: 'Chunin Exams', subtitle: 'Your first real test.', category: 'guides', label: 'PROGRESSION', icon: 'blades', number: '01', badge: 'LEVEL 20', keywords: 'neji rock lee sasuke healing level cap progression exams',
    dek: 'Three opponents. One health bar. Earn your way past level 20.',
    body: `<div class="paper-alert"><strong>Level 20 is a progression gate.</strong><p>You cannot level up any further until you beat the Chunin Exams.</p></div>
      <h3>Enter the exams</h3><p>Reach level 20, then press the Chunin Exams button at the top of your game screen.</p>
      <h3>Fight in this order</h3><ol class="boss-order"><li><span>01</span><div><strong>Neji</strong><small>First opponent</small></div></li><li><span>02</span><div><strong>Rock Lee</strong><small>Second opponent</small></div></li><li><span>03</span><div><strong>Sasuke</strong><small>Final opponent</small></div></li></ol>
      <div class="paper-alert healing"><strong>Your health does not refill between fights.</strong><p>Bring healing scrolls or equip moves that restore health. You need to survive all three opponents without a health reset.</p></div>
      <h3>After you pass</h3><p>Level progression unlocks again. You can continue leveling beyond 20.</p>`
  },
  {
    id: 'getting-started', title: 'Getting Started', subtitle: 'Before you step outside.', category: 'guides', label: 'BEGINNER GUIDE', icon: 'leaf', number: '02', badge: 'START HERE', keywords: 'beginner combat turn based skills level twenty new player',
    dek: 'A few things to know before your first Chunin Exams.',
    body: `<h3>Build around your skills</h3><p>Ninja Destiny is a turn-based strategy RPG. The game description lists over 120 unique skills, with equippable skills and build customization.</p>
      <h3>Plan for level 20</h3><p>At level 20, the Chunin Exams stop further leveling. Use the button at the top of the game screen to enter.</p><p>You fight Neji, Rock Lee, and Sasuke in that order. Your health does not refill between fights, so bring healing scrolls or healing abilities.</p>
      <button class="paper-link" data-open="chunin-exams">Open the Chunin Exams guide <svg><use href="#i-arrow"/></svg></button>
      <h3>Explore the other systems</h3><p>The game description also lists fishing with auto-fishing, missions, and open-world PvP.</p>
      <div class="paper-note">More leveling routes and beginner details will be added after they’re checked in-game.</div>`
  },
  {
    id: 'shinobi-fishing-macro', title: 'Shinobi Fishing', subtitle: 'Your PC fishing companion.', category: 'tools', label: 'FISHING MACRO', icon: 'fish', number: '03', badge: 'V4 · WINDOWS', keywords: 'macro windows pc download fish fishing python calibration shinobi v4',
    dek: 'Shinobi Fishing Macro v4 for Windows PC. Calibrate your fishing bar, hook button, and casting point.',
    body: `<a class="download-button" href="/downloads/Shinobi_Fishing_Macro_v4.zip" download><svg><use href="#i-download"/></svg><span>Download Macro v4<small>ZIP · Windows PC · 9.6 KB</small></span><svg><use href="#i-arrow"/></svg></a>
      <h3>Set it up</h3><ol class="steps"><li>Install <a href="https://www.python.org/downloads/windows/" target="_blank" rel="noopener noreferrer">Python 3 for Windows</a> if needed. Select <strong>Add Python to PATH</strong> during installation.</li><li>Extract the ZIP and open the <strong>Shinobi_Fishing_Macro_v4</strong> folder.</li><li>Double-click <code>START_MACRO.bat</code>. The launcher installs its required Python packages if needed.</li></ol>
      <h3>Calibrate in Roblox</h3><ol class="steps"><li>Start a fishing minigame so the red marker, green zone, and <strong>HOOK!</strong> button are visible.</li><li>Click <strong>CALIBRATE BAR + HOOK</strong>. Drag a rectangle around the entire colored fishing bar, then click the center of <strong>HOOK!</strong>.</li><li>Click <strong>CALIBRATE CAST (CLICK WATER)</strong>, then click where you want the rod to cast.</li><li>Press <kbd>−</kbd> to start.</li></ol>
      <h3>Controls</h3><div class="controls-table"><div><kbd>−</kbd><span>Start / pause</span></div><div><kbd>=</kbd><span>Quit the macro</span></div><div><kbd>Esc</kbd><span>Cancel calibration</span></div></div>
      <div class="paper-note">Keep Roblox visible in windowed or borderless mode, with the macro window away from the fishing area. This version uses your mouse; keep the PC available while it runs.</div><p class="source-line">The setup instructions are included in the v4 ZIP.</p>`
  },
  {
    id: 'skills-and-builds', title: 'Skills & Builds', subtitle: 'Find your fighting style.', category: 'game', label: 'COMBAT ARCHIVE', icon: 'star', number: '04', badge: 'FIELD NOTES', keywords: 'skill builds moves abilities strategy turn based combat',
    dek: 'The foundation of your build is the skills you equip.',
    body: `<h3>Over 120 unique skills</h3><p>The game description lists over 120 skills. You can equip skills, create your own build, and customize your setup.</p><h3>Prepare a way to heal</h3><p>For the Chunin Exams, healing moves can help you survive the three fights. Health does not refill between opponents.</p><button class="paper-link" data-open="chunin-exams">See the exam preparation <svg><use href="#i-arrow"/></svg></button><div class="paper-note">The skill list, effects, and build recommendations are still being collected in-game.</div>`
  },
  {
    id: 'missions', title: 'Missions', subtitle: 'The next assignment.', category: 'game', label: 'MISSION ARCHIVE', icon: 'scroll', number: '05', badge: 'FIELD NOTES', keywords: 'missions quests tasks leveling',
    dek: 'A home for mission routes, requirements, and rewards.',
    body: `<h3>Missions in Ninja Destiny</h3><p>Missions are listed as a feature in the game description.</p><div class="paper-note">Mission names, NPC locations, objectives, and rewards will be added as they’re checked in-game.</div><h3>Reached level 20?</h3><p>Further leveling is locked until you complete the Chunin Exams. Start them with the button at the top of your screen.</p><button class="paper-link" data-open="chunin-exams">Read the Chunin Exams scroll <svg><use href="#i-arrow"/></svg></button>`
  },
  {
    id: 'pvp', title: 'Open-world PvP', subtitle: 'Know your opponent.', category: 'game', label: 'PVP ARCHIVE', icon: 'moon', number: '06', badge: 'FIELD NOTES', keywords: 'pvp combat fight open world player versus player',
    dek: 'A growing archive for player-versus-player combat.',
    body: `<h3>Open-world PvP</h3><p>The game description lists open-world PvP and strategy-based combat among its features.</p><div class="paper-note">PvP mechanics, skill matchups, and build recommendations are still being collected. There’s no verified tier list yet.</div><button class="paper-link" data-open="skills-and-builds">Open Skills & Builds <svg><use href="#i-arrow"/></svg></button>`
  }
];
