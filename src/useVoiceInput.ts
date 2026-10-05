import { useRef, useState } from 'react'

import { getToken, openStream } from './mock.ts'

export type Status = 'idle' | 'connecting' | 'listening'

// Works when you click slowly. Click Start → Stop → Start quickly and watch the transcript.
export function useVoiceInput() {
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const streamRef = useRef<{ close: () => void } | undefined>(undefined)

  async function start() {
    setStatus('connecting')
    const token = await getToken()
    streamRef.current = openStream(token, text => setTranscript(t => t + text + '\n'))
    setStatus('listening')
  }

  function stop() {
    streamRef.current?.close()
    setStatus('idle')
  }

  return { start, stop, transcript, status }
}
