// Test harness — candidate doesn't need to edit this file.
import * as candidate from './obstacles.ts'
import type { Rect } from './obstacles.ts'

type Target = { el: () => Element | null; isObstacle: () => boolean }
type Level = { name: string; hint: string; mount: () => Target[] }

const params = new URLSearchParams(location.search)
const LEVEL = Number(params.get('level') ?? 1)
const WATCH = params.get('watch') === '1'
const content = document.getElementById('content')!
for (let i = 0; i < 40; i++) {
  const p = document.createElement('p')
  p.textContent = `Paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  content.appendChild(p)
}

function box(style: string, parent: Element = document.body, tag = 'div', text = '') {
  const el = document.createElement(tag) as HTMLElement
  el.style.cssText = style
  el.textContent = text
  parent.appendChild(el)
  return el
}
const always = (el: Element): Target => ({ el: () => el, isObstacle: () => true })
const never = (el: Element): Target => ({ el: () => el, isObstacle: () => false })
const onScreen = (el: Element) => {
  const r = el.getBoundingClientRect()
  return el.isConnected && r.width > 0 && r.left < innerWidth && r.right > 0 && r.top < innerHeight && r.bottom > 0
}

const LEVELS: Level[] = [
  {
    name: 'Fixed header',
    hint: 'The dark header stays on screen while you scroll. It should be detected.',
    mount: () => [always(box('position:fixed;top:0;left:0;right:0;height:64px;background:#1e293b;color:#fff;padding:0 16px;line-height:64px', document.body, 'header', 'Acme Inc'))],
  },
  {
    name: 'Normal content is not an obstacle',
    hint: 'The blue hero and the yellow badge scroll away with the page. Do not report them.',
    mount: () => [
      never(box('height:240px;background:#e0e7ff;margin-bottom:16px', content, 'section', 'Hero section')),
      never(box('position:absolute;top:90px;right:24px;width:120px;height:40px;background:#fde68a', document.body, 'div', 'abs badge')),
    ],
  },
  {
    name: 'Hidden fixed elements',
    hint: 'There are 4 invisible fixed elements on this page. Do not report them.',
    mount: () => [
      never(box('position:fixed;top:200px;right:0;width:300px;height:300px;background:red;display:none')),
      never(box('position:fixed;top:200px;right:0;width:300px;height:300px;background:red;visibility:hidden')),
      never(box('position:fixed;top:200px;right:0;width:300px;height:300px;background:red;opacity:0')),
      never(box('position:fixed;top:200px;right:0;width:0;height:0;overflow:hidden')),
    ],
  },
  {
    name: 'Chat widget iframe',
    hint: 'A green chat button sits bottom-right. It is an iframe.',
    mount: () => {
      const f = box('position:fixed;bottom:20px;right:20px;width:64px;height:64px;border:0;border-radius:32px;background:#22c55e', document.body, 'iframe') as HTMLIFrameElement
      f.srcdoc = '<body style="margin:0;display:grid;place-items:center;height:100%;font:13px system-ui">Chat</body>'
      return [always(f)]
    },
  },
  {
    name: 'Fixed element nested deep in the DOM',
    hint: 'A dark side nav on the left, nested 8 divs deep.',
    mount: () => {
      let parent: Element = document.body
      for (let i = 0; i < 8; i++) parent = box('', parent)
      return [always(box('position:fixed;top:64px;left:0;bottom:0;width:56px;background:#334155', parent, 'nav'))]
    },
  },
  {
    name: 'Cookie banner appears after 2s',
    hint: 'Wait 2 seconds: a cookie banner shows up at the bottom.',
    mount: () => {
      const el = document.createElement('div')
      el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:80px;background:#0f172a;color:#fff;padding:16px'
      el.textContent = 'We use cookies'
      setTimeout(() => document.body.appendChild(el), 2000)
      return [{ el: () => el, isObstacle: () => el.isConnected }]
    },
  },
  {
    name: 'Sticky sub-nav (only when stuck — scroll down)',
    hint: 'Scroll down until the pink bar sticks under the header. Only then is it an obstacle.',
    mount: () => {
      const el = box('position:sticky;top:64px;height:48px;background:#f472b6;margin:0 -360px', content, 'div', 'Sticky sub-nav')
      content.insertBefore(el, content.children[8])
      return [{ el: () => el, isObstacle: () => Math.abs(el.getBoundingClientRect().top - 64) < 1 }]
    },
  },
  {
    name: 'Transparent click-through overlay',
    hint: 'An invisible full-screen overlay that lets clicks through. Do not report it.',
    mount: () => [never(box('position:fixed;inset:0;pointer-events:none;background:transparent'))],
  },
  {
    name: 'Widget inside Shadow DOM',
    hint: 'A "Support" button bottom-left, inside a web component shadow root.',
    mount: () => {
      const host = box('', document.body, 'x-support-widget')
      const btn = document.createElement('button')
      btn.style.cssText = 'position:fixed;bottom:20px;left:80px;width:120px;height:44px'
      btn.textContent = 'Support'
      host.attachShadow({ mode: 'open' }).appendChild(btn)
      return [always(btn)]
    },
  },
  {
    name: 'Off-screen drawer slides in after 5s',
    hint: 'A cart drawer is hidden off-screen right. After 5s it slides in.',
    mount: () => {
      const el = box('position:fixed;top:64px;right:0;bottom:0;width:300px;background:#a78bfa;transform:translateX(100%);transition:transform .4s', document.body, 'aside', 'Cart drawer')
      setTimeout(() => (el.style.transform = 'none'), 5000)
      return [{ el: () => el, isObstacle: () => onScreen(el) }]
    },
  },
  {
    name: 'Promo bar grows after 3s',
    hint: 'A yellow promo bar near the bottom grows taller after 3s.',
    mount: () => {
      const el = box('position:fixed;bottom:80px;left:0;right:0;height:40px;background:#facc15', document.body, 'div', 'Free shipping!')
      setTimeout(() => (el.style.height = '120px'), 3000)
      return [always(el)]
    },
  },
  {
    name: 'Our own rail is not an obstacle',
    hint: 'The translucent blue panel is the rail itself (data-rail). Do not report it.',
    mount: () => [never(box('position:fixed;top:140px;right:0;width:320px;height:360px;background:rgba(59,130,246,.3)', document.body, 'div', 'Rail'))].map(t => {
      ;(t.el() as HTMLElement).dataset.rail = ''
      return t
    }),
  },
]

// ---- mount + evaluate ----
const targets = LEVELS.slice(0, LEVEL).map(l => l.mount())

const overlay = box('position:fixed;inset:0;pointer-events:none;z-index:2147483647')
overlay.dataset.harness = ''
const panel = box('position:fixed;top:72px;left:50%;transform:translateX(-50%);width:360px;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px 12px;font:13px system-ui;z-index:2147483647;box-shadow:0 4px 12px #0002')
panel.dataset.harness = ''

const near = (a: Rect, r: DOMRect) => Math.abs(a.x - r.left) < 4 && Math.abs(a.y - r.top) < 4 && Math.abs(a.w - r.width) < 4 && Math.abs(a.h - r.height) < 4

let latest: Rect[] = []
let lastHtml = ''
let listOpen = false
panel.addEventListener('toggle', e => (listOpen = (e.target as HTMLDetailsElement).open), true)
let watchError = ''
if (WATCH) {
  try {
    candidate.watchObstacles(rects => (latest = rects))
  } catch (e) {
    watchError = String(e)
  }
}

function evaluate() {
  if (!WATCH) {
    try {
      latest = candidate.findObstacles()
    } catch (e) {
      latest = []
      watchError = String(e)
    }
  }
  overlay.replaceChildren()
  drawRail(latest)
  const matched = new Set<Rect>()
  const results = targets.map(level =>
    level.every(t => {
      const el = t.el()
      const r = el?.getBoundingClientRect()
      const hit = r ? latest.find(a => near(a, r)) : undefined
      if (hit) matched.add(hit)
      const expected = t.isObstacle()
      if (r && expected) draw(r.left, r.top, r.width, r.height, hit ? '3px solid #16a34a' : '3px dashed #dc2626')
      return expected ? Boolean(hit) : !hit
    }),
  )
  for (let i = 1; i < results.length; i++) results[i] &&= results[i - 1]
  for (const a of latest) if (!matched.has(a)) draw(a.x, a.y, a.w, a.h, '3px solid #f97316')
  for (const a of latest) {
    const t = targets.flat().find(t => !t.isObstacle() && t.el() && near(a, t.el()!.getBoundingClientRect()))
    if (t) draw(a.x, a.y, a.w, a.h, '3px solid #f97316')
  }

  const link = (n: number, w = WATCH) => `?level=${n}${w ? '&watch=1' : ''}`
  const btn = (href: string, label: string, primary = false) =>
    `<a href="${href}" style="display:inline-block;padding:6px 12px;border-radius:6px;text-decoration:none;${primary ? 'background:#2563eb;color:#fff' : 'background:#f3f4f6;color:#111'}">${label}</a>`
  const passed = results[LEVEL - 1]
  const allDone = LEVEL === LEVELS.length && passed
  const level = LEVELS[LEVEL - 1]
  const html = `
    <div style="display:flex;justify-content:space-between;color:#6b7280">
      <span>Level ${LEVEL} of ${LEVELS.length}</span>
      <span>${WATCH ? 'Final mode: watchObstacles()' : 'Mode: findObstacles()'}</span>
    </div>
    <div style="font-size:16px;font-weight:600;margin:4px 0">${passed ? '✅' : '❌'} ${level.name}</div>
    <div style="margin-bottom:8px">${level.hint}</div>
    ${!passed && LEVEL > 1 && !results[LEVEL - 2] ? '<div style="color:#dc2626;margin-bottom:8px">An earlier level broke — check the list below.</div>' : ''}
    <div style="display:flex;gap:6px;margin-bottom:8px">
      ${LEVEL > 1 ? btn(link(LEVEL - 1), '← Prev') : ''}
      ${LEVEL < LEVELS.length ? btn(link(LEVEL + 1), 'Next level →', passed) : ''}
      ${allDone && !WATCH ? btn(link(LEVELS.length, true), 'Final: watch mode →', true) : ''}
      ${WATCH ? btn(link(LEVEL, false), 'Back to normal mode') : ''}
    </div>
    ${allDone && WATCH ? '<div style="color:#16a34a;font-weight:600">Everything passes in watch mode.</div>' : ''}
    ${allDone && !WATCH ? '<div style="margin-bottom:8px"><b>Final step:</b> the page keeps changing. Implement <code>watchObstacles()</code> so it stays correct without being polled.</div>' : ''}
    <div style="color:#6b7280">🟩 found · 🟥 missed · 🟧 shouldn't be reported</div>
    <details style="margin-top:6px"${listOpen ? ' open' : ''}><summary>All levels</summary>
      <ol style="margin:6px 0;padding-left:18px">${LEVELS.map((l, i) =>
        `<li><a href="${link(i + 1)}">${l.name}</a> ${i < LEVEL ? (results[i] ? '✅' : '❌') : ''}</li>`).join('')}</ol>
    </details>
    ${watchError ? `<div style="color:#dc2626">Error: ${watchError}</div>` : ''}`
  if (html !== lastHtml) panel.innerHTML = lastHtml = html
}
function drawRail(rects: Rect[]) {
  const W = 320
  let best: { side: 'left' | 'right'; top: number; height: number } | undefined
  for (const side of ['right', 'left'] as const) {
    const x0 = side === 'left' ? 0 : innerWidth - W
    const blocks = rects
      .filter(r => r.x < x0 + W && r.x + r.w > x0)
      .map(r => [Math.max(0, r.y), Math.min(innerHeight, r.y + r.h)])
      .sort((a, b) => a[0] - b[0])
    let cursor = 0
    for (const [s, e] of [...blocks, [innerHeight, innerHeight]]) {
      if (s - cursor > (best?.height ?? 0)) best = { side, top: cursor, height: s - cursor }
      cursor = Math.max(cursor, e)
    }
  }
  const el = box('', overlay)
  if (best && best.height >= 200) {
    el.style.cssText = `position:fixed;${best.side}:0;top:${best.top}px;width:${W}px;height:${best.height}px;background:rgba(37,99,235,.15);border:2px solid #2563eb;box-sizing:border-box;display:grid;place-items:center;font:600 14px system-ui;color:#2563eb;transition:all .2s`
    el.textContent = 'Rail'
  } else {
    el.style.cssText = 'position:fixed;right:16px;bottom:16px;padding:8px 14px;border-radius:99px;background:#2563eb;color:#fff;font:600 13px system-ui'
    el.textContent = 'Rail (collapsed)'
  }
}

function draw(x: number, y: number, w: number, h: number, border: string) {
  box(`position:fixed;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:${border};box-sizing:border-box`, overlay)
}
setInterval(evaluate, 300)
evaluate()
