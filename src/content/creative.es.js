// Contenido del modo creativo. Aquí el tono es más personal, en primera persona.
export default {
  modeLabel: 'Modo',
  modes: { formal: 'Formal', creative: 'Creativo' },
  toast: 'Modo creativo activado: revisa el Laboratorio y Fuera del código.',
  nav: { lab: 'Laboratorio', hobbies: 'Fuera del código' },

  lab: {
    title: 'Laboratorio',
    intro:
      'Piezas interactivas hechas a mano para este sitio con Vue y SVG, sin librerías de animación ni de juegos: física sencilla, detección de colisiones, máquinas de estado y animación cuadro por cuadro.',
    tabs: { mtb: 'Animación: MTB', soccer: 'Juego: penales', cat: 'Un gato' }
  },

  mtb: {
    title: 'Salto en MTB',
    description:
      'El vuelo es una parábola calculada para salir con la misma pendiente de la rampa y aterrizar justo en la otra: así el aterrizaje queda limpio. Elige el truco del siguiente salto.',
    sceneLabel: 'Animación de una bicicleta de montaña saltando entre dos rampas de tierra',
    trickLabel: 'Truco',
    tricks: { none: 'Sin truco', whip: 'Whip', spin: '360', backflip: 'Backflip' },
    random: 'Aleatorio',
    play: 'Reproducir',
    pause: 'Pausar',
    jumps: (n) => `${n} ${n === 1 ? 'salto' : 'saltos'}`,
    note: 'Todo está dibujado con SVG y animado con requestAnimationFrame.'
  },

  soccer: {
    title: 'Tanda de penales',
    description:
      'Cinco tiros. Apunta dentro de la portería, haz clic y vuelve a hacer clic cuando la barra esté en el centro: entre más lejos del centro, más se desvía el tiro. El portero aprende conforme metes goles.',
    fieldLabel: 'Cancha: apunta con el puntero o con las flechas y dispara con clic, Enter o espacio',
    scoreLabel: (g, n) => `${g} goles de ${n} tiros`,
    best: 'Récord',
    hintAim: 'Apunta y haz clic para fijar la mira.',
    hintPower: '¡Ahora! Clic cuando la barra esté en el centro.',
    keysHint: 'Teclado: flechas para apuntar; Enter o espacio para fijar y disparar.',
    outcomes: { goal: '¡Gooool!', save: '¡Atajada!', post: '¡Al poste!', miss: 'Fuera' },
    final: (g, n) => `${g} de ${n}${g === n ? ' · ¡perfecto!' : ''}`,
    restart: 'Jugar de nuevo'
  },

  cat: {
    title: 'Un gato',
    description:
      'Te sigue con la mirada. Acarícialo pasando el puntero sobre él, dale un premio o háblale. Si lo dejas solo un rato, se duerme.',
    sceneLabel: {
      awake: 'Un gato naranja sentado en un cojín, atento',
      happy: 'El gato ronronea contento',
      eating: 'El gato come un pescado',
      asleep: 'El gato duerme'
    },
    pet: 'Acariciar',
    treat: 'Premio',
    talk: 'Hablarle',
    sleep: 'Dormir',
    wake: 'Despertar',
    meows: ['¡Miau!', 'Mrrp?', 'Miaaau…', '¿Y mi premio?', 'Mrrrau'],
    purr: 'Prrrr…',
    eating: '¡Ñam!',
    grumpy: '…estaba dormido',
    yawn: '*bosteza*',
    love: (n) => `${n} ${n === 1 ? 'mimo' : 'mimos'}`
  },

  hobbies: {
    title: 'Fuera del código',
    intro: 'Lo que hago cuando no estoy frente a un IDE.',
    items: [
      { icon: '⚽', title: 'Fútbol', text: 'Uno de los deportes que practico.' },
      { icon: '🏄', title: 'Surf', text: 'Otro deporte que me apasiona.' },
      { icon: '🚵', title: 'Ciclismo de montaña', text: 'MTB, y también de ruta.' },
      { icon: '🎮', title: 'Videojuegos', text: 'Jugarlos y también desarrollarlos.' },
      { icon: '🎸', title: 'Música', text: 'Blues, jazz, rock y funk.' }
    ],
    factsTitle: 'Datos curiosos',
    facts: [
      'Participé en proyectos PAPIME de la UNAM que usaban realidad aumentada para mejorar la enseñanza.',
      'Impartí mini talleres de Swift para iOS y de Android en la universidad.',
      'En hackatones siempre presentamos apps móviles.'
    ]
  }
}
