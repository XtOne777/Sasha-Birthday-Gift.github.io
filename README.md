# Sasha’s Cake Quest

A pink pixel-art birthday roguelike starring **Sasha Krabovich**, a green, ginger-haired hero with a party fork.

## Play immediately

Open **index.html** in a modern browser. No installation, account, server, or build step is required. Keep `index.html`, `style.css`, `game.js`, `favicon.svg`, and the `assets` folder together. All fonts, graphics, effects, and music work offline. 

## Share for free with GitHub Pages

1. Create a **public** GitHub repository, for example `sasha-cake-quest`.
2. Upload the **contents** of this folder to the repository’s top level. `index.html` must be at the root, rather than inside another folder. Commit the files to `main`.
3. Open the repository’s **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**. Select **main** and **/ (root)**, then **Save**.
5. Wait for deployment, then use the website address shown on that page. It usually looks like `https://YOUR-USERNAME.github.io/sasha-cake-quest/`.

GitHub Pages is free for public repositories on GitHub Free. Publishing can take up to 10 minutes. The project uses relative asset links, so repository subpaths work correctly. An empty `.nojekyll` file is included for static hosting; gameplay also works if a browser upload omits that hidden file.

Official instructions: [Configuring a GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart).

## Controls

| Action | Keyboard | Mouse / touch |
| --- | --- | --- |
| Move | WASD or arrow keys | On-screen D-pad |
| Light attack | Hold J | Hold left mouse / J button |
| Heavy attack | Hold K or Shift | Hold right mouse / K button |
| Birthday burst | L or Space | L button |
| Pause / resume | Esc or P | Pause button |
| Fullscreen / exit fullscreen | F | Fullscreen button |

Mouse movement aims attacks. Moving with the keyboard returns to movement-based aiming with assistance toward a nearby enemy. Heavy attacks pierce armor; special attacks hit in every direction and remove nearby enemy projectiles. Hold an attack to repeat it. Click or tap the stat icons to inspect them; each has a color, a five-notch quality indicator, its current value, and a quality label.

## Music and effects

**Sassssha.mp3**, provided for this game, starts with the first **Start run** click and loops indefinitely. The musical-note button controls music; the speaker button controls pixel effects independently. Both are on by default. Music becomes quieter on pause and stops while the tab is hidden. Browsers require a user interaction before audio can begin.

The MP3 lives in `assets/Sassssha.mp3`; upload the assets folder when publishing to GitHub Pages. Effects include fork swings, heavy impacts, burst arpeggios, soft footsteps, stat-roll ticks, card selections, and floor-clear/victory jingles.

## Interface

The top-left in-game board combines Sasha’s animated portrait, HP, mana, and five stat icons. His ginger-haired portrait blinks and reacts to attacks, damage, low HP, gift breaks, pauses, defeat, and victory. Low health pulses red; burst availability and cooldowns appear directly on the attack buttons.

Menu tickets, gift cards, reward stamps, paper grain, tape, candy colors, and pixel icons replace the separate stats sidebar and large intro text. Gift colors identify their type; stat colors identify their rolled quality. Hover or focus a stat for the full value and quality label. Fullscreen keeps all game controls inside the game frame; browsers without native fullscreen use an expanded-window view.

## What’s inside

- **50 floors**, with growing enemy counts and health.
- **Five bosses**, on floors **10, 20, 30, 40, and 50**. Dodge radial frosting, a charging duck, a robot barrage, summoned toys, and the Fondant Overlord’s final onslaught.
- **Ten enemy types**: cupcakes, charging rubber ducks, armored tin soldiers, jelly blasters, stuffed bruisers, cake slicers, candy wasps, confetti poppers, gingerbread knights, and sugar sorcerers.
- **Three attacks**: a quick fork strike, a slower armor-breaking swing, and a birthday burst costing **40 mana**. Mana regenerates with time and enemy defeats.
- **Five animated random stat rolls per run**: speed, attack damage, special damage, defence, and HP, rated **Bad → Okay → Good → Great → Amazing**.
- **Roguelike runs**: one life, new stat rolls and gift choices when you restart. Every five completed floors offers one of three upgrades. Between floors, recover 12% maximum HP and 20 mana.
- **A giant birthday cake** for clearing the final floor and its remaining guests.
- Pink pixel graphics, a green, red-haired Sasha, looping music, pixel sound effects, damage numbers, hit flashes, and confetti.
- A personal-best cleared-floor record saved locally in the browser. Run progress resets on reload. Storage is optional; the game works if it is unavailable.
- Keyboard, mouse, and touch controls; responsive layouts; automatic pause when you leave the tab.

