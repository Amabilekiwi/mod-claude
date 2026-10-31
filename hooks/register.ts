import type { Register } from 'claude-code'

const SYSTEM = `Riscrivi la richiesta dell'utente perché un assistente la capisca al primo colpo.
Regole:
- Mantieni lingua, intento e ogni dettaglio concreto (nomi, URL, numeri, file).
- Correggi errori di battitura, rendi esplicito l'obiettivo, separa richieste multiple in punti.
- Non aggiungere requisiti, ipotesi o dati che l'utente non ha scritto.
- Se la richiesta è già chiara o è brevissima (un sì, un no, un ok), restituiscila identica.
Rispondi solo con la richiesta riscritta, senza preamboli.`

// Messaggio della persona dentro una "wake" di progetto: solo quello con trigger e trust principal.
const WAKE_MSG = /<message\b[^>]*\btrigger="true"[^>]*\btrust="principal"[^>]*>([\s\S]*?)<\/message>/

const SKIP = new Set(['plugin', 'task-notification', 'peer', 'peer-send-message', 'observer', 'observer-activity', 'scheduled-trigger', 'auto-continuation'])

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (e.command || e.isMeta || SKIP.has(e.origin.kind)) return next(e)

    const isWake = e.text.includes('<wake')
    const original = isWake ? e.text.match(WAKE_MSG)?.[1]?.trim() : e.text.trim()
    if (!original || original.length < 15) return next(e)

    const r = await $.model.complete({
      model: 'haiku',
      system: SYSTEM,
      prompt: original,
      maxTokens: 1500,
      effort: 'low',
      timeoutMs: 15000,
    })
    if (!r.isAnswered) return next(e)

    const refined = r.text.trim()
    if (!refined || refined === original) return next(e)

    $.ui.status('snella: prompt sistemato da Haiku')
    const note = `Versione riformulata da Haiku (mod "snella") della richiesta dell'utente. Usala per capire meglio cosa chiede; se contraddice l'originale, vale l'originale.\n\n${refined}`
    return next({ ...e, context: [...(e.context ?? []), note] })
  })
}
