export const getToken = () =>
  new Promise<string>(r => setTimeout(() => r(`tok_${Date.now()}`), 200 + Math.random() * 1500))

export function openStream(token: string, onText: (t: string) => void) {
  let n = 0
  const id = setInterval(() => onText(`${token}: word ${++n}`), 300)
  return { close: () => clearInterval(id) }
}
