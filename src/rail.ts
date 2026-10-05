type Rect = { x: number; y: number; w: number; h: number }
type Placement = { side: 'left' | 'right'; top: number; height: number } | 'pill'

// Rail: 320px wide, docked to left or right edge, needs ≥400px free vertical gap. Avoid obstacles.
// Pick the side with the tallest free gap (tie → right). Else 'pill'.
// Hysteresis: if prev was a side, switch only if the other side's gap is ≥50px taller.
export function placeRail(vw: number, vh: number, obstacles: Rect[], prev?: Placement): Placement {
  // TODO
  return 'pill'
}

// expected: { side: 'right', top: 64, height: 736 }
console.log(placeRail(1280, 800, [{ x: 0, y: 0, w: 1280, h: 64 }]))
