export default {
  meta: {
    title: 'Javier Mercado Velázquez | Senior Backend Engineer',
    description:
      'Senior full-stack software engineer with a backend focus and 6+ years building Java and Spring Boot microservices for banking and consumer finance.'
  },

  ui: {
    skipLink: 'Skip to content',
    langName: 'English',
    nav: {
      summary: 'Profile',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      education: 'Education',
      contact: 'Contact'
    },
    sections: {
      summary: 'Professional Summary',
      experience: 'Professional Experience',
      skills: 'Technical Skills',
      projects: 'Projects',
      education: 'Education',
      languages: 'Languages',
      contact: 'Contact'
    },
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    present: 'Present',
    duration(years, months) {
      const parts = []
      if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`)
      if (months) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`)
      return parts.join(' ')
    },
    client: 'Client',
    project: 'Project for',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    timeline: {
      title: 'Career path',
      education: 'Education',
      work: 'Experience',
      hint: 'Select a stage to see its details.'
    },
    skillsTable: { area: 'Area', tech: 'Technologies' },
    skillsHint: 'Technologies marked with • can be selected to see the roles where they were used.',
    usedIn: (skill) => `${skill} was used in:`,
    filteringBy: 'Experience related to',
    clearFilter: 'Clear filter',
    contactText: 'For job opportunities or collaboration, LinkedIn is the preferred contact channel.',
    viewCode: 'View code',
    footer: 'Built with Vue 3 and Vite.'
  },

  profile: {
    name: 'Javier Mercado Velázquez',
    role: 'Senior Backend Engineer',
    tagline: 'Java · Spring Boot · AWS · Microservices · Fintech',
    location: 'Mexico City, Mexico',
    summary: [
      'Senior full-stack software engineer with a backend focus and 6+ years building Java and Spring Boot microservices for banking and consumer finance, across Santander, Grupo Salinas and U.S. consumer finance company Purpose Financial.',
      'Technical go-to on a 5-person team, supporting its technical direction; previously led a 3-person team at Santander. Delivers services end to end: REST APIs, Kafka events, payment calculations, AWS serverless, OpenShift, Redis, Oracle and CI/CD, plus frontend work in React, Angular and Vue.js.'
    ]
  },

  highlights: [
    { value: '6+', label: 'years of software development experience' },
    { value: '5,000+', label: 'daily transactions in the bank payments service' },
    { value: '5', label: 'engineers on the current team, as technical go-to' },
    { value: '3', label: 'engineers on the team led at Santander' }
  ],

  experience: [
    {
      id: 'gs-senior',
      org: 'grupo-salinas',
      project: 'purpose-financial',
      role: 'Senior Full Stack Engineer',
      location: 'Mexico City, Mexico',
      period: ['2024-07', null],
      bullets: [
        "Technical go-to on a 5-person engineering team: supports the team's technical direction, guides day-to-day decisions and collaborates with three other teams of 5-8.",
        'Maintains and enhances the bank payments service (Java, Spring Boot) processing 5,000+ debt collection transactions per day.',
        'Implemented Kafka producers and consumers on the centralized event bus, with AsyncAPI contracts, to publish payment-derived transactions and ensure transactional consistency in the new loan core flow.',
        'Integrated the new loan core with banking services through a multi-core layer, so existing cores keep operating alongside it.',
        'Built the micro-frontend host for the branch platform of Purpose Financial, a U.S. consumer lender, standardizing operations.',
        'Contributed to the payment allocation and calculation microservice that generates customer amortization schedules, with formulas aligned to U.S. lending regulations for APR.',
        'Developed the teller cash management module for cash inflows, outflows and digital charges, including its frontend.',
        "Integrated data ingestion and transformation pipelines with dbt to build Purpose Financial's accounting data lake.",
        'Implemented AWS Lambda and Step Functions workflows for real-time customer queries, lowering costs and latency.',
        'Automated end-to-end tests with Serenity across micro-frontends, APIs and databases.',
        'Integrated Cube.js as a semantic layer for real-time operational reporting and built telemetry dashboards for leadership.'
      ],
      tech: [
        'Java',
        'Spring Boot',
        'Microservices',
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
      role: 'Backend Software Engineer',
      location: 'Mexico City, Mexico',
      period: ['2020-12', '2024-07'],
      note: 'Started as a trainee; assigned to Banco Santander in April 2021.',
      bullets: [
        'Led a 3-person team delivering banking microservices for Santander.',
        'Built and maintained high-transaction REST microservices for banking automation with Java 8 and Spring Boot, integrating databases, AWS services, internal systems and third-party vendor services.',
        'Integrated digital identity solutions for the bank: facial recognition and government ID validation with biometric data storage, and digital handwritten signatures for documents legally valid with Mexican government agencies.',
        'Integrated Redis caching and optimized Oracle queries to reduce database load in high-traffic services.',
        'Delivered through CI/CD (Git, Jenkins, OpenShift) with SonarQube and Veracode gates; implemented logging, audit trails and unit tests, and managed changes and incidents in ServiceNow.'
      ],
      tech: [
        'Java',
        'Spring Boot',
        'REST APIs',
        'Microservices',
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
      role: 'SQL Analyst',
      location: 'Mexico City, Mexico',
      period: ['2020-06', '2020-12'],
      bullets: [
        'Wrote SQL scripts and diagnosed database, network and data issues for branches nationwide via Remedy.'
      ],
      tech: ['SQL']
    }
  ],

  // Names must match the "tech" lists of each role to stay linked.
  skills: [
    { group: 'Languages', items: ['Java', 'SQL', 'TypeScript', 'JavaScript', 'Python'], note: 'Java 8, 11, 17 and 21' },
    {
      group: 'Backend',
      items: [
        'Spring',
        'Spring Boot',
        'REST APIs',
        'Microservices',
        'Reactive programming',
        'Kafka',
        'AMQ',
        'AsyncAPI',
        'Node.js'
      ]
    },
    { group: 'Testing', items: ['JUnit', 'Mockito', 'Serenity'], note: 'End-to-end automation' },
    {
      group: 'Cloud and DevOps',
      items: ['AWS Lambda', 'AWS Step Functions', 'OpenShift', 'Docker (basic)', 'Jenkins', 'CI/CD', 'Git', 'SonarQube', 'Veracode']
    },
    { group: 'Data', items: ['Oracle Database', 'MySQL', 'Redis', 'dbt', 'Cube.js'] },
    { group: 'Frontend', items: ['React', 'Angular', 'Vue.js', 'Micro-frontends', 'HTML', 'CSS'] }
  ],

  // Public projects. The section stays hidden while the list is empty.
  projects: [],

  education: {
    degree: "Bachelor's Degree in Computer Engineering",
    school: 'National Autonomous University of Mexico (UNAM)',
    campus: 'FES Aragón',
    orgs: ['unam', 'fes-aragon'],
    period: ['2016-01', '2020-12'],
    years: '2016 – 2020',
    notes: [
      'Degree awarded (título) and Mexican federal professional license (cédula profesional).',
      'Two second-place hackathon finishes: Nestlé Digital Mom Hack and Hackify Virtual Hack.'
    ]
  },

  languages: [
    { name: 'English', level: 'Professional working proficiency' },
    { name: 'Spanish', level: 'Native' }
  ]
}