## Edit the game

`game.js` contains the entire engine. `enemyDefs` defines enemy health, speed, damage, armor, attack behavior, and unlock floors. `bossDefs` defines the five bosses. `enterLevel()` sets the floor’s enemy count and scaling. `upgrades` contains the birthday gifts. All sprites are pixel patterns in `sprites`; no image assets or game libraries are needed.

`style.css` controls the page, colors, overlays, and responsive layout. `index.html` is the entry point for both local play and GitHub Pages.


## Combat update

- Larger crowds: normal floors spawn `4 + floor(floorNumber × 0.46)` enemies. Bosses begin with 3–7 escorts.
- Tougher enemies: higher base health and speed, +2.05 health per subsequent floor, and faster melee/ranged recovery.
- New guests unlock gradually: candy wasp (floor 3), confetti popper (9), gingerbread knight (15), sugar sorcerer (22).
- Ducks telegraph a directional dash. Wasps shoot twin stingers; jelly blasters shoot three-shot fans; slicers fire five shards; poppers launch ten-shot rings; sorcerers combine an eight-shot ring with an aimed fan.
- Five tougher bosses: health is `360 + floorNumber × 23`, with phases at 65% and 30% health. The Countess fires rotating ring sequences; Sir Squeaks chains up to three warned charges with impact rings; the Tyrant fires repeated aimed barrages; the Baron summons mixed reinforcements and fires follow-up volleys; the Overlord combines rotating rings, fast shards, and reinforcements.
- Enemies animate with alternating foot frames, squash/stretch, sway, hover/wing flaps, attack anticipation, strike extension, recovery poses, hit flashes, and rotating stun stars. Boss auras identify later phases. Projectile colors, spin, and trails distinguish attacks.
- Warning circles precede ranged attacks and boss abilities. Charge lanes lock direction before movement. Heavy attacks interrupt ordinary enemy windups and charges. Burst still clears nearby projectiles.
- At most 360 projectiles can be active, and summoned guests are capped to keep extended fights bounded.

### Hit-stun timing

Durations use seconds, independent of display refresh rate. Approximate frame counts below assume 60 fps. Special attacks apply 75% of heavy stun; repeat hits keep the longer remaining stun. Boss light hits do not interrupt their attacks.

| Enemy | Light stun | Heavy stun |
| --- | --- | --- |
| Cupcake | 0.10 s / 6 frames | 0.32 s / 19 frames |
| Rubber duck | 0.07 s / 4 frames | 0.25 s / 15 frames |
| Tin soldier | 0.025 s / 2 frames | 0.18 s / 11 frames |
| Jelly blaster | 0.15 s / 9 frames | 0.42 s / 25 frames |
| Stuffed bruiser | 0.035 s / 2 frames | 0.22 s / 13 frames |
| Cake slicer | 0.08 s / 5 frames | 0.28 s / 17 frames |
| Candy wasp | 0.10 s / 6 frames | 0.30 s / 18 frames |
| Confetti popper | 0.12 s / 7 frames | 0.36 s / 22 frames |
| Gingerbread knight | 0.02 s / 1 frame | 0.16 s / 10 frames |
| Sugar sorcerer | 0.08 s / 5 frames | 0.26 s / 16 frames |
| Bosses | 0 s | 0.045 s / 3 frames |
