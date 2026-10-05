import { getToken, openStream } from './mock.ts'

export type Status = 'idle' | 'connecting' | 'listening'

// start(): fetch a token, then open a stream with it.
// stop(): close the stream.
export function useVoiceInput() {
  // TODO
  return {
    start: () => {},
    stop: () => {},
    transcript: '',
    status: 'idle' as Status,
  }
}
