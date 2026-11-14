// Fechas en formato 'AAAA-MM'. Un final null significa "hasta hoy".

export function toMonthIndex(ym) {
  if (!ym) {
    const now = new Date()
    return now.getFullYear() * 12 + now.getMonth()
  }
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

export function formatMonth(ym, months) {
  const [y, m] = ym.split('-').map(Number)
  return `${months[m - 1]} ${y}`
}

export function formatPeriod([start, end], ui) {
  return `${formatMonth(start, ui.months)} – ${end ? formatMonth(end, ui.months) : ui.present}`
}

export function formatDuration([start, end], ui) {
  const total = Math.max(1, toMonthIndex(end) - toMonthIndex(start))
  return ui.duration(Math.floor(total / 12), total % 12)
}
