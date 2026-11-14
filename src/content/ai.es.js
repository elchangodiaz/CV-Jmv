// Textos del asistente con IA.
export default {
  nav: 'Asistente IA',
  title: 'Asistente con IA',
  intro:
    'Consulte este CV en lenguaje natural o compárelo con una vacante. La IA responde solo con la información publicada en este sitio.',
  tabs: { chat: 'Consulte mi CV', match: '¿Encajo en su vacante?' },

  chat: {
    placeholder: 'Escriba una pregunta sobre la experiencia de Javier…',
    send: 'Enviar',
    clear: 'Nueva conversación',
    you: 'Usted',
    assistant: 'Asistente',
    thinking: 'Pensando…',
    suggestionsTitle: 'Puede empezar con:',
    suggestions: [
      '¿Qué experiencia tiene con Kafka y eventos?',
      '¿Ha liderado equipos?',
      '¿Qué hizo en Santander?',
      '¿Ha trabajado con AWS?'
    ]
  },

  match: {
    label: 'Descripción de la vacante',
    placeholder: 'Pegue aquí el texto de la vacante: responsabilidades, requisitos y tecnologías.',
    analyze: 'Analizar',
    analyzing: 'Analizando…',
    sample: 'Usar una vacante de ejemplo',
    sampleText:
      'Buscamos Ingeniero Backend Senior. Requisitos: 5+ años con Java y Spring Boot, diseño de microservicios y APIs REST, mensajería con Kafka, experiencia en AWS (Lambda, Step Functions), bases de datos SQL, pruebas automatizadas y CI/CD. Deseable: Kubernetes, experiencia en fintech y liderazgo técnico.',
    fit: { high: 'Encaje alto', medium: 'Encaje medio', low: 'Encaje bajo' },
    status: { yes: 'Cumple', partial: 'Parcial', no: 'No aparece en el CV' },
    requirements: 'Requisitos de la vacante',
    skills: 'Habilidades relacionadas',
    skillsHint: 'Seleccione una para ver en qué puestos se utilizó.',
    localTitle: 'Habilidades del CV mencionadas en la vacante',
    localNote: 'Análisis por palabras clave, sin IA.',
    localNone: 'No se encontraron habilidades del CV en el texto.',
    count: (n, max) => `${n} / ${max}`
  },

  errors: {
    disabled: 'El asistente con IA no está disponible en este momento.',
    quota: 'El asistente alcanzó su límite gratuito de hoy. Vuelva a intentarlo mañana.',
    rate_limited: 'Demasiadas consultas seguidas. Espere un minuto, por favor.',
    too_long: 'El texto es demasiado largo.',
    too_short: 'El texto de la vacante es demasiado corto.',
    timeout: 'La IA tardó demasiado en responder. Inténtelo de nuevo.',
    network: 'No fue posible conectar con el asistente.',
    default: 'Ocurrió un error con el asistente. Inténtelo de nuevo.'
  },
  fallbackNote: 'Mientras tanto, se muestra un análisis por palabras clave.',

  disclaimer:
    'Las respuestas las genera una IA (Llama, mediante Cloudflare Workers AI) a partir de este CV y pueden contener errores. Las conversaciones no se guardan.'
}
