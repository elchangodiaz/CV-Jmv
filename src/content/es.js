export default {
  meta: {
    title: 'Javier Mercado Velázquez | Ingeniero Backend Senior',
    description:
      'Ingeniero de software senior full stack con enfoque backend y más de 6 años de experiencia en microservicios con Java y Spring Boot para banca y financiamiento al consumo.'
  },

  ui: {
    skipLink: 'Ir al contenido',
    langName: 'Español',
    nav: {
      summary: 'Perfil',
      experience: 'Experiencia',
      skills: 'Habilidades',
      projects: 'Proyectos',
      education: 'Formación',
      contact: 'Contacto'
    },
    sections: {
      summary: 'Perfil profesional',
      experience: 'Experiencia profesional',
      skills: 'Habilidades técnicas',
      projects: 'Proyectos',
      education: 'Formación académica',
      languages: 'Idiomas',
      contact: 'Contacto'
    },
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    present: 'Actualidad',
    duration(years, months) {
      const parts = []
      if (years) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`)
      if (months) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`)
      return parts.join(' ')
    },
    client: 'Cliente',
    project: 'Proyecto para',
    showDetails: 'Ver detalle',
    hideDetails: 'Ocultar detalle',
    timeline: {
      title: 'Trayectoria',
      education: 'Formación',
      work: 'Experiencia',
      hint: 'Seleccione una etapa para ver su detalle.'
    },
    skillsTable: { area: 'Área', tech: 'Tecnologías' },
    skillsHint: 'Las tecnologías marcadas con • pueden seleccionarse para ver en qué puestos se han utilizado.',
    usedIn: (skill) => `${skill} se ha utilizado en:`,
    filteringBy: 'Experiencia relacionada con',
    clearFilter: 'Quitar filtro',
    contactText:
      'Para oportunidades laborales o colaboración, el medio de contacto preferido es LinkedIn.',
    viewCode: 'Ver código',
    footer: 'Sitio desarrollado con Vue 3 y Vite.'
  },

  profile: {
    name: 'Javier Mercado Velázquez',
    role: 'Ingeniero Backend Senior',
    tagline: 'Java · Spring Boot · AWS · Microservicios · Fintech',
    location: 'Ciudad de México',
    summary: [
      'Ingeniero de software senior full stack con enfoque backend y más de 6 años construyendo microservicios con Java y Spring Boot para banca y financiamiento al consumo, en Santander, Grupo Salinas y la financiera estadounidense Purpose Financial.',
      'Es referente técnico de un equipo de 5 personas, con apoyo en su dirección técnica; antes lideró un equipo de 3 personas en Santander. Entrega servicios de punta a punta: APIs REST, eventos con Kafka, cálculo de pagos, serverless en AWS, OpenShift, Redis, Oracle y CI/CD, además de frontend con React, Angular y Vue.js.'
    ]
  },

  highlights: [
    { value: '6+', label: 'años de experiencia en desarrollo de software' },
    { value: '5,000+', label: 'transacciones diarias en el servicio de abonos bancarios' },
    { value: '5', label: 'integrantes en el equipo donde es referente técnico' },
    { value: '3', label: 'integrantes en el equipo que lideró en Santander' }
  ],

  experience: [
    {
      id: 'gs-senior',
      org: 'grupo-salinas',
      project: 'purpose-financial',
      role: 'Ingeniero Full Stack Senior',
      location: 'Ciudad de México',
      period: ['2024-07', null],
      bullets: [
        'Referente técnico de un equipo de ingeniería de 5 personas: apoya la dirección técnica del equipo, guía las decisiones del día a día y colabora con otros tres equipos de 5 a 8 personas.',
        'Mantiene y mejora el servicio de abonos bancarios (Java, Spring Boot) que procesa más de 5,000 transacciones diarias de cobranza.',
        'Implementó productores y consumidores de Kafka en el bus de eventos centralizado, con contratos AsyncAPI, para publicar las transacciones derivadas de abonos y asegurar la transaccionalidad del flujo del nuevo core de préstamos.',
        'Integró el nuevo core de préstamos con los servicios bancarios mediante una capa multicore que permite que los cores existentes sigan operando junto al nuevo core.',
        'Construyó el host de micro-frontends de la plataforma de sucursales de Purpose Financial, financiera de consumo en EE. UU., estandarizando la operación diaria.',
        'Colaboró en el microservicio de prorrateo y cálculo de pagos que genera la tabla de amortización del cliente, con fórmulas apegadas a la normativa bancaria de EE. UU. para el cálculo del APR.',
        'Desarrolló el módulo de caja (money management) para ingresos, egresos y cargos digitales del cajero, incluido su frontend.',
        'Integró procesos de ingesta y transformación de datos con dbt para construir el lago de datos contable de Purpose Financial.',
        'Implementó flujos serverless (AWS Lambda, Step Functions) para consultas de clientes en tiempo real, reduciendo costos y latencia.',
        'Automatizó pruebas de extremo a extremo con Serenity sobre micro-frontends, APIs y bases de datos.',
        'Integró Cube.js como capa semántica para reportes operativos en tiempo real y construyó tableros de telemetría para la dirección.'
      ],
      tech: [
        'Java',
        'Spring Boot',
        'Microservicios',
        'Kafka',
        'AsyncAPI',
        'Micro-frontends',
        'AWS Lambda',
        'AWS Step Functions',
        'dbt',
        'Serenity',
        'Cube.js'
      ]
    },
    {
      id: 'gft-santander',
      org: 'gft',
      client: 'santander',
      role: 'Ingeniero de Software Backend',
      location: 'Ciudad de México',
      period: ['2020-12', '2024-07'],
      note: 'Inició como trainee; asignado a Banco Santander desde abril de 2021.',
      bullets: [
        'Lideró un equipo de 3 personas que desarrollaba microservicios bancarios para Santander.',
        'Construyó, mantuvo y mejoró microservicios REST de alta transaccionalidad para automatizar procesos bancarios con Java 8 y Spring Boot, integrando bases de datos, servicios de AWS, sistemas internos y servicios de proveedores externos.',
        'Integró soluciones de identidad digital para el banco: reconocimiento facial y validación de identificaciones oficiales con almacenamiento de datos biométricos, y firma autógrafa digital de documentos con validez ante dependencias gubernamentales.',
        'Integró caché con Redis y optimizó consultas en Oracle para reducir la carga de base de datos en servicios de alto tráfico.',
        'Entregó con CI/CD (Git, Jenkins, OpenShift) y filtros de SonarQube y Veracode; implementó bitácoras, auditoría y pruebas unitarias, y gestionó cambios e incidentes en ServiceNow.'
      ],
      tech: [
        'Java',
        'Spring Boot',
        'APIs REST',
        'Microservicios',
        'Oracle Database',
        'Redis',
        'OpenShift',
        'Jenkins',
        'Git',
        'CI/CD',
        'SonarQube',
        'Veracode',
        'JUnit',
        'Mockito'
      ]
    },
    {
      id: 'gs-sql',
      org: 'grupo-salinas',
      role: 'Analista SQL',
      location: 'Ciudad de México',
      period: ['2020-06', '2020-12'],
      bullets: [
        'Desarrolló scripts SQL y diagnosticó incidencias de bases de datos, red y datos en sucursales de todo el país, con soporte remoto vía Remedy.'
      ],
      tech: ['SQL']
    }
  ],

  // Los nombres deben coincidir con los de "tech" en cada puesto para quedar ligados.
  skills: [
    { group: 'Lenguajes', items: ['Java', 'SQL', 'TypeScript', 'JavaScript', 'Python'], note: 'Java 8, 11, 17 y 21' },
    {
      group: 'Backend',
      items: [
        'Spring',
        'Spring Boot',
        'APIs REST',
        'Microservicios',
        'Programación reactiva',
        'Kafka',
        'AMQ',
        'AsyncAPI',
        'Node.js'
      ]
    },
    { group: 'Pruebas', items: ['JUnit', 'Mockito', 'Serenity'], note: 'Automatización end-to-end' },
    {
      group: 'Nube y DevOps',
      items: ['AWS Lambda', 'AWS Step Functions', 'OpenShift', 'Docker (básico)', 'Jenkins', 'CI/CD', 'Git', 'SonarQube', 'Veracode']
    },
    { group: 'Datos', items: ['Oracle Database', 'MySQL', 'Redis', 'dbt', 'Cube.js'] },
    { group: 'Frontend', items: ['React', 'Angular', 'Vue.js', 'Micro-frontends', 'HTML', 'CSS'] }
  ],

  // Proyectos públicos. La sección se oculta mientras la lista esté vacía.
  projects: [],

  education: {
    degree: 'Ingeniería en Computación',
    school: 'Universidad Nacional Autónoma de México',
    campus: 'Facultad de Estudios Superiores Aragón',
    orgs: ['unam', 'fes-aragon'],
    period: ['2016-01', '2020-12'],
    years: '2016 – 2020',
    notes: [
      'Titulado, con cédula profesional.',
      'Dos segundos lugares en hackatones: Nestlé Digital Mom Hack y Hackify Virtual Hack.'
    ]
  },

  languages: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'Nivel profesional' }
  ]
}
