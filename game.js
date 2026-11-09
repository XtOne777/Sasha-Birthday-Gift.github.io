/* Sasha's Cake Quest — plain JavaScript, no build step, no game engine. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('game'), ctx = canvas.getContext('2d');
  const overlay = $('overlay'), wrap = $('arenaWrap');

  const iconPaths = {
    heart: 'M3 4h6v3h6V4h6v10h-3v3h-3v3H9v-3H6v-3H3z',
    broken: 'M3 4h7v5H7v4h5v3H9v4H6v-3H3zm11 0h7v10h-3v3h-3v3h-3v-7h3V9h-3V7h2z',
    mana: 'M10 2h4v4h3v4h3v8h-3v3H7v-3H4v-8h3V6h3zm0 7v4H7v4h3v-4h3V9z',
    speed: 'M10 3h6v9h5v6h-3v3H4v-3H1v-6h3v3h6zm8 0h5v3h-5zM1 5h6v3H1z',
    sword: 'M17 2h5v5l-9 9 3 3-3 3-4-4-4 4-3-3 4-4-4-4 3-3 3 3z',
    hammer: 'M3 2h13v3h4v8h-4v3H3v-3H1V5h2zm7 14h4v6h-4z',
    burst: 'M10 1h4v6h-4zm0 16h4v6h-4zM1 10h6v4H1zm16 0h6v4h-6zM4 3h3v3H4zm13 0h3v3h-3zM4 18h3v3H4zm13 0h3v3h-3zM10 7h4v3h3v4h-3v3h-4v-3H7v-4h3z',
    shield: 'M3 3h7V1h4v2h7v12h-3v4h-4v3h-4v-3H6v-4H3zm4 4v8h3v3h4v-3h3V7z',
    cake: 'M5 2h2v4H5zm6-1h2v5h-2zm6 1h2v4h-2zM4 7h16v7H4zm-2 8h20v7H2zm4 2v2h3v-2zm9 0v2h3v-2z',
    crown: 'M2 5h4v4h4V3h4v6h4V5h4v14H2zm3 16h14v2H5z',
    stairs: 'M15 2h7v4h-4v5h-5v5H8v5H2v-4h3v-5h5V7h5z',
    enemy: 'M6 4h12v3h3v12h-3v3h-3v-3H9v3H6v-3H3V7h3zm1 5v5h3V9zm7 0v5h3V9z',
    gift: 'M7 1h4v3h2V1h4v3h3v4H4V4h3zm2 3H7v2h4V4zm6 0h-2v2h4V4zM2 9h20v5h-8v8h-4v-8H2zm2 6h5v7H4zm11 0h5v7h-5z',
    music: 'M8 4h13v13h-3V9h-7v11H8v2H2v-6h6zm4 0v3h6V4z',
    sound: 'M2 9h5l6-6v18l-6-6H2zm14-3h3v3h-3zm3 3h3v6h-3zm-3 6h3v3h-3z',
    fullscreen: 'M2 2h8v3H5v5H2zm12 0h8v8h-3V5h-5zM2 14h3v5h5v3H2zm17 0h3v8h-8v-3h5z',
    minimize: 'M7 2h3v8H2V7h5zm7 0h3v5h5v3h-8zM2 14h8v8H7v-5H2zm12 0h8v3h-5v5h-3z',
    pause: 'M5 3h5v18H5zm9 0h5v18h-5z',
    play: 'M5 2h4v3h4v3h4v3h4v2h-4v3h-4v3H9v3H5z',
    help: 'M6 2h12v3h3v6h-3v3h-4v3h-4v-6h7V6H7v3H3V5h3zm4 18h4v4h-4z',
    move: 'M10 1h4v3h3v3H7V4h3zm0 22h4v-3h3v-3H7v3h3zM1 10v4h3v3h3V7H4v3zm22 0v4h-3v3h-3V7h3v3zM10 10h4v4h-4z',
    pin: 'M7 2h10v3h3v10h-4v3h-2v4h-4v-4H8v-3H4V5h3zm2 4v6h6V6z',
    arrow: 'M12 3h4v3h3v3h3v6h-3v3h-3v3h-4v-5H2V8h10zm2 6v6h3V9z',
    check: 'M18 4h4v5h-3v3h-3v3h-3v3H8v-3H5v-3H2V8h5v3h3v2h2v-3h3V7h3z',
    retry: 'M6 2h12v3h3v6h-4V7h-3V6H8v3h4v4H1V2h4v3h1zm11 13h4v5h-3v3H6v-3H3v-5h4v3h3v1h6v-1h1z',
    moon: 'M9 2h6v3h-4v9h4v3h7v3h-4v2H8v-3H5v-3H2V8h3V5h4z',
    spark: 'M10 1h4v6h3v3h6v4h-6v3h-3v6h-4v-6H7v-3H1v-4h6V7h3z',
    skull: 'M6 2h12v3h3v12h-4v5h-3v-4h-4v4H7v-5H3V5h3zm1 5v5h4V7zm7 0v5h4V7z',
    potion: 'M8 1h8v4h-2v3h3v3h3v9h-3v3H7v-3H4v-9h3V8h3V5H8zm0 12v6h8v-6z'
  };
  function icon(name) { return `<svg class="pixel-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="${iconPaths[name] || iconPaths.spark}"/></svg>`; }
  document.querySelectorAll('[data-icon]').forEach(el => { if (el.id) el.innerHTML = icon(el.dataset.icon); else el.outerHTML = icon(el.dataset.icon); });

  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const grades = ['BAD', 'OKAY', 'GOOD', 'GREAT', 'AMAZING'];
  const factors = [.74, .9, 1.06, 1.26, 1.48];
  const statDefs = [
    { key: 'speed', label: 'Speed', icon: 'speed' },
    { key: 'damage', label: 'Damage', icon: 'sword' },
    { key: 'special', label: 'Special damage', icon: 'burst' },
    { key: 'defence', label: 'Defence', icon: 'shield' },
    { key: 'hp', label: 'Health', icon: 'heart' }
  ];
  const bossDefs = [
    { name: 'THE CUPCAKE COUNTESS', title: 'The Cupcake Countess', sprite: 'cake', color: '#dd669b', ability: 'spiral' },
    { name: 'SIR SQUEAKS-A-LOT', title: 'Sir Squeaks-a-Lot', sprite: 'duck', color: '#f4cd6a', ability: 'charge' },
    { name: 'THE TIN TOY TYRANT', title: 'The Tin Toy Tyrant', sprite: 'robot', color: '#a9a6cf', ability: 'barrage' },
    { name: 'BARON VON BEAR', title: 'Baron von Bear', sprite: 'bear', color: '#b280a1', ability: 'summon' },
    { name: 'THE FONDANT OVERLORD', title: 'The Fondant Overlord', sprite: 'cake', color: '#eb70ad', ability: 'finale' }
  ];
  // Recovery values are seconds (60 fps frame equivalents are documented in README).
  const enemyDefs = {
    cupcake: { sprite: 'cake', name: 'Cupcake', hp: 29, speed: 70, damage: 9, armor: .05, color: '#ef8bb5', ai: 'melee', lightStun: .10, heavyStun: .32, unlock: 1 },
    duck: { sprite: 'duck', name: 'Rubber duck', hp: 22, speed: 116, damage: 7, armor: 0, color: '#f7d776', ai: 'dasher', lightStun: .07, heavyStun: .25, unlock: 2 },
    robot: { sprite: 'robot', name: 'Tin soldier', hp: 43, speed: 55, damage: 12, armor: .62, color: '#b1afcd', ai: 'melee', lightStun: .025, heavyStun: .18, unlock: 4 },
    jelly: { sprite: 'jelly', name: 'Jelly blaster', hp: 32, speed: 65, damage: 10, armor: .12, color: '#c299d5', ai: 'ranged', lightStun: .15, heavyStun: .42, unlock: 6 },
    bear: { sprite: 'bear', name: 'Stuffed bruiser', hp: 67, speed: 67, damage: 16, armor: .3, color: '#b98b9e', ai: 'melee', lightStun: .035, heavyStun: .22, unlock: 8 },
    slice: { sprite: 'slice', name: 'Cake slicer', hp: 40, speed: 90, damage: 12, armor: .16, color: '#eea29f', ai: 'ranged', lightStun: .08, heavyStun: .28, unlock: 12 },
    bee: { sprite: 'bee', name: 'Candy wasp', hp: 25, speed: 125, damage: 10, armor: .04, color: '#f8cc60', ai: 'ranged', lightStun: .10, heavyStun: .30, unlock: 3 },
    popper: { sprite: 'popper', name: 'Confetti popper', hp: 39, speed: 55, damage: 11, armor: .15, color: '#85c9c4', ai: 'ranged', lightStun: .12, heavyStun: .36, unlock: 9 },
    knight: { sprite: 'knight', name: 'Gingerbread knight', hp: 78, speed: 72, damage: 19, armor: .55, color: '#d99a62', ai: 'melee', lightStun: .02, heavyStun: .16, unlock: 15 },
    sorcerer: { sprite: 'sorcerer', name: 'Sugar sorcerer', hp: 49, speed: 69, damage: 14, armor: .18, color: '#9885df', ai: 'ranged', lightStun: .08, heavyStun: .26, unlock: 22 }
  };
  const sprites = {
    hero: [
      '.......p........','......ppp.......','.....ppwp.......','.....ppppp......',
      '....ooooooo.....','...ohHHhhHho....','...ohhhHHhho....','..ohhggggghho...',
      '..ohwoogwohoo...','..ogggooggggo...','..ogggggggggo...',
      '...ogooooogo....','...ogggggggo....','..ogggGGggggo...',
      '.ogoggggggoggo..','.oooggggggoooo..','....ooooooo.....',
      '....obbo.bbo....','....ooooooo.....'
    ],
    cake: ['......r.......','.....rrr......','....wwwww.....','...wwwwwww....','..wwpwpwpww...','.owwwwwwwwwo..','.opppppppppo..','.opwoppowppo..','.opooopooopo..','.opppppppppo..','..obbbbbbo....','..obbbbbbo....','...oooooo.....'],
    duck: ['.....oooo.....','....oyyyyo....','...oyyyyyyo...','...oywoyyyo...','...oyoooyyrr..','....oyyyyyro..','..oooyyyyyo...','.oyyyyyyyyyo..','.oyyyyyyyyyo..','..oyyyyyyyo...','...ooooooo....','....rr.rr.....'],
    robot: ['......o.......','......r.......','...ooooooo....','..ommmmmmmo...','..omwomwomo...','..omoomoomo...','...ommmmmo....','.ooommmmoo oo..'.replaceAll(' ', ''),'.omomrmmommo..','.ooommmmoooo..','...ommmmmo....','...ooooooo....','...ommommo....','...ooo.ooo....'],
    jelly: ['....ooooo.....','...ovvvvvo....','..ovvvVvvvo...','.ovvvVVvvvvo..','.ovvvvvvvvvo..','.ovwovvwovvo..','.ovooovooovo..','.ovvvvvvvvvo..','..ovvvvvvvo...','.ovvovvovvvo..','..oo.oo.oo....'],
    bear: ['..ooo...ooo...','.obbb o obbbo..'.replaceAll(' ', ''),'.obbboobbbo...','..obbbbbbo....','..obwobwbo....','..oboooo bo....'.replaceAll(' ', ''),'..obbwwbbo....','...obbbbo.....','.ooobbbbooo...','.obbbbbbbbo...','..obw wwbo....'.replaceAll(' ', ''),'..obwwwbbo....','..obbbbbbo....','..ooo.ooo.....'],
    slice: ['.......r......','......rwr.....','.....rwwwr....','....rwwwwwr...','...rwwwwwwwr..','..rppppppppr..','.obbbbbbbbbo..','.obwobbwobbo..','.obooobooobo..','.obbbbbbbbbo..','..ooooooooo...'],
    bee: ['..ww.....ww..','.wwww...wwww.','..ww.ooo.ww..','...oyyyyyo...','..oyoyoyoyo..','..oywoywoyo..','...oyyyyyo...','....orro.....','.....oo......'],
    popper: ['..v.......v..','...y..p..y...','....wwwww....','...ovvvvvo...','...ovwovvo...','...ovooovo...','...ovvvvvo...','....ovvvo....','....orrro....','.....ooo.....'],
    knight: ['....ooooo....','...obbbbbo...','..obwobwobo..','..obooooobo..','...obbbbbo...','.ooooooooy...','.omombmomy...','.omommmmmy...','..ooommmo....','...obobbo....','...oo.ooo....'],
    sorcerer: ['......v......','.....vvv.....','....vvVvv....','...vvvvvvv...','..ooooooooo..','...owowowo...','....ovvvo....','...ovVVvvo...','..ovvVVvvvo..','.ovvvvvvvvvo.','..ooooooooo..'],
    bigcake: ['.......y........','.......r........','...y...r...y....','...r...r...r....','...rwwwwwwwr....','..wwwwwwwwwww...','..wpppppppppw...','..wpwpwpwpwpw...','.wwwwwwwwwwwww..','.wpppppppppppw..','.wppwpwpwpwppw..','.wpppppppppppw..','wwwwwwwwwwwwwww.','wpppppppppppppw.','wppwpwpwpwpwppw.','wpppppppppppppw.','ooooooooooooooo.']
  };
  for (const name of ['cake', 'duck', 'robot', 'jelly', 'bear', 'slice', 'bee', 'popper', 'knight', 'sorcerer']) {
    sprites[name + 'Step'] = sprites[name].map((row, i, rows) => i >= rows.length - 2 ? '.' + row.slice(0, -1) : row);
  }
  const palette = { h: '#c65b29', H: '#f89942', o: '#473046', g: '#a8d76e', G: '#d3f29a', w: '#fff0dd', p: '#e77ca7', r: '#bf426c', b: '#b78a85', y: '#f5d97a', m: '#b4b1cf', v: '#b77fc7', V: '#d6afe0' };
  let W = 960, H = 600, clock = 0, previous = 0, state = 'menu';
  let player, enemies = [], bullets = [], particles = [], effects = [], numbers = [];
  let level = 1, cleared = 0, kills = 0, runSeed = '', rng = Math.random, rolled = [], rollTime = 0;
  let levelTime = 0, spawnGrace = 0, shake = 0, toastTime = 0, runCount = 0;
  let soundOn = true, audioCtx, pausedFrom = 'playing', best = 0, pointerAim = null;
  let upgradeChoices = [], chosenFloors = new Set();
  const keys = new Set(), attackKeys = new Set(), touchMove = new Set();
  let lastHud = 0, lastPortrait = 0, stepTime = 0, hurtUntil = 0, excitedUntil = 0, lastMood = '';
  let musicEnabled = true, audioUnlocked = false, fallbackFullscreen = false;
  const music = $('bgMusic'), gameFrame = $('gameFrame');
  const portrait = $('portrait').getContext('2d');
  music.loop = true; music.volume = .32;

  try { best = Number(localStorage.getItem('sasha-best-v1')) || 0; runCount = Number(localStorage.getItem('sasha-runs-v1')) || 0; } catch (_) { /* Storage is optional. */ }

  function seeded(seed) {
    let s = seed >>> 0;
    return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function random(a, b) { return a + rng() * (b - a); }
  function resize() {
    if (!wrap.clientWidth || !wrap.clientHeight) return;
    const oldW = W, oldH = H;
    W = wrap.clientWidth < 540 ? 560 : 960;
    H = Math.round(W * wrap.clientHeight / wrap.clientWidth);
    canvas.width = W; canvas.height = H; ctx.imageSmoothingEnabled = false;
    for (const body of [player, ...enemies, ...bullets, ...particles].filter(Boolean)) { body.x *= W / oldW; body.y *= H / oldH; }
  }
  new ResizeObserver(resize).observe(wrap);

  function sprite(c, name, x, y, scale = 2, flip = false, custom = null) {
    const rows = sprites[name]; if (!rows) return;
    c.save(); c.translate(Math.round(x), Math.round(y)); if (flip) c.scale(-1, 1);
    const ox = -Math.floor(rows[0].length * scale / 2), oy = -rows.length * scale;
    rows.forEach((row, j) => [...row].forEach((ch, i) => {
      if (palette[ch]) { c.fillStyle = custom && ch === 'p' ? custom : palette[ch]; c.fillRect(ox + i * scale, oy + j * scale, scale, scale); }
    })); c.restore();
  }

  function sound(freq = 400, duration = .07, wave = 'square', volume = .035, delay = 0, ratio = .65) {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const o = audioCtx.createOscillator(), gain = audioCtx.createGain(), at = audioCtx.currentTime + delay;
      o.type = wave; o.frequency.setValueAtTime(freq, at); o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * ratio), at + duration);
      gain.gain.setValueAtTime(volume, at); gain.gain.exponentialRampToValueAtTime(.001, at + duration);
      o.connect(gain); gain.connect(audioCtx.destination); o.start(at); o.stop(at + duration);
    } catch (_) { /* Effects are optional on browsers without Web Audio. */ }
  }
  function cue(name) {
    const notes = { start: [523,659,784,1046], clear: [659,784,1046], gift: [784,1046,1318], win: [523,659,784,1046,784,1046,1568], lose: [330,247,165,82], click: [620], roll: [900] }[name] || [620];
    notes.forEach((f, i) => sound(f, name === 'win' ? .2 : .11, 'square', name === 'roll' ? .013 : .025, i * .085, 1));
  }
  function attackSound(type) {
    if (type === 'special') { [523,784,1046,1568].forEach((f,i) => sound(f,.22,'triangle',.045,i*.035,1.2)); sound(120,.18,'sawtooth',.025); }
    else if (type === 'heavy') { sound(180,.12,'square',.05,0,.25); sound(70,.13,'triangle',.05,.025,.7); }
    else { sound(600,.055,'square',.025,0,.35); sound(900,.04,'triangle',.025,.02,.6); }
  }
  function syncMusic() {
    music.volume = ['paused', 'help'].includes(state) ? .13 : .32;
    if (!musicEnabled || !audioUnlocked || document.hidden) { music.pause(); return; }
    if (music.paused) {
      const play = music.play();
      if (play && play.catch) play.then(() => { $('musicButton').classList.remove('needs-tap'); }).catch(() => {
        $('musicButton').classList.add('needs-tap'); $('musicButton').title = 'Tap to start music';
      });
    }
  }
  function unlockAudio() {
    audioUnlocked = true;
    try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); } catch (_) {}
    syncMusic();
  }
  function setMusicButton() {
    $('musicButton').setAttribute('aria-pressed', String(musicEnabled));
    $('musicButton').setAttribute('aria-label', musicEnabled ? 'Mute music' : 'Play music');
    $('musicButton').title = musicEnabled ? 'Music on' : 'Music off';
  }
  function fullscreenActive() { return !!(document.fullscreenElement || document.webkitFullscreenElement || fallbackFullscreen); }
  function syncFullscreen() {
    const active = fullscreenActive();
    gameFrame.classList.toggle('is-fullscreen', active);
    $('fullscreenButton').setAttribute('aria-pressed', String(active));
    $('fullscreenButton').setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
    $('fullscreenButton').title = active ? 'Exit fullscreen · F' : 'Fullscreen · F';
    $('fullscreenButton').innerHTML = icon(active ? 'minimize' : 'fullscreen');
  }
  function expandFallback() {
    fallbackFullscreen = !fallbackFullscreen;
    gameFrame.classList.toggle('expanded', fallbackFullscreen);
    document.body.classList.toggle('fullscreen-fallback', fallbackFullscreen); syncFullscreen();
  }
  async function toggleFullscreen() {
    clearInput();
    if (fallbackFullscreen) { expandFallback(); return; }
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        await exit.call(document);
      } else {
        const enter = gameFrame.requestFullscreen || gameFrame.webkitRequestFullscreen;
        if (!enter) { expandFallback(); return; }
        await enter.call(gameFrame);
      }
      syncFullscreen();
    } catch (_) { expandFallback(); }
  }
  document.addEventListener('fullscreenchange', syncFullscreen);
  document.addEventListener('webkitfullscreenchange', syncFullscreen);
  function toast(message, tone = 'neutral') {
    $('toast').textContent = message; $('toast').dataset.tone = tone; $('toast').classList.add('visible'); toastTime = 2.6;
  }
  function setOverlay(html, className = '') {
    overlay.hidden = false; overlay.innerHTML = `<div class="modal ${className}">${html}</div>`;
    $('touchControls').classList.remove('active'); syncMusic(); drawPortrait();
    requestAnimationFrame(() => overlay.querySelector('button')?.focus({ preventScroll: true }));
  }
  function clearInput() { keys.clear(); attackKeys.clear(); touchMove.clear(); pointerAim = null; }

  function statValue(i) {
    if (!player) return '—';
    return [Math.round(player.speed), player.damage.toFixed(1), Math.round(player.special), Math.round(player.defence * 100) + '%', Math.round(player.maxHp)][i];
  }
  function statDetail(i) {
    return [statValue(0) + ' px / second', statValue(1) + ' base damage', statValue(2) + ' burst damage', statValue(3) + ' damage blocked', statValue(4) + ' maximum HP'][i];
  }
  function updateStats() {
    $('statsList').innerHTML = statDefs.map((s, i) => {
      const grade = rolled.length ? rolled[i] : -1;
      const detail = player ? statDetail(i) : 'Roll a new run';
      return `<button class="stat-chip ${grade >= 0 ? 'grade-' + grades[grade].toLowerCase() : ''}" aria-label="${s.label}: ${detail}${grade >= 0 ? ', ' + grades[grade] : ''}">${icon(s.icon)}<span class="quality" aria-hidden="true">${Array.from({length:5},(_,j)=>`<i class="${j <= grade ? 'lit' : ''}"></i>`).join('')}</span><span class="stat-tip">${s.label}<br>${detail}<b>${grade >= 0 ? grades[grade] : 'NOT ROLLED'}</b></span></button>`;
    }).join('');
    $('runNumber').textContent = player ? 'RUN ' + String(runCount).padStart(2, '0') : '';
    $('bestText').textContent = 'BEST ' + String(best).padStart(2, '0');
    $('progressText').textContent = cleared + ' / 50';
    $('journey').innerHTML = Array.from({ length: 50 }, (_, i) => `<i class="${i < cleared ? 'done' : player && i === level - 1 ? 'current' : ''}" title="Floor ${i + 1}${(i + 1) % 10 === 0 ? ' · Boss' : ''}"></i>`).join('');
  }
  function drawPortrait() {
    let mood = 'happy';
    if (state === 'gameover') mood = 'dizzy';
    else if (state === 'victory' || state === 'cleared') mood = 'celebrate';
    else if (state === 'paused' || state === 'help') mood = 'sleepy';
    else if (clock < hurtUntil) mood = 'hurt';
    else if (clock < excitedUntil) mood = 'celebrate';
    else if (player && player.hp / player.maxHp < .28) mood = 'worried';
    else if (state === 'rolling') mood = 'curious';
    else if (player && player.cooldown > .05 && state === 'playing') mood = 'focused';
    const moods = { happy:['Birthday boy','heart'], celebrate:['Nice!','spark'], sleepy:['On a break','moon'], hurt:['Ouch!','broken'], worried:['Need cake…','heart'], dizzy:['Knocked out','skull'], curious:['Rolling…','gift'], focused:['Here we go','sword'] };
    if (mood !== lastMood) {
      $('portraitFrame').dataset.emotion = mood; $('emotionLabel').textContent = moods[mood][0];
      $('emotionBadge').innerHTML = icon(moods[mood][1]); $('portrait').setAttribute('aria-label', 'Sasha, ' + mood); lastMood = mood;
    }
    const c = portrait; c.clearRect(0,0,80,80); c.imageSmoothingEnabled = false;
    const bob = ['happy','celebrate','curious'].includes(mood) ? Math.round(Math.sin(clock * (mood === 'celebrate' ? 8 : 3))) : 0;
    c.save(); c.translate(0,bob);
    const box = (x,y,w,h,col) => { c.fillStyle=col; c.fillRect(x,y,w,h); };
    box(10,68,60,12,'#628d53'); box(17,62,46,14,'#88af61');
    box(12,20,56,43,'#583b38'); box(8,31,64,23,'#583b38');
    box(16,23,48,40,'#afd67b'); box(12,34,56,16,'#afd67b'); box(19,27,43,26,'#c1df8d');
    // A thick ginger fringe, loose curls, and the birthday hat.
    box(12,18,56,14,'#ab4427'); box(17,14,45,8,'#c45a2e'); box(22,12,30,7,'#e78036');
    box(17,21,43,6,'#ef9845'); box(12,25,9,16,'#c45a2e'); box(59,26,9,17,'#bb4d28');
    box(26,25,9,8,'#d66a2f'); box(45,23,11,7,'#c45a2e'); box(17,38,5,6,'#db7936');
    box(33,3,5,8,'#b74e78'); box(29,9,15,8,'#d77b9b'); box(25,16,23,5,'#b74e78'); box(35,9,4,5,'#f5d78e');
    const blink = (clock % 4.7) > 4.5 || mood === 'sleepy';
    if (mood === 'dizzy') { for (const x of [25,48]) { box(x,36,4,4,'#543845');box(x+4,40,4,4,'#543845');box(x+4,36,4,4,'#543845');box(x,40,4,4,'#543845'); } }
    else if (mood === 'hurt') { box(24,36,12,3,'#543845');box(27,39,9,3,'#543845');box(47,36,12,3,'#543845');box(47,39,9,3,'#543845'); }
    else if (mood === 'celebrate') { box(24,37,4,4,'#543845');box(28,34,4,3,'#543845');box(32,37,4,4,'#543845');box(47,37,4,4,'#543845');box(51,34,4,3,'#543845');box(55,37,4,4,'#543845'); }
    else if (blink) { box(24,39,12,3,'#543845');box(47,39,12,3,'#543845'); }
    else { for (const x of [25,48]) {box(x,34,10,10,'#fff0d9');box(x+4,36,6,9,'#543845');box(x+4,36,2,3,'#fff7ea');} }
    if (mood === 'focused') {box(23,30,13,3,'#b94e27');box(26,32,10,3,'#b94e27');box(47,30,13,3,'#b94e27');box(47,32,10,3,'#b94e27');}
    else if (mood === 'worried') {box(25,30,10,3,'#b94e27');box(48,28,10,3,'#b94e27');box(64,43,4,8,'#7ab3c3');}
    box(20,47,8,4,'#dca077');box(54,47,8,4,'#dca077');
    if (['happy','celebrate'].includes(mood)) {box(31,49,20,8,'#573b43');box(34,49,14,3,'#fff0d9');box(37,55,8,3,'#dc7e80');}
    else if (['hurt','curious','dizzy'].includes(mood)) box(37,49,9,9,'#573b43');
    else if (mood === 'worried') {box(34,53,15,3,'#573b43');box(37,50,9,3,'#573b43');}
    else box(34,52,15,3,'#573b43');
    c.restore();
  }
  function cakePreview() {
    const c = overlay.querySelector('.cake-icon');
    if (c) { const cc = c.getContext('2d'); cc.imageSmoothingEnabled = false; sprite(cc, 'bigcake', 60, 76, 4); }
  }

  function menu() {
    state = 'menu'; clearInput();
    setOverlay(`<span class="ticket-label">BIRTHDAY PASS · ADMIT ONE</span><div class="ticket-cake"><canvas class="cake-icon" width="120" height="80" aria-hidden="true"></canvas></div><h2>Sasha’s<br><span>birthday.</span></h2><div class="menu-chips"><span class="mini-badge">${icon('stairs')}50 floors</span><span class="mini-badge">${icon('crown')}5 bosses</span><span class="mini-badge">${icon('heart')}1 life</span></div><button class="primary" id="startButton">Start run ${icon('play')}</button><br><button class="secondary" id="menuHelp">${icon('help')}Controls</button><p class="audio-note">${icon('music')}Sassssha · loop</p>`, 'menu-card');
    cakePreview(); $('startButton').onclick = startRun; $('menuHelp').onclick = showHelp;
  }
  function startRun() {
    clearInput(); unlockAudio(); cue('start'); const seed = new Uint32Array(1); crypto.getRandomValues(seed); rng = seeded(seed[0]);
    runSeed = seed[0].toString(16).toUpperCase().padStart(8, '0');
    rolled = statDefs.map(() => Math.floor(rng() * 5));
    runCount++; try { localStorage.setItem('sasha-runs-v1', String(runCount)); } catch (_) {}
    player = { x: W / 2, y: H / 2, r: 14, speed: 185 * factors[rolled[0]], damage: 15 * factors[rolled[1]], special: 74 * factors[rolled[2]], defence: [.04, .10, .18, .27, .36][rolled[3]], maxHp: Math.round(150 * factors[rolled[4]]), hp: 1, mana: 100, maxMana: 100, regen: 11, cooldown: 0, invuln: 0, angle: Math.PI / 2, flip: false, attackSpeed: 1, lifeSteal: 0 };
    player.hp = player.maxHp; level = 1; cleared = 0; kills = 0; rollTime = 0; levelTime = 0;
    enemies = []; bullets = []; particles = []; effects = []; numbers = []; chosenFloors.clear();
    state = 'rolling'; hurtUntil = 0; excitedUntil = 0; $('arenaHud').hidden = false; $('bossHud').hidden = true;
    $('seedLabel').textContent = 'WISH #' + runSeed; $('statusLabel').textContent = 'New run';

    setOverlay(`<div class="roll-header-icon">${icon('gift')}</div><h2>Birthday <span>luck</span></h2><div class="roll-grid">${statDefs.map((s, i) => `<div class="roll-item" id="roll${i}">${icon(s.icon)}<b>${['SPEED','DAMAGE','BURST','ARMOR','HP'][i]}</b><span class="roll-value">?</span><small>…</small></div>`).join('')}</div><div id="rollMessage" class="fine-print">Rolling stats…</div><div class="grade-legend">${grades.map((g,i)=>`<span data-grade="${i}"><i></i>${g}</span>`).join('')}</div>`, 'roll-card');
    updateStats(); updateHud();
  }
  function updateRoll(dt) {
    rollTime += dt;
    for (let i = 0; i < 5; i++) {
      const el = $('roll' + i); if (!el) continue;
      const locked = rollTime > .7 + i * .32;
      if (locked && el.dataset.grade === undefined) { el.dataset.grade = String(rolled[i]); cue('roll'); }
      el.classList.toggle('locked', locked);
      el.querySelector('small').textContent = locked ? grades[rolled[i]] : grades[Math.floor(clock * 14 + i * 1.7) % 5];
      el.querySelector('.roll-value').textContent = locked ? statValue(i) : String(Math.floor(clock * 100 + i * 37) % 99);
    }
    if (rollTime > 2.4 && !$('beginButton')) {
      $('rollMessage').outerHTML = `<button class="primary" id="beginButton">Floor 01 ${icon('arrow')}</button>`;
      $('beginButton').onclick = () => enterLevel(1); $('beginButton').focus({ preventScroll: true });
    }
  }
  function recordProgress() {
    best = Math.max(best, cleared); try { localStorage.setItem('sasha-best-v1', String(best)); } catch (_) {}
  }
  function enterLevel(n) {
    level = n; levelTime = 0; clearInput(); overlay.hidden = true; state = 'playing'; syncMusic();
    $('touchControls').classList.add('active'); $('arenaHud').hidden = false;
    player.x = W / 2; player.y = H / 2; player.invuln = 1.5; player.cooldown = 0;
    enemies = []; bullets = []; effects = []; numbers = []; spawnGrace = 1.25;
    const isBoss = n % 10 === 0;
    if (isBoss) {
      const def = bossDefs[n / 10 - 1];
      const boss = makeEnemy('cupcake', W / 2, 125);
      Object.assign(boss, { boss: true, ...def, maxHp: 360 + n * 23, hp: 360 + n * 23, speed: 65 + n * .38, r: 33, damage: 17 + n * .24, armor: .28, cooldown: 1.4, abilityTime: 2.5, bossPhase: 1, lightStun: 0, heavyStun: .045, ai: 'boss' });
      enemies.push(boss);
      for (let i = 0; i < Math.min(8, 2 + n / 10); i++) spawnEnemy();
      toast(def.title, 'danger'); sound(140, .4, 'sawtooth', .04);
    } else {
      const count = 4 + Math.floor(n * .46);
      for (let i = 0; i < count; i++) spawnEnemy();
      if (n === 1) toast('WASD to move · Hold J to attack');
      else if (n === 4) toast('Tin armor? Use K.', 'warning');
      else if (n === 6) toast('Dodge the icing shots.', 'warning');
    }
    $('floorLabel').textContent = `FLOOR ${String(n).padStart(2, '0')} / 50${isBoss ? ' · BOSS' : ''}`;
    $('statusLabel').textContent = isBoss ? 'Boss floor' : ['Frosting foyer', 'Toybox', 'Sugar hall', 'Plush parlor', 'Last slice'][Math.min(4, Math.floor((n - 1) / 10))];
    updateStats(); updateHud(); canvas.focus({ preventScroll: true });
  }
  function makeEnemy(type, x, y) {
    const d = enemyDefs[type], health = d.hp + (level - 1) * 2.05;
    return { ...d, type, x, y, r: 15, hp: health, maxHp: health, speed: d.speed * (1 + (level - 1) * .008), damage: d.damage + level * .19, cooldown: random(.6, 1.7), animTime: random(0, TAU), attackFlash: 0, recovering: 0, windup: 0, hitFlash: 0, stun: 0, phase: random(0, TAU), dead: false };
  }
  function spawnEnemy(type) {
    const available = Object.keys(enemyDefs).filter(t => enemyDefs[t].unlock <= level);
    type ||= available[Math.floor(rng() * available.length)];
    let x, y;
    if (rng() < .5) { x = rng() < .5 ? 55 : W - 55; y = random(100, H - 65); }
    else { x = random(55, W - 55); y = rng() < .5 ? 95 : H - 60; }
    enemies.push(makeEnemy(type, x, y));
  }
  function updateHud() {
    if (!player) return;
    $('hpFill').style.width = `${100 * player.hp / player.maxHp}%`;
    $('hpText').textContent = `${Math.ceil(player.hp)} / ${Math.round(player.maxHp)}`;
    $('manaFill').style.width = `${player.mana}%`; $('manaText').textContent = `${Math.floor(player.mana)} / 100`;
    $('hpBar').classList.toggle('low', player.hp / player.maxHp < .28);
    $('specialButton').classList.toggle('not-ready', player.mana < 40);
    $('specialButton').classList.toggle('ready', player.mana >= 40);
    $('specialButton').setAttribute('aria-label', `Special attack · L · ${player.mana >= 40 ? 'ready, costs 40 mana' : 'needs 40 mana'}`);
    document.querySelectorAll('[data-attack]').forEach(button => {
      const cover = button.querySelector('.cooldown-fill');
      if (cover) cover.style.transform = `scaleY(${clamp(player.cooldown * player.attackSpeed / .72, 0, 1)})`;
    });
    const living = enemies.filter(e => !e.dead);
    $('enemyLabel').textContent = `${living.length} left`;
    const boss = living.find(e => e.boss); $('bossHud').hidden = !boss;
    if (boss) { $('bossName').textContent = `${boss.name} · PHASE ${boss.bossPhase}`; $('bossFill').style.width = `${100 * boss.hp / boss.maxHp}%`; }
  }
  function burst(x, y, color, amount = 10) {
    for (let i = 0; i < amount; i++) { const a = random(0, TAU), v = random(35, 145); particles.push({ x, y: y - 12, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: random(.25, .65), color, size: rng() < .5 ? 3 : 5 }); }
  }
  function damageEnemy(e, damage, type, angle) {
    const armor = type === 'heavy' ? e.armor * .12 : type === 'special' ? e.armor * .3 : e.armor;
    const hit = Math.max(1, damage * (1 - armor)); e.hp -= hit; e.hitFlash = .13;
    e.stun = Math.max(e.stun, type === 'heavy' ? e.heavyStun : type === 'special' ? e.heavyStun * .75 : e.lightStun);
    // A heavy swing interrupts ordinary windups; bosses retain committed attacks.
    if (!e.boss && type === 'heavy') { e.windup = 0; e.chargeWarn = 0; e.charging = 0; e.cooldown = Math.max(e.cooldown, .3); }
    const push = e.boss ? 3 : type === 'heavy' ? 29 : 12;
    e.x = clamp(e.x + Math.cos(angle) * push, 35, W - 35); e.y = clamp(e.y + Math.sin(angle) * push, 75, H - 35);
    numbers.push({ x: e.x, y: e.y - 38, text: Math.round(hit), color: type === 'special' ? '#eaffc7' : '#fff4dc', life: .7 });
    burst(e.x, e.y, type === 'special' ? '#c8ed8b' : e.color, 5);
    if (e.hp <= 0) {
      e.dead = true; kills++; burst(e.x, e.y, e.color, e.boss ? 45 : 15);
      player.mana = Math.min(100, player.mana + 4);
      if (player.lifeSteal) player.hp = Math.min(player.maxHp, player.hp + player.lifeSteal);
      // Small recovery drops reward a close finish without interrupting play.
      if (rng() < .12) { player.hp = Math.min(player.maxHp, player.hp + 7); numbers.push({ x: e.x, y: e.y - 45, text: '+7 HP', color: '#dcffb0', life: 1 }); }
      sound(e.boss ? 130 : 500, e.boss ? .4 : .05, 'triangle');
    }
  }
  function attack(type) {
    if (state !== 'playing' || player.cooldown > 0) return;
    if (type === 'special' && player.mana < 40) { if (toastTime < .6) toast('Need 40 mana', 'warning'); return; }
    let angle = player.angle;
    const closest = enemies.filter(e => !e.dead).sort((a, b) => distance(a, player) - distance(b, player))[0];
    if (pointerAim) angle = Math.atan2(pointerAim.y - player.y, pointerAim.x - player.x);
    else if (closest && distance(closest, player) < 155) angle = Math.atan2(closest.y - player.y, closest.x - player.x);
    player.angle = angle; player.flip = Math.cos(angle) < 0;
    const range = type === 'special' ? 180 : type === 'heavy' ? 114 : 86;
    const damage = type === 'special' ? player.special : player.damage * (type === 'heavy' ? 2.7 : 1);
    player.cooldown = (type === 'special' ? .65 : type === 'heavy' ? .72 : .23) / player.attackSpeed;
    if (type === 'special') { player.mana -= 40; shake = 5; player.invuln = Math.max(player.invuln, .35); }
    effects.push({ type, x: player.x, y: player.y - 14, angle, radius: range, life: type === 'special' ? .5 : .2, maxLife: type === 'special' ? .5 : .2 });
    attackSound(type); if (type === 'special') excitedUntil = clock + .65;
    for (const e of enemies) {
      if (e.dead || distance(player, e) > range + e.r) continue;
      const diff = Math.atan2(Math.sin(Math.atan2(e.y - player.y, e.x - player.x) - angle), Math.cos(Math.atan2(e.y - player.y, e.x - player.x) - angle));
      if (type === 'special' || Math.abs(diff) < (type === 'heavy' ? 1.65 : 1.2)) damageEnemy(e, damage, type, Math.atan2(e.y - player.y, e.x - player.x));
    }
    if (type === 'special') { bullets = bullets.filter(b => Math.hypot(b.x - player.x, b.y - player.y) > range); burst(player.x, player.y, '#c3e988', 28); }
    updateHud();
  }
  function hurt(damage, source) {
    if (state !== 'playing' || player.invuln > 0) return;
    hurtUntil = clock + .65; const amount = Math.max(1, damage * (1 - player.defence)); player.hp = Math.max(0, player.hp - amount); player.invuln = .75; shake = 6;
    numbers.push({ x: player.x, y: player.y - 45, text: '−' + Math.round(amount), color: '#8d234f', life: .85 });
    $('arenaHud').classList.remove('damage-flash'); void $('arenaHud').offsetWidth; $('arenaHud').classList.add('damage-flash'); burst(player.x, player.y, '#a2cc6c', 9); sound(90, .14, 'sawtooth', .035);
    if (source) { const a = Math.atan2(player.y - source.y, player.x - source.x); player.x = clamp(player.x + Math.cos(a) * 14, 35, W - 35); player.y = clamp(player.y + Math.sin(a) * 14, 75, H - 35); }
    updateHud(); if (player.hp <= 0) finish(false);
  }
  function shoot(e, angle, speed = 175, damage = e.damage, kind = 'icing') {
    if (bullets.length >= 360) return;
    bullets.push({ x: e.x, y: e.y - 12, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: kind === 'shard' ? 5 : 6, damage, life: 6, color: e.color, kind, age: 0 });
  }
  function volley(e, angle, count, spread, speed, kind = 'icing') {
    for (let i = 0; i < count; i++) shoot(e, angle + (count === 1 ? 0 : (i / (count - 1) - .5) * spread), speed, e.damage, kind);
  }
  function ring(e, count, offset, speed, kind = 'icing') {
    for (let i = 0; i < count; i++) shoot(e, offset + TAU * i / count, speed, e.damage * .85, kind);
  }
  function rangedAttack(e, a) {
    const speed = 170 + level * 1.05;
    if (e.type === 'bee') volley(e, a, 2, .22, speed + 35, 'shard');
    else if (e.type === 'popper') ring(e, 10, a, speed * .8, 'confetti');
    else if (e.type === 'sorcerer') { ring(e, 8, e.animTime, speed * .65, 'orb'); volley(e, a, 3, .5, speed, 'orb'); }
    else volley(e, a, e.type === 'slice' ? 5 : 3, e.type === 'slice' ? .9 : .5, speed, e.type === 'slice' ? 'shard' : 'icing');
    e.attackFlash = .22;
    e.cooldown = Math.max(.9, (e.type === 'popper' ? 2.7 : 1.95) - level * .012);
  }
  function bossAbility(e) {
    const a = Math.atan2(player.y - e.y, player.x - e.x), phase = e.bossPhase;
    e.attackFlash = .35;
    if (e.ability === 'charge') {
      e.chargeAngle = a; e.chargeWarn = .65; e.chargeChain = phase - 1;
      ring(e, 8 + phase * 2, a, 145, 'confetti'); e.abilityTime = 4.4 - phase * .4;
    } else if (e.ability === 'summon') {
      const slots = Math.max(0, 13 - enemies.filter(m => !m.dead).length);
      const guests = ['bear', 'duck', 'popper', 'knight'];
      for (let i = 0; i < Math.min(slots, phase + 1); i++) spawnEnemy(guests[i]);
      ring(e, 12 + phase * 2, e.animTime, 145, 'confetti');
      e.burstLeft = phase; e.burstTimer = .5; e.abilityTime = 5 - phase * .4;
    } else {
      e.burstLeft = e.ability === 'barrage' ? 3 + phase : e.ability === 'finale' ? 3 + phase : 2 + phase;
      e.burstTimer = 0; e.abilityTime = e.ability === 'finale' ? 3.6 - phase * .3 : 4.1 - phase * .35;
      if (e.ability === 'finale' && enemies.filter(m => !m.dead).length < 9) spawnEnemy(phase === 3 ? 'sorcerer' : 'slice');
    }
    effects.push({ type: 'enemy', x: e.x, y: e.y - 12, radius: 65, life: .45, maxLife: .45 });
  }
  function bossBurst(e) {
    const a = Math.atan2(player.y - e.y, player.x - e.x), phase = e.bossPhase;
    if (e.ability === 'barrage') volley(e, a + Math.sin(e.burstLeft) * .16, 6 + phase, 1.25, 195 + phase * 12, 'shard');
    else if (e.ability === 'summon') volley(e, a, 3 + phase, .9, 185, 'confetti');
    else {
      ring(e, (e.ability === 'finale' ? 14 : 10) + phase * 2, e.animTime * .55 + e.burstLeft * .23, 135 + phase * 13, 'orb');
      if (e.ability === 'finale') volley(e, a, 3, .4, 220, 'shard');
    }
    e.attackFlash = .2; e.burstLeft--; e.burstTimer = .42;
  }
  function updatePlaying(dt) {
    if (!player) return;
    levelTime += dt; spawnGrace = Math.max(0, spawnGrace - dt); player.cooldown = Math.max(0, player.cooldown - dt); player.invuln = Math.max(0, player.invuln - dt);
    player.mana = Math.min(100, player.mana + player.regen * dt);
    let dx = Number(keys.has('d') || keys.has('arrowright') || touchMove.has('right')) - Number(keys.has('a') || keys.has('arrowleft') || touchMove.has('left'));
    let dy = Number(keys.has('s') || keys.has('arrowdown') || touchMove.has('down')) - Number(keys.has('w') || keys.has('arrowup') || touchMove.has('up'));
    if (dx || dy) { stepTime -= dt; if (stepTime <= 0) { sound(110 + Math.floor(clock * 10) % 2 * 35,.025,'square',.008,0,.8); stepTime = .2; } const norm = Math.hypot(dx, dy); dx /= norm; dy /= norm; player.x = clamp(player.x + dx * player.speed * dt, 34, W - 34); player.y = clamp(player.y + dy * player.speed * dt, 80, H - 35); player.angle = Math.atan2(dy, dx); if (dx) player.flip = dx < 0; }
    if (attackKeys.has('special')) attack('special'); else if (attackKeys.has('heavy')) attack('heavy'); else if (attackKeys.has('light')) attack('light');
    const active = enemies.filter(e => !e.dead);
    for (const e of active) {
      if (state !== 'playing') break;
      e.animTime += dt; e.attackFlash = Math.max(0, e.attackFlash - dt); e.recovering = Math.max(0, e.recovering - dt);
      e.hitFlash = Math.max(0, e.hitFlash - dt); e.stun = Math.max(0, e.stun - dt);
      if (spawnGrace > 0 || e.stun > 0) continue;
      e.cooldown -= dt;
      const d = distance(e, player), a = Math.atan2(player.y - e.y, player.x - e.x);
      if (e.boss) {
        const nextPhase = e.hp / e.maxHp < .3 ? 3 : e.hp / e.maxHp < .65 ? 2 : 1;
        if (nextPhase > e.bossPhase) { e.bossPhase = nextPhase; e.abilityTime = Math.min(e.abilityTime, 1); toast(`${e.title} · Phase ${nextPhase}`, 'danger'); burst(e.x, e.y, e.color, 24); }
        if (e.burstLeft > 0) { e.burstTimer -= dt; if (e.burstTimer <= 0) bossBurst(e); }
        e.abilityTime -= dt;
        if (e.abilityTime <= .7 && !e.abilityWarned) { e.abilityWarned = true; }
        if (e.abilityTime <= 0) { bossAbility(e); e.abilityWarned = false; }
      }
      if (e.chargeWarn > 0) { e.chargeWarn -= dt; if (e.chargeWarn <= 0) e.charging = e.boss ? .55 : .34; continue; }
      if (e.charging > 0) {
        e.charging -= dt; const speed = e.boss ? 420 : 285;
        e.x = clamp(e.x + Math.cos(e.chargeAngle) * speed * dt, 38, W - 38);
        e.y = clamp(e.y + Math.sin(e.chargeAngle) * speed * dt, 80, H - 40);
        if (distance(e, player) < e.r + player.r) hurt(e.damage * 1.3, e);
        if (e.charging <= 0) {
          e.recovering = .3; e.cooldown = 1.5;
          if (e.boss) { ring(e, 8, e.chargeAngle, 155, 'confetti'); if (e.chargeChain > 0) { e.chargeChain--; e.chargeAngle = a; e.chargeWarn = .5; } }
        }
        continue;
      }
      if (e.recovering > 0) continue;
      if (e.windup > 0) {
        e.windup -= dt;
        if (e.windup <= 0) {
          if (e.ai === 'ranged') rangedAttack(e, a);
          else { if (d < e.r + 43) hurt(e.damage, e); e.attackFlash = .22; e.cooldown = e.boss ? .95 : .95 + (e.type === 'bear' ? .25 : 0); }
          e.recovering = .16;
        }
        continue;
      }
      if (e.ai === 'ranged') {
        if (d > 245 || d < 145) { const sign = d < 145 ? -1 : 1; e.x += Math.cos(a) * e.speed * dt * sign; e.y += Math.sin(a) * e.speed * dt * sign; }
        else { e.x += Math.cos(a + Math.PI / 2) * e.speed * .3 * dt; e.y += Math.sin(a + Math.PI / 2) * e.speed * .3 * dt; }
        if (e.cooldown <= 0) e.windup = e.type === 'popper' ? .8 : .55;
      } else {
        if (d > e.r + 20) { e.x += Math.cos(a) * e.speed * dt; e.y += Math.sin(a) * e.speed * dt; }
        if (e.ai === 'dasher' && d < 300 && e.cooldown <= 0) { e.chargeAngle = a; e.chargeWarn = .55; }
        else if (d < e.r + 38 && e.cooldown <= 0) e.windup = e.boss ? .55 : e.type === 'bear' ? .65 : .4;
      }
      e.x = clamp(e.x, 30, W - 30); e.y = clamp(e.y, 80, H - 30);
    }
    // Separate the guests so crowds remain readable and attacks stay avoidable.
    for (let i = 0; i < active.length; i++) for (let j = i + 1; j < active.length; j++) {
      const a = active[i], b = active[j], d = distance(a, b), overlap = a.r + b.r - d;
      if (overlap > 0 && d > .01) { const nx = (a.x - b.x) / d, ny = (a.y - b.y) / d; const move = Math.min(overlap * .5, 45 * dt); a.x += nx * move; a.y += ny * move; b.x -= nx * move; b.y -= ny * move; }
    }
    for (const b of bullets) {
      b.age += dt; b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      if (Math.hypot(b.x - player.x, b.y - (player.y - 14)) < b.r + player.r) { hurt(b.damage, b); b.life = 0; }
    }
    bullets = bullets.filter(b => b.life > 0 && b.x > 15 && b.x < W - 15 && b.y > 65 && b.y < H - 15);
    enemies = enemies.filter(e => !e.dead);
    if (state === 'playing' && enemies.length === 0) completeLevel();
    if (clock - lastHud > .08) { updateHud(); lastHud = clock; }
  }

  const upgrades = [
    { title: 'Party fork', desc: '+18% attack damage', icon:'sword', grade:1, apply: () => player.damage *= 1.18 },
    { title: 'Extra candles', desc: '+22% burst damage', icon:'burst', grade:4, apply: () => player.special *= 1.22 },
    { title: 'Sugar sneakers', desc: '+12% speed · max 340', icon:'speed', grade:2, apply: () => player.speed = Math.min(340, player.speed * 1.12) },
    { title: 'Second slice', desc: '+25 max HP · heal 35', icon:'cake', grade:0, apply: () => { player.maxHp += 25; player.hp = Math.min(player.maxHp, player.hp + 35); } },
    { title: 'Gift-wrap armor', desc: '+6% defence · max 65%', icon:'shield', grade:3, apply: () => player.defence = Math.min(.65, player.defence + .06) },
    { title: 'Wish in a bottle', desc: '+3 mana per second', icon:'potion', grade:3, apply: () => player.regen += 3 },
    { title: 'Quick hands', desc: '+12% attack speed', icon:'spark', grade:1, apply: () => player.attackSpeed *= 1.12 },
    { title: 'Snack time', desc: '+2 HP per enemy defeated', icon:'heart', grade:2, apply: () => player.lifeSteal += 2 }
  ];
  function rewardRow(heal) { return `<div class="rewards"><span class="reward">${icon('heart')}+${heal}</span><span class="reward mana-reward">${icon('mana')}+20</span></div>`; }
  function pickUpgrade(i) {
    if (state !== 'cleared' || chosenFloors.has(level)) return;
    chosenFloors.add(level); upgradeChoices[i].apply(); cue('gift'); excitedUntil = clock + .8; enterLevel(level + 1);
  }
  function showCleared(heal) {
    if (level % 5 === 0) {
      setOverlay(`<p class="eyebrow">${icon('check')}FLOOR ${level} CLEARED</p><div class="gift-header">${icon('gift')}</div><h2>Pick a <span>present</span></h2>${rewardRow(heal)}<div class="upgrade-list">${upgradeChoices.map((u,i)=>`<button class="upgrade" data-upgrade="${i}" data-grade="${u.grade}"><span class="upgrade-art">${icon(u.icon)}</span><b>${u.title}</b><span class="upgrade-desc">${u.desc}</span><span class="choose-label">Take gift ${icon('arrow')}</span></button>`).join('')}</div>`, 'gift-card');
      overlay.querySelectorAll('[data-upgrade]').forEach(b => b.onclick = () => pickUpgrade(Number(b.dataset.upgrade)));
    } else {
      setOverlay(`<div class="stamp">${icon('check')}</div><h2>Floor ${String(level).padStart(2,'0')}<br><span>cleared</span></h2>${rewardRow(heal)}${(level + 1) % 10 === 0 ? `<p class="next-boss">${icon('crown')}${bossDefs[(level+1)/10-1].title}</p>` : ''}<button class="primary" id="nextButton">Floor ${String(level+1).padStart(2,'0')} ${icon('arrow')}</button>`, 'clear-card');
      $('nextButton').onclick = () => { cue('click'); enterLevel(level + 1); };
    }
  }
  function completeLevel() {
    cleared = level; recordProgress(); updateHud(); updateStats(); clearInput();
    if (level === 50) { finish(true); return; }
    state = 'cleared';
    const heal = Math.round(player.maxHp * .12); player.hp = Math.min(player.maxHp, player.hp + heal); player.mana = Math.min(100, player.mana + 20); updateHud();
    $('statusLabel').textContent = 'Floor cleared'; cue('clear');
    if (level % 5 === 0) {
      upgradeChoices = [...upgrades];
      for (let i = upgradeChoices.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [upgradeChoices[i], upgradeChoices[j]] = [upgradeChoices[j], upgradeChoices[i]]; }
      upgradeChoices = upgradeChoices.slice(0,3);
    }
    showCleared(heal);
  }
  function finish(won) {
    state = won ? 'victory' : 'gameover'; clearInput(); recordProgress(); updateHud(); updateStats();
    $('statusLabel').textContent = won ? 'Happy birthday, Sasha!' : 'Run ended';
    setOverlay(`<p class="eyebrow">${icon(won?'crown':'skull')}${won?'50 / 50 COMPLETE':'RUN '+String(runCount).padStart(2,'0')}</p>${won?'<canvas class="cake-icon" width="120" height="80" aria-hidden="true"></canvas>':`<div class="stamp result-icon">${icon('broken')}</div>`}<h2>${won?'Happy birthday,<br><span>Sasha!</span>':'Out of <span>HP.</span>'}</h2>${won?'<p>The big cake is yours.</p>':''}<div class="result-numbers"><span>${icon('stairs')}${cleared} / 50</span><span>${icon('enemy')}${kills}</span><span>${icon('crown')}Best ${best}</span></div><button class="primary" id="restartButton">New run ${icon('retry')}</button><p class="fine-print">#${runSeed}</p>`, won?'victory-card':'result-card');
    cakePreview(); $('restartButton').onclick = startRun; cue(won?'win':'lose');
    if (won) for (let i=0;i<100;i++) burst(random(20,W-20),random(40,H-30),['#a6ce72','#fff0b2','#e778a7'][i%3],2);
  }
  function pause() {
    if (state === 'paused') { state = pausedFrom; overlay.hidden = true; if (state === 'playing') $('touchControls').classList.add('active'); syncMusic(); canvas.focus({preventScroll:true}); return; }
    if (state !== 'playing') return;
    pausedFrom = state; state = 'paused'; clearInput();
    setOverlay(`<div class="stamp">${icon('pause')}</div><h2>Paused</h2><button class="primary" id="resumeButton">Resume ${icon('play')}</button><br><button class="secondary" id="controlsButton">${icon('help')}Controls</button>`, 'pause-card');
    $('resumeButton').onclick = pause; $('controlsButton').onclick = showHelp;
  }
  let helpFrom = 'menu';
  function showHelp() {
    if (state === 'help' || state === 'rolling') return;
    if (state === 'playing') pause();
    helpFrom = state; state = 'help'; clearInput();
    setOverlay(`<p class="eyebrow">${icon('help')}CONTROLS</p><h2>The <span>basics</span></h2><div class="help-lines"><div class="help-line">${icon('move')}<div><strong>Move</strong><br>WASD / arrows / touch pad</div></div><div class="help-line">${icon('sword')}<div><strong>Light</strong> · J / left click<br>Quick hits. Hold to repeat.</div></div><div class="help-line">${icon('hammer')}<div><strong>Heavy</strong> · K / Shift / right click<br>Slow swing. Breaks armor.</div></div><div class="help-line">${icon('burst')}<div><strong>Burst</strong> · L / Space · 40 mana<br>Hits nearby enemies. Clears shots.</div></div><div class="help-line">${icon('gift')}<div><strong>One life. 50 floors.</strong><br>Gift every 5. Boss every 10.</div></div></div><p class="help-note">Aim with the mouse, or move toward a target.<br>F: fullscreen · Esc: pause · Hover stats for details.</p><button class="primary" id="closeHelp">Got it ${icon('check')}</button>`, 'help-card');
    $('closeHelp').onclick = () => {
      state = helpFrom;
      if (state === 'menu') menu();
      else if (state === 'paused') { state = 'playing'; pause(); }
      else if (state === 'gameover' || state === 'victory') finish(state === 'victory');
      else if (state === 'cleared') showCleared(Math.round(player.maxHp * .12));
    };
  }

  function drawBackground() {
    ctx.fillStyle = '#e6adc4'; ctx.fillRect(0, 0, W, H);
    // Pixel tiles, frosting border, and party bunting are all drawn locally.
    for (let y = 0; y < H; y += 48) for (let x = 0; x < W; x += 48) {
      ctx.fillStyle = ((x / 48 + y / 48) % 2) ? '#e9b4c9' : '#e7afc6'; ctx.fillRect(x, y, 48, 48);
      ctx.fillStyle = '#d99eb9'; ctx.fillRect(x + 23, y + 23, 2, 2);
    }
    ctx.fillStyle = '#c17c9c'; ctx.fillRect(0, 0, W, 58); ctx.fillRect(0, H - 20, W, 20); ctx.fillRect(0, 0, 20, H); ctx.fillRect(W - 20, 0, 20, H);
    ctx.fillStyle = '#f8d7df'; ctx.fillRect(20, 57, W - 40, 5); ctx.fillRect(20, H - 25, W - 40, 5); ctx.fillRect(17, 58, 5, H - 78); ctx.fillRect(W - 22, 58, 5, H - 78);
    ctx.fillStyle = '#ae6b8c'; ctx.fillRect(0, 0, W, 9);
    ctx.strokeStyle = '#75405f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 14); ctx.quadraticCurveTo(W / 2, 66, W, 14); ctx.stroke();
    for (let i = 1; i < 17; i++) { const x = i * W / 17, y = 14 + 26 * Math.sin(Math.PI * i / 17); ctx.fillStyle = ['#f8d692', '#a9d78f', '#f5dce8', '#d78bb1'][i % 4]; ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y + 1); ctx.lineTo(x, y + 20); ctx.fill(); }
    // Fixed pseudo-random sprinkles do not consume the run's random generator.
    for (let i = 0; i < 45; i++) { const x = 45 + ((i * 137.7) % (W - 90)), y = 95 + ((i * 93.3) % (H - 145)); ctx.fillStyle = ['#efd6bb', '#cf8eae', '#f4c6d4'][i % 3]; ctx.fillRect(Math.floor(x), Math.floor(y), i % 2 ? 5 : 2, i % 2 ? 2 : 5); }
    for (const [x, y] of [[43, 101], [W - 44, 101], [42, H - 44], [W - 44, H - 44]]) {
      ctx.fillStyle = '#d68fac'; ctx.fillRect(x - 10, y - 20, 22, 22); ctx.fillStyle = '#f7d6b7'; ctx.fillRect(x - 2, y - 20, 5, 22); ctx.fillRect(x - 10, y - 12, 22, 4); ctx.fillStyle = '#a56587'; ctx.fillRect(x - 6, y - 26, 7, 5); ctx.fillRect(x + 2, y - 26, 7, 5);
    }
    if (!player || state === 'menu') {
      const decorations = [['cake', W * .14, H * .32], ['duck', W * .84, H * .37], ['robot', W * .18, H * .78], ['bear', W * .8, H * .81], ['jelly', W * .48, H * .88]];
      for (const [s, x, y] of decorations) { shadow(x, y, 23); sprite(ctx, s, x, y + Math.sin(clock * 2 + x) * 3, 3); }
    }
  }
  function shadow(x, y, r) { ctx.fillStyle = '#7e426c29'; ctx.fillRect(Math.round(x - r), Math.round(y - 5), r * 2, 8); }
  function drawEnemy(e) {
    if (e.windup > 0 || e.chargeWarn > 0 || e.abilityWarned) {
      ctx.strokeStyle = '#ac3768'; ctx.lineWidth = 3; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.ellipse(e.x, e.y - 3, e.r + 24, (e.r + 24) * .55, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      if (e.chargeWarn > 0) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.chargeAngle); ctx.fillStyle = '#a9326240'; ctx.fillRect(0, -25, 330, 50); ctx.restore(); }
    }
    shadow(e.x, e.y, e.r + 6);
    const t = e.animTime, beat = Math.sin(t * (e.type === 'duck' ? 20 : 11));
    const winding = e.windup > 0 || e.chargeWarn > 0 || e.abilityWarned;
    const stunned = e.stun > 0, attacking = e.attackFlash > 0 || e.charging > 0;
    let sx = 1, sy = 1, lift = Math.abs(beat) * 2, tilt = beat * .035;
    if (e.sprite === 'jelly' || e.sprite === 'cake') { sx += beat * .08; sy -= beat * .08; }
    if (e.sprite === 'bee' || e.sprite === 'sorcerer') lift = 7 + Math.sin(t * 8) * 5;
    if (e.sprite === 'robot' || e.sprite === 'knight') { lift = Math.floor(Math.abs(beat) * 3); tilt = Math.sign(beat) * .045; }
    if (e.sprite === 'bear') { sx += Math.sin(t * 4) * .035; tilt = beat * .06; }
    if (e.sprite === 'slice') tilt = beat * .12;
    if (winding) { sx = 1.12; sy = .86; lift = 0; tilt = Math.sin(t * 40) * .04; }
    if (attacking) { sx = .90; sy = 1.14; lift += 4; tilt = Math.cos(player.angle) * .12; }
    if (stunned) { sx = 1.13; sy = .85; tilt = Math.sin(t * 55) * .10; lift = 0; }
    if (e.recovering > 0) { sx = 1.06; sy = .94; }
    ctx.save(); ctx.translate(e.x, e.y - lift); ctx.rotate(tilt); ctx.scale(sx, sy);
    if (e.hitFlash > 0) ctx.globalAlpha = .45;
    // Alternating foot pixels give each guest a second actual walk frame.
    const frame = Math.floor(t * 9) % 2;
    sprite(ctx, frame && !winding && !stunned ? e.sprite + 'Step' : e.sprite, 0, 0, e.boss ? 5 : 2.3, player ? e.x > player.x : false, e.boss ? e.color : null);
    if (e.sprite === 'bee') { ctx.globalAlpha = .65; ctx.fillStyle = '#fff3ef'; const flap = Math.sin(t * 55) * 7; ctx.fillRect(-22, -25 - flap, 12, 5); ctx.fillRect(10, -25 + flap, 12, 5); }
    ctx.restore();
    if (stunned) { ctx.fillStyle = '#fff4b8'; for (let i = 0; i < 3; i++) { const a = t * 9 + i * TAU / 3; ctx.fillRect(e.x + Math.cos(a) * 13 - 2, e.y - (e.boss ? 80 : 40) + Math.sin(a) * 4, 4, 4); } }
    if (e.boss && e.bossPhase > 1) { ctx.strokeStyle = e.bossPhase === 3 ? '#a82454' : '#fff0bb'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r + 10 + Math.sin(t * 6) * 3, 12, 0, 0, TAU); ctx.stroke(); }
    if (e.armor > .4) { ctx.fillStyle = '#fff0db'; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center'; ctx.fillText('◇', e.x, e.y - 41); }
    if (!e.boss && e.hp < e.maxHp) { ctx.fillStyle = '#643952'; ctx.fillRect(e.x - 15, e.y - 43, 30, 4); ctx.fillStyle = '#b9d582'; ctx.fillRect(e.x - 14, e.y - 42, 28 * Math.max(0, e.hp / e.maxHp), 2); }
    if (e.boss) { ctx.fillStyle = '#f8d076'; ctx.fillRect(e.x - 16, e.y - 80, 32, 7); ctx.fillRect(e.x - 16, e.y - 89, 6, 10); ctx.fillRect(e.x - 3, e.y - 92, 6, 13); ctx.fillRect(e.x + 10, e.y - 89, 6, 10); }
  }
  function drawPlayer() {
    if (!player) return;
    shadow(player.x, player.y, 20);
    if (player.invuln > 0 && Math.floor(clock * 16) % 2) ctx.globalAlpha = .45;
    const moving = keys.size || touchMove.size;
    sprite(ctx, 'hero', player.x, player.y + (moving && state === 'playing' ? Math.sin(clock * 16) * 2 : Math.sin(clock * 2.5)), 2.3, player.flip);
    ctx.globalAlpha = 1;
    // A party fork makes attack facing visible.
    ctx.save(); ctx.translate(player.x, player.y - 15); ctx.rotate(player.angle); ctx.fillStyle = '#fff0d5'; ctx.fillRect(13, -2, 18, 4); ctx.fillRect(29, -6, 3, 12); ctx.fillRect(29, -6, 9, 2); ctx.fillRect(29, -1, 9, 2); ctx.fillRect(29, 4, 9, 2); ctx.restore();
  }
  function drawEffects() {
    for (const e of effects) {
      const p = 1 - e.life / e.maxLife; ctx.save(); ctx.globalAlpha = 1 - p;
      if (e.type === 'special' || e.type === 'enemy') {
        ctx.strokeStyle = e.type === 'special' ? '#d4f3a8' : '#a93a6a'; ctx.fillStyle = e.type === 'special' ? '#c2eb8e25' : '#b6376825'; ctx.lineWidth = e.type === 'special' ? 9 : 4; ctx.beginPath(); ctx.arc(e.x, e.y, e.radius * (.2 + .8 * p), 0, TAU); ctx.fill(); ctx.stroke();
      } else {
        ctx.strokeStyle = e.type === 'heavy' ? '#fff0bb' : '#fff5e4'; ctx.lineWidth = e.type === 'heavy' ? 14 : 7;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.radius * (.6 + .4 * p), e.angle - 1 + p * .3, e.angle + 1.1 + p * .3); ctx.stroke();
      }
      ctx.restore();
    }
  }
  function draw() {
    ctx.save(); if (shake > .1) ctx.translate(Math.sin(clock * 80) * shake, Math.cos(clock * 73) * shake * .6);
    drawBackground();
    for (const b of bullets) {
      ctx.save(); ctx.translate(b.x, b.y);
      ctx.strokeStyle = b.color; ctx.globalAlpha = .5; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-b.vx * .045, -b.vy * .045); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.rotate(b.kind === 'shard' ? Math.atan2(b.vy, b.vx) : b.age * 5);
      ctx.fillStyle = '#643451'; ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
      ctx.fillStyle = b.color; ctx.fillRect(-b.r + 1, -b.r + 1, b.r * 2 - 2, b.r * 2 - 2);
      ctx.fillStyle = '#fff5d9'; ctx.fillRect(-2, -2, b.kind === 'shard' ? 7 : 4, 4); ctx.restore();
    }
    const actors = [...enemies.filter(e => !e.dead).map(e => ({ y: e.y, draw: () => drawEnemy(e) }))];
    if (player) actors.push({ y: player.y, draw: drawPlayer }); actors.sort((a, b) => a.y - b.y); actors.forEach(a => a.draw());
    drawEffects();
    for (const p of particles) { ctx.globalAlpha = Math.min(1, p.life * 3); ctx.fillStyle = p.color; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size); } ctx.globalAlpha = 1;
    ctx.textAlign = 'center'; ctx.font = 'bold 15px monospace';
    for (const n of numbers) { ctx.globalAlpha = Math.min(1, n.life * 3); ctx.fillStyle = '#663b59'; ctx.fillText(n.text, n.x + 1, n.y + 1); ctx.fillStyle = n.color; ctx.fillText(n.text, n.x, n.y); } ctx.globalAlpha = 1;
    if (state === 'victory') { shadow(W / 2, H / 2 + 90, 65); sprite(ctx, 'bigcake', W / 2, H / 2 + 90, 7); }
    ctx.restore();
  }
  function frame(time) {
    const dt = Math.min(.035, (time - (previous || time)) / 1000); previous = time; clock += dt;
    if (clock - lastPortrait > .08) { drawPortrait(); lastPortrait = clock; }
    if (state === 'rolling') updateRoll(dt);
    if (state === 'playing') updatePlaying(dt);
    if (state !== 'paused' && state !== 'help') {
      for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 130 * dt; p.life -= dt; }
      particles = particles.filter(p => p.life > 0);
      for (const e of effects) e.life -= dt; effects = effects.filter(e => e.life > 0);
      for (const n of numbers) { n.y -= 33 * dt; n.life -= dt; } numbers = numbers.filter(n => n.life > 0);
      shake *= Math.exp(-15 * dt);
      if (toastTime > 0) { toastTime -= dt; if (toastTime <= 0) $('toast').classList.remove('visible'); }
    }
    draw(); requestAnimationFrame(frame);
  }

  const attackMap = { j: 'light', k: 'heavy', shift: 'heavy', l: 'special', ' ': 'special' };
  window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (key === 'f') { e.preventDefault(); if (!e.repeat) toggleFullscreen(); return; }
    if (key === 'escape' && fallbackFullscreen) { e.preventDefault(); toggleFullscreen(); return; }
    if (key === 'escape' || key === 'p') { if (state === 'help') $('closeHelp')?.click(); else if (!e.repeat) pause(); return; }
    if (state !== 'playing') return;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'j', 'k', 'l', 'shift'].includes(key)) e.preventDefault();
    keys.add(key); if (attackMap[key]) { attackKeys.add(attackMap[key]); if (!e.repeat) attack(attackMap[key]); }
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) pointerAim = null;
  });
  window.addEventListener('keyup', e => { const key = e.key.toLowerCase(); keys.delete(key); if (attackMap[key] && !Object.keys(attackMap).some(k => k !== key && keys.has(k) && attackMap[k] === attackMap[key])) attackKeys.delete(attackMap[key]); });
  window.addEventListener('blur', () => { clearInput(); if (state === 'playing') pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') pause(); syncMusic(); });
  function aim(e) { const r = canvas.getBoundingClientRect(); pointerAim = { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
  canvas.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') aim(e); });
  canvas.addEventListener('pointerdown', e => { if (state !== 'playing') return; e.preventDefault(); aim(e); canvas.focus({ preventScroll: true }); const type = e.button === 2 ? 'heavy' : 'light'; attackKeys.add(type); attack(type); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointerup', () => { attackKeys.delete('light'); attackKeys.delete('heavy'); });
  canvas.addEventListener('pointercancel', clearInput); canvas.addEventListener('contextmenu', e => e.preventDefault());
  for (const button of document.querySelectorAll('[data-move], [data-attack]')) {
    const end = e => { e.preventDefault(); if (button.dataset.move) touchMove.delete(button.dataset.move); else attackKeys.delete(button.dataset.attack); };
    button.addEventListener('pointerdown', e => { e.preventDefault(); button.setPointerCapture(e.pointerId); pointerAim = null; if (button.dataset.move) touchMove.add(button.dataset.move); else { attackKeys.add(button.dataset.attack); attack(button.dataset.attack); } });
    button.addEventListener('pointerup', end); button.addEventListener('pointercancel', end); button.addEventListener('lostpointercapture', end);
    if (button.dataset.attack) button.addEventListener('click', () => attack(button.dataset.attack));
  }

  $('pauseButton').onclick = pause; $('helpButton').onclick = showHelp;
  $('fullscreenButton').onclick = toggleFullscreen;
  $('musicButton').onclick = () => { musicEnabled = !musicEnabled; if (musicEnabled) unlockAudio(); setMusicButton(); syncMusic(); };
  $('soundButton').onclick = () => { soundOn = !soundOn; $('soundButton').setAttribute('aria-pressed',String(soundOn)); $('soundButton').setAttribute('aria-label',soundOn?'Mute sound effects':'Enable sound effects'); if (soundOn) { try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); } catch(_) {} cue('click'); } };
  music.addEventListener('error', () => { $('musicButton').title = 'Music unavailable'; $('musicButton').classList.add('needs-tap'); });
  $('statsList').addEventListener('click', e => {
    const chip = e.target.closest('.stat-chip'); if (!chip) return;
    const wasOpen = chip.classList.contains('show-tip');
    $('statsList').querySelectorAll('.stat-chip').forEach(b => { b.classList.remove('show-tip'); b.setAttribute('aria-expanded','false'); });
    chip.classList.toggle('show-tip', !wasOpen); chip.setAttribute('aria-expanded', String(!wasOpen));
  });
  document.addEventListener('pointerdown', e => {
    if (e.target.closest('#statsList')) return;
    $('statsList').querySelectorAll('.stat-chip').forEach(b => { b.classList.remove('show-tip'); b.setAttribute('aria-expanded','false'); });
  });
  overlay.addEventListener('pointerover', e => { if (e.target.closest('.upgrade')) sound(740,.03,'square',.009,0,1); });
  const brand = $('brandCake').getContext('2d'); brand.imageSmoothingEnabled = false; sprite(brand,'bigcake',21,42,2.3);
  updateStats(); resize(); menu(); requestAnimationFrame(frame);
})();
