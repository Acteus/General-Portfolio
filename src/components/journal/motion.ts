export interface TurnProgress {
  angle: number;
  transformOrigin: string;
}

function matrixAngle(values: number[]) {
  return Math.atan2(values[8], values[0]) * (180 / Math.PI);
}

export function readTurnProgress(transform: string | null, transformOrigin: string | null): TurnProgress | null {
  if (!transform || transform === 'none') return null;
  const values = transform.match(/matrix3d\(([^)]+)\)/)?.[1]?.split(',').map(Number)
    ?? transform.match(/matrix\(([^)]+)\)/)?.[1]?.split(',').map(Number);
  if (!values || values.some((value) => !Number.isFinite(value))) return null;
  const angle = values.length === 16 ? matrixAngle(values) : Math.atan2(values[1], values[0]) * (180 / Math.PI);
  return { angle, transformOrigin: transformOrigin || 'center center' };
}

export function turnKeyframes(progress: TurnProgress | null, direction: -1 | 1) {
  const start = progress?.angle ?? 0;
  const requestedEnd = direction > 0 ? -180 : 180;
  // A reverse request can arrive while the leaf is past zero in the old
  // direction. Use the equivalent signed endpoint to avoid a long 300°+
  // interpolation through the opposite side of the book.
  const end = start < 0 && requestedEnd > 0 ? -180 : start > 0 && requestedEnd < 0 ? 180 : requestedEnd;
  return [`rotateY(${start}deg)`, `rotateY(${end}deg)`];
}
