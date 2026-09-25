import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, RotateCw } from 'lucide-react';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';

export default function VerifyOtp() {
  const { reference = '' } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState(sessionStorage.getItem('yc_demo_otp') || '');
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => { const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, []);
  function onChange(index: number, value: string) { const clean = value.replace(/\D/g, ''); if (!clean) { setDigits((old) => old.map((item, i) => i === index ? '' : item)); return; } const chars = clean.slice(-6).split(''); setDigits((old) => old.map((item, i) => i >= index && i < index + chars.length ? chars[i - index] : item)); refs.current[Math.min(index + chars.length, 5)]?.focus(); }
  function onKey(index: number, event: KeyboardEvent<HTMLInputElement>) { if (event.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus(); if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus(); if (event.key === 'ArrowRight' && index < 5) refs.current[index + 1]?.focus(); }
  function onPaste(event: ClipboardEvent<HTMLInputElement>) { const value = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6); if (value) { event.preventDefault(); setDigits([...value.padEnd(6, ' ').slice(0, 6)].map((char) => char.trim())); refs.current[Math.min(value.length, 5)]?.focus(); } }
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setBusy(true); try { await api.verify(reference, digits.join('')); sessionStorage.removeItem('yc_demo_otp'); navigate(`/track/${encodeURIComponent(reference)}`); } catch (err) { setError(err instanceof Error ? err.message : t.failed); } finally { setBusy(false); } }
  async function resend() { if (cooldown > 0) return; setError(''); try { const result = await api.resendOtp(reference); if (result.demo_otp) { setDemoOtp(result.demo_otp); sessionStorage.setItem('yc_demo_otp', result.demo_otp); } setCooldown(30); } catch (err) { setError(err instanceof Error ? err.message : t.failed); } }
  return <div className="verify-page"><div className="verify-card glass-card"><div className="verify-icon"><CheckCircle2 size={30} /></div><span className="eyebrow">ONE LAST STEP</span><h1>{t.verifyTitle}</h1><p>{t.verifyCopy}</p><div className="reference-chip">ORDER · {reference}</div>{demoOtp && <div className="demo-code-note">Demo verification code <b>{demoOtp}</b></div>}<form onSubmit={submit}><div className="otp-inputs" role="group" aria-label="6 digit verification code">{digits.map((digit, index) => <input key={index} ref={(element) => { refs.current[index] = element; }} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} aria-label={`Digit ${index + 1}`} maxLength={6} value={digit} onChange={(event) => onChange(index, event.target.value)} onKeyDown={(event) => onKey(index, event)} onPaste={onPaste} required />)}</div>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button full" disabled={busy || digits.some((digit) => !digit)}>{busy ? 'Verifying…' : t.verify}</button></form><button className="resend-button" onClick={resend} disabled={cooldown > 0}><RotateCw size={14} />{cooldown > 0 ? `${t.resend} in 00:${String(cooldown).padStart(2, '0')}` : t.resend}</button><Link to="/" className="text-link centered-link">{t.back}</Link></div></div>;
}
