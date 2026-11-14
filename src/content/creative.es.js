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
    tabs: { mtb: 'Animación: MTB', soccer: 'Juego: penales', ttt: 'Juego: gato', c4: 'Juego: Conecta 4' }
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

  ttt: {
    title: 'Gato contra la computadora',
    description:
      'La computadora decide con minimax: explora todas las partidas posibles y elige la jugada con el mejor resultado garantizado. En modo imposible, lo mejor que puedes lograr es empatar.',
    boardLabel: 'Tablero del gato',
    cellLabel: (row, col, mark) => `Fila ${row}, columna ${col}: ${mark ?? 'libre'}`,
    yourTurn: 'Tu turno (X)',
    aiThinking: 'La computadora está pensando…',
    youWin: '¡Ganaste!',
    aiWins: 'Gana la computadora',
    draw: 'Empate',
    you: 'Tú',
    ai: 'Computadora',
    draws: 'Empates',
    levelLabel: 'Dificultad',
    levels: { easy: 'Fácil', normal: 'Normal', impossible: 'Imposible' },
    showEval: 'Mostrar qué ve el algoritmo en cada casilla',
    eval: { win: 'Ganas', draw: 'Empate', lose: 'Pierdes' },
    newGame: 'Nueva partida',
    resetScore: 'Reiniciar marcador',
    note: 'Las partidas alternan quién empieza. La evaluación supone que ambos juegan perfecto desde ahí.'
  },

  c4: {
    title: 'Conecta 4 contra la computadora',
    description:
      'Aquí ya no es posible revisar todas las partidas, así que la computadora usa minimax con poda alfa-beta: analiza varias jugadas hacia adelante, descarta las ramas que no pueden mejorar su resultado y califica el tablero con una heurística (líneas abiertas y control del centro).',
    boardLabel: 'Tablero de Conecta 4',
    columnLabel: (c) => `Soltar ficha en la columna ${c}`,
    yourTurn: 'Tu turno (rosa)',
    aiThinking: 'La computadora está pensando…',
    youWin: '¡Ganaste!',
    aiWins: 'Gana la computadora',
    draw: 'Empate',
    you: 'Tú',
    ai: 'Computadora',
    draws: 'Empates',
    levelLabel: 'Dificultad',
    levels: { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' },
    depth: (d) => `Analiza ${d} ${d === 1 ? 'jugada' : 'jugadas'} hacia adelante.`,
    analyzed: (n) => `Última jugada: ${n.toLocaleString('es-MX')} posiciones analizadas.`,
    newGame: 'Nueva partida',
    resetScore: 'Reiniciar marcador',
    note: 'Teclado: Tab para llegar al tablero, flechas para cambiar de columna, Enter para soltar la ficha.'
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
