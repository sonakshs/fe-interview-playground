import { useVoiceInput } from './useVoiceInput.ts'

const card = { border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 16 }
const tag = { fontSize: 12, color: '#6b7280' }

export default function App() {
  const { start, stop, transcript, status } = useVoiceInput()
  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'system-ui', padding: '0 16px' }}>
      <h1>FE Interview Playground</h1>

      <section style={card}>
        <div style={tag}>Task 1 · edit src/useVoiceInput.ts</div>
        <h2 style={{ marginTop: 4 }}>Voice input</h2>
        <button onClick={start}>Start</button> <button onClick={stop}>Stop</button>{' '}
        <span style={{ padding: '2px 8px', borderRadius: 99, background: '#f3f4f6' }}>{status}</span>
        <pre style={{ background: '#f9fafb', padding: 12, minHeight: 60, whiteSpace: 'pre-wrap' }}>
          {transcript || '(transcript appears here)'}
        </pre>
      </section>

      <section style={card}>
        <div style={tag}>Task 2 · edit src/rail.ts</div>
        <h2 style={{ marginTop: 4 }}>Rail placement</h2>
        Run <code>npm test</code> in the terminal.
      </section>

      <section style={card}>
        <div style={tag}>Task 3 · edit src/obstacles.ts</div>
        <h2 style={{ marginTop: 4 }}>Obstacle detection</h2>
        <a href="/host.html">Open playground →</a>
      </section>
    </div>
  )
}
