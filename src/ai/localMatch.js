// Análisis de vacante sin IA: busca en el texto las habilidades de la tabla.
// Se usa cuando la IA no está configurada o ya agotó su cuota del día.

// Formas alternativas con que una vacante suele nombrar cada habilidad.
const ALIASES = {
  'Spring Boot': ['springboot'],
  'APIs REST': ['rest', 'restful', 'api rest', 'rest api', 'rest apis'],
  'REST APIs': ['rest', 'restful', 'api rest', 'rest api', 'apis rest'],
  'Microservicios': ['microservices', 'microservice', 'microservicio'],
  'Microservices': ['microservicios', 'microservice'],
  'Programación reactiva': ['reactive', 'webflux', 'reactor'],
  'Reactive programming': ['reactive', 'webflux', 'reactor'],
  'AWS Lambda': ['aws', 'lambda', 'serverless'],
  'AWS Step Functions': ['step functions'],
  'Oracle Database': ['oracle'],
  'Node.js': ['node', 'nodejs'],
  'Vue.js': ['vue', 'vuejs'],
  'React': ['react.js', 'reactjs'],
  'Docker (básico)': ['docker'],
  'Docker (basic)': ['docker'],
  'CI/CD': ['ci cd', 'continuous integration', 'integración continua'],
  'Micro-frontends': ['microfrontends', 'micro frontends', 'module federation'],
  'Kafka': ['apache kafka', 'event streaming', 'event-driven'],
  'JUnit': ['unit testing', 'pruebas unitarias'],
  'Cube.js': ['cube', 'cubejs'],
  'JavaScript': ['js', 'ecmascript']
}

const normalize = (text) =>
  ` ${text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9.+#/]+/g, ' ')
    .replace(/\.(?=\s|$)/g, ' ')} `

const termsFor = (skill) => [skill.replace(/\s*\(.*\)$/, ''), ...(ALIASES[skill] ?? [])]

export function localMatch(jobText, skills) {
  const text = normalize(jobText)
  const found = skills.filter((skill) =>
    termsFor(skill).some((term) => {
      const t = normalize(term).trim()
      return t && text.includes(` ${t} `)
    })
  )
  return { skills: [...new Set(found)] }
}
