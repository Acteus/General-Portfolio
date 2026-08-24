import { describe, expect, it } from 'vitest';
import { readTurnProgress, turnKeyframes } from '../../src/components/journal/motion';

describe('journal turn continuity', () => {
  it('converts a computed matrix into compatible angle keyframes and preserves its pivot', () => {
    const progress = readTurnProgress('matrix3d(0.7071, 0, -0.7071, 0, 0, 1, 0, 0, 0.7071, 0, 0.7071, 0, 0, 0, 0, 1)', 'left center');
    expect(progress?.angle).toBeCloseTo(45, 1);
    expect(progress?.transformOrigin).toBe('left center');
    expect(turnKeyframes(progress, -1)).toEqual(['rotateY(45deg)', 'rotateY(180deg)']);
  });

  it('uses the equivalent signed endpoint when reversing a negative in-flight turn', () => {
    const keyframes = turnKeyframes({ angle: -142, transformOrigin: 'left center' }, -1);
    expect(keyframes).toEqual(['rotateY(-142deg)', 'rotateY(-180deg)']);
    expect(Number.parseFloat(keyframes.at(-1)!.match(/-?\d+/)![0])).toBe(-180);
  });
});
