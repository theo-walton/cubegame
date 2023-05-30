import { Quaternion, Vector2, Vector3 } from "three";

// a spin is a "rotation" applied "speed" number of times
export interface Spin {
  direction: Vector2;
}

export function makeSpin(): Spin {
  return {
    direction: new Vector2(),
  };
}

export function getSpinQuaternion(spin: Spin): Quaternion {
  const speed = spin.direction.length();
  return new Quaternion().setFromAxisAngle(
    new Vector3(-spin.direction.y, spin.direction.x).normalize(),
    speed
  );
}

export function combineSpin(spin1: Spin, spin2: Spin): Spin {
  return {
    direction: spin1.direction.add(spin2.direction),
  };
}

export function applyStaticDrag(spin: Spin, drag: number): Spin {
  if (drag == 0 || isNaN(drag)) {
    return { direction: spin.direction.clone() };
  }
  const speed = spin.direction.length();
  const newSpeed = Math.max(speed - drag, 0);
  return {
    direction: spin.direction.clone().normalize().multiplyScalar(newSpeed),
  };
}

// assumes drag is between 0-1
export function applyDynamicDrag(spin: Spin, drag: number): Spin {
  if (drag == 0 || isNaN(drag)) {
    return { direction: spin.direction.clone() };
  }
  const speed = spin.direction.length();
  const newSpeed = speed - speed * drag;
  return {
    direction: spin.direction.clone().normalize().multiplyScalar(newSpeed),
  };
}
