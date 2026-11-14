// Creative mode content. The tone here is more personal, in first person.
export default {
  modeLabel: 'Mode',
  modes: { formal: 'Formal', creative: 'Creative' },
  toast: 'Creative mode on: check out the Lab and Off the clock.',
  nav: { lab: 'Lab', hobbies: 'Off the clock' },

  lab: {
    title: 'Lab',
    intro:
      'Interactive pieces hand-built for this site with Vue and SVG, no animation or game libraries: simple physics, collision checks, state machines and frame-by-frame animation.',
    tabs: { mtb: 'Animation: MTB', soccer: 'Game: penalties', ttt: 'Game: tic-tac-toe', c4: 'Game: Connect 4' }
  },

  mtb: {
    title: 'MTB jump',
    description:
      'The flight is a parabola computed to leave at the same slope as the takeoff and land right on the landing ramp, so the landing is clean. Pick the trick for the next jump.',
    sceneLabel: 'Animation of a mountain bike jumping between two dirt ramps',
    trickLabel: 'Trick',
    tricks: { none: 'No trick', whip: 'Whip', spin: '360', backflip: 'Backflip' },
    random: 'Random',
    play: 'Play',
    pause: 'Pause',
    jumps: (n) => `${n} ${n === 1 ? 'jump' : 'jumps'}`,
    note: 'Everything is drawn in SVG and animated with requestAnimationFrame.'
  },

  soccer: {
    title: 'Penalty shootout',
    description:
      'Five shots. Aim inside the goal, click, then click again when the bar is in the middle: the farther from the middle, the more the shot drifts. The keeper learns as you score.',
    fieldLabel: 'Pitch: aim with the pointer or arrow keys and shoot with click, Enter or space',
    scoreLabel: (g, n) => `${g} goals out of ${n} shots`,
    best: 'Best',
    hintAim: 'Aim and click to lock the target.',
    hintPower: 'Now! Click when the bar is in the middle.',
    keysHint: 'Keyboard: arrows to aim; Enter or space to lock and shoot.',
    outcomes: { goal: 'Goal!', save: 'Saved!', post: 'Off the post!', miss: 'Wide' },
    final: (g, n) => `${g} of ${n}${g === n ? ' · perfect!' : ''}`,
    restart: 'Play again'
  },

  ttt: {
    title: 'Tic-tac-toe against the computer',
    description:
      'The computer decides with minimax: it explores every possible game and picks the move with the best guaranteed outcome. On impossible, the best you can do is a draw.',
    boardLabel: 'Tic-tac-toe board',
    cellLabel: (row, col, mark) => `Row ${row}, column ${col}: ${mark ?? 'empty'}`,
    yourTurn: 'Your turn (X)',
    aiThinking: 'The computer is thinking…',
    youWin: 'You win!',
    aiWins: 'The computer wins',
    draw: 'Draw',
    you: 'You',
    ai: 'Computer',
    draws: 'Draws',
    levelLabel: 'Difficulty',
    levels: { easy: 'Easy', normal: 'Normal', impossible: 'Impossible' },
    showEval: 'Show what the algorithm sees on each square',
    eval: { win: 'You win', draw: 'Draw', lose: 'You lose' },
    newGame: 'New game',
    resetScore: 'Reset score',
    note: 'Games alternate who goes first. The evaluation assumes both sides play perfectly from there.'
  },

  c4: {
    title: 'Connect 4 against the computer',
    description:
      'Here it is no longer possible to explore every game, so the computer uses minimax with alpha-beta pruning: it looks several moves ahead, skips branches that cannot improve its outcome and scores the board with a heuristic (open lines and center control).',
    boardLabel: 'Connect 4 board',
    columnLabel: (c) => `Drop a disc in column ${c}`,
    yourTurn: 'Your turn (pink)',
    aiThinking: 'The computer is thinking…',
    youWin: 'You win!',
    aiWins: 'The computer wins',
    draw: 'Draw',
    you: 'You',
    ai: 'Computer',
    draws: 'Draws',
    levelLabel: 'Difficulty',
    levels: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
    depth: (d) => `Looks ${d} ${d === 1 ? 'move' : 'moves'} ahead.`,
    analyzed: (n) => `Last move: ${n.toLocaleString('en-US')} positions analyzed.`,
    newGame: 'New game',
    resetScore: 'Reset score',
    note: 'Keyboard: Tab to reach the board, arrows to change column, Enter to drop the disc.'
  },

  hobbies: {
    title: 'Off the clock',
    intro: "What I do when I'm not in front of an IDE.",
    items: [
      { icon: '⚽', title: 'Soccer', text: 'One of the sports I play.' },
      { icon: '🏄', title: 'Surfing', text: 'Another sport I love.' },
      { icon: '🚵', title: 'Mountain biking', text: 'MTB, and road cycling too.' },
      { icon: '🎮', title: 'Video games', text: 'Playing them and building them.' },
      { icon: '🎸', title: 'Music', text: 'Blues, jazz, rock and funk.' }
    ],
    factsTitle: 'Fun facts',
    facts: [
      "I took part in UNAM's PAPIME projects that used augmented reality to improve teaching.",
      'I taught mini workshops on Swift for iOS and on Android at university.',
      'At hackathons, my teams always shipped mobile apps.'
    ]
  }
}
