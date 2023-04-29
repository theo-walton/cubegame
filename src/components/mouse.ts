import { Vector2 } from "three";

export class Mouse {
  private pointer: Vector2 = new Vector2();

  constructor(window: Window) {
    window.addEventListener("pointermove", (event) => {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  get normalizedPosition(): Vector2 {
    return this.pointer;
  }
}
