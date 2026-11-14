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
    tabs: { mtb: 'Animation: MTB', soccer: 'Game: penalties', cat: 'A cat' }
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

  cat: {
    title: 'A cat',
    description:
      'It follows you with its eyes. Pet it by moving the pointer over it, give it a treat or talk to it. Leave it alone for a while and it falls asleep.',
    sceneLabel: {
      awake: 'An orange cat sitting on a cushion, alert',
      happy: 'The cat purrs happily',
      eating: 'The cat eats a fish',
      asleep: 'The cat is asleep'
    },
    pet: 'Pet',
    treat: 'Treat',
    talk: 'Talk',
    sleep: 'Sleep',
    wake: 'Wake up',
    meows: ['Meow!', 'Mrrp?', 'Meooow…', 'Where is my treat?', 'Mrrrow'],
    purr: 'Purrr…',
    eating: 'Nom!',
    grumpy: '…I was sleeping',
    yawn: '*yawns*',
    love: (n) => `${n} ${n === 1 ? 'cuddle' : 'cuddles'}`
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
