import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  const params = new URLSearchParams(window.location.search)
  const error = params.get('error')

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030712',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '360px',
        background: '#0a0f1a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}></div>

        <h1 style={{
          margin: '0 0 6px',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#f9fafb',
          letterSpacing: '-0.02em',
        }}>
          SEbutkinda
        </h1>

        <p style={{
          margin: '0 0 2rem',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          Stream alerts &amp; overlays, your way
        </p>

        {error && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '12px 16px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#f87171',
          }}>
            Authentication failed. Please try again.
          </div>
        )}

        <a
          href={`${API_URL}/auth/twitch`}
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: '#7c3aed',
            color: '#fff',
            borderRadius: '10px',
            padding: '12px 20px',
            fontWeight: 600,
            fontSize: '0.9375rem',
            textDecoration: 'none',
            transition: 'background 150ms',
            boxSizing: 'border-box',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
          onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
        >
          <svg
            style={{ width: '20px', height: '20px', flexShrink: 0 }}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
          </svg>
          Connect with Twitch
        </a>

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: '#374151',
          lineHeight: '1.5',
        }}>
          We only request the permissions needed to run alerts and the chatbot.
        </p>
      </div>
    </div>
  )
}