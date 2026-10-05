let count = 0

// Takes 0.2–1.7s. Each call returns the next session name: "Session 1", "Session 2", ...
export const getToken = () => {
  const token = `Session ${++count}`
  return new Promise<string>(r => setTimeout(() => r(token), 200 + Math.random() * 1500))
}

const words = ['hello', 'how', 'are', 'you', 'doing', 'today']

// Sends one word every 300ms until closed.
export function openStream(token: string, onText: (text: string) => void) {
  let i = 0
  const id = setInterval(() => onText(`${token}: ${words[i++ % words.length]}`), 300)
  return { close: () => clearInterval(id) }
}
