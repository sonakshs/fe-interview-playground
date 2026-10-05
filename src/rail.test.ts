import { describe, expect, it } from 'vitest'

import { placeRail } from './rail.ts'

const header = { x: 0, y: 0, w: 1280, h: 64 }

describe('placeRail', () => {
  it('sits below a full-width header, prefers right on tie', () => {
    expect(placeRail(1280, 800, [header])).toEqual({ side: 'right', top: 64, height: 736 })
  })

  it('moves left when a chat bubble blocks the right side', () => {
    const bubble = { x: 1200, y: 700, w: 80, h: 100 }
    expect(placeRail(1280, 800, [bubble])).toEqual({ side: 'left', top: 0, height: 800 })
  })

  it('uses the middle gap between header and footer', () => {
    const top = { x: 0, y: 0, w: 1280, h: 100 }
    const footer = { x: 0, y: 600, w: 1280, h: 200 }
    expect(placeRail(1280, 800, [top, footer])).toEqual({ side: 'right', top: 100, height: 500 })
  })

  it('falls back to pill when no gap is tall enough', () => {
    const leftNav = { x: 0, y: 0, w: 320, h: 800 }
    const banner = { x: 900, y: 300, w: 380, h: 200 }
    expect(placeRail(1280, 800, [leftNav, banner])).toBe('pill')
  })

  it('ignores obstacles outside both rail strips', () => {
    const center = { x: 400, y: 0, w: 400, h: 800 }
    expect(placeRail(1280, 800, [center])).toEqual({ side: 'right', top: 0, height: 800 })
  })

  it('hysteresis: stays left when right is only slightly better', () => {
    const smallLeft = { x: 0, y: 764, w: 100, h: 36 }
    const obstacles = [header, smallLeft]
    expect(placeRail(1280, 800, obstacles)).toEqual({ side: 'right', top: 64, height: 736 })
    const prev = { side: 'left', top: 64, height: 700 } as const
    expect(placeRail(1280, 800, obstacles, prev)).toEqual({ side: 'left', top: 64, height: 700 })
  })
})
