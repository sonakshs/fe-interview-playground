export type Rect = { x: number; y: number; w: number; h: number }

// The rail is embedded on a customer's site. Return every element that would
// visually block it (in viewport coordinates).
// Ignore anything inside [data-harness] — that's the test UI.
export function findObstacles(): Rect[] {
  // TODO
  return []
}

// Final step (the playground tells you when): keep the list up to date as the page changes. Return a cleanup fn.
export function watchObstacles(onChange: (rects: Rect[]) => void): () => void {
  onChange(findObstacles())
  return () => {}
}
