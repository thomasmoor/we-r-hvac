'use client'

import { useState, type FormEvent } from 'react'
import { usePathname } from 'next/navigation'

type Props = {
  services: string[]
  title?: string
  subtitle?: string
  note?: string
  phone: string
  tel: string
  companyName: string
  web3formsKey: string
  id?: string
}

const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1'

export function QuoteForm({ services, title, subtitle, note, phone, tel, companyName, web3formsKey, id = 'quote' }: Props) {
  const pathname = usePathname()
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')
  const liveFormReady = !STATIC || Boolean(web3formsKey)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const data = Object.fromEntries(fd.entries()) as Record<string, string>

    // Honeypot: bots fill hidden fields; pretend success and drop it.
    if (data.botcheck) {
      setState('ok')
      return
    }
    delete data.botcheck
    setState('sending')
    setError('')

    try {
      let ok = false
      if (STATIC) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New ${data.when || ''} service request – ${companyName}`.replace(/\s+/g, ' '),
            from_name: `${companyName} website`,
            replyto: data.email,
            ...data,
            page: pathname,
          }),
        })
        const json = await res.json().catch(() => ({}))
        ok = res.ok && json.success !== false
        if (!ok) setError(json.message || '')
      } else {
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, page: pathname }),
        })
        ok = res.ok
      }
      if (ok) {
        setState('ok')
        form.reset()
      } else setState('error')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="form-card" id={id}>
      {title && <h3 className="form-title">{title}</h3>}
      {subtitle && <p className="form-subtitle">{subtitle}</p>}

      {state === 'ok' ? (
        <div className="form-success" role="status">
          <strong>Thank you!</strong> Your request has been sent. We will contact you shortly. For urgent
          problems call <a href={tel}>{phone}</a>.
        </div>
      ) : !liveFormReady ? (
        <div className="form-success" role="status">
          Online requests are not active yet. Please call <a href={tel}>{phone}</a>.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="quote-form" noValidate={false}>
          <div className="field">
            <label htmlFor={`${id}-name`}>Name</label>
            <input id={`${id}-name`} name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor={`${id}-phone`}>Phone</label>
              <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" required />
            </div>
            <div className="field">
              <label htmlFor={`${id}-email`}>eMail</label>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor={`${id}-service`}>Service</label>
              <select id={`${id}-service`} name="service" required defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
                <option>Other / not sure</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor={`${id}-when`}>When do you need it?</label>
              <select id={`${id}-when`} name="when" required defaultValue="">
                <option value="" disabled>
                  Choose
                </option>
                <option>Emergency</option>
                <option>This week</option>
                <option>This month</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${id}-message`}>Message</label>
            <textarea id={`${id}-message`} name="message" rows={3} />
          </div>
          {/* honeypot */}
          <div className="hp" aria-hidden="true">
            <label>
              Leave this empty
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button type="submit" className="btn btn-accent btn-block" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send request'}
          </button>
          {state === 'error' && (
            <p className="form-error" role="alert">
              Sorry, something went wrong{error ? ` (${error})` : ''}. Please call <a href={tel}>{phone}</a>.
            </p>
          )}
          {note && <p className="form-note">{note}</p>}
        </form>
      )}
    </div>
  )
}
