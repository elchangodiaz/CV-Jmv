// Convierte el contenido del CV (src/content/es.js o en.js) en texto plano.
// Lo usa el servidor de la IA como única fuente de información sobre el perfil.
export function buildCvText(c, orgNames, links) {
  const period = ([start, end]) => `${start} – ${end ?? c.ui.present}`
  const lines = []
  const p = c.profile

  lines.push(`# ${p.name} — ${p.role}`, p.tagline, p.location, '', ...p.summary, '')
  lines.push(...c.highlights.map((h) => `- ${h.value} ${h.label}`), '')

  lines.push(`## ${c.ui.sections.experience}`)
  for (const job of c.experience) {
    const related = job.client
      ? ` (${c.ui.client}: ${orgNames[job.client]})`
      : job.project
        ? ` (${c.ui.project} ${orgNames[job.project]})`
        : ''
    lines.push('', `### ${job.role} — ${orgNames[job.org]}${related} · ${job.location} · ${period(job.period)}`)
    if (job.note) lines.push(job.note)
    lines.push(...job.bullets.map((b) => `- ${b}`))
    lines.push(`${c.ui.skillsTable.tech}: ${job.tech.join(', ')}`)
  }

  lines.push('', `## ${c.ui.sections.skills}`)
  for (const group of c.skills) {
    lines.push(`- ${group.group}: ${group.items.join(', ')}${group.note ? ` (${group.note})` : ''}`)
  }

  if (c.projects.length) {
    lines.push('', `## ${c.ui.sections.projects}`)
    for (const project of c.projects) lines.push(`- ${project.name}: ${project.description ?? ''}`)
  }

  const e = c.education
  lines.push('', `## ${c.ui.sections.education}`, `${e.degree} — ${e.school}, ${e.campus} (${e.years})`)
  lines.push(...e.notes.map((n) => `- ${n}`))

  lines.push('', `## ${c.ui.sections.languages}`, ...c.languages.map((l) => `- ${l.name}: ${l.level}`))
  lines.push('', `## ${c.ui.sections.contact}`, `LinkedIn: ${links.linkedin}`, `GitHub: ${links.github}`)

  return lines.join('\n')
}

// Todas las habilidades de la tabla, con su nombre exacto.
export const allSkills = (c) => c.skills.flatMap((group) => group.items)
