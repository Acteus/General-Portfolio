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
  const end = direction > 0 ? -180 : 180;
  return [`rotateY(${start}deg)`, `rotateY(${end}deg)`];
}
