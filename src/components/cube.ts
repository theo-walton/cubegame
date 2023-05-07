import {
  BackSide,
  BoxGeometry,
  BufferGeometry,
  Camera,
  Color,
  ColorRepresentation,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  FrontSide,
  Group,
  Matrix3,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Quaternion,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
} from "three";
import stateManager from "@/store/state";
export class Cube {
  group: Group;
  rotationVelocity: Quaternion = new Quaternion();

  constructor() {
    this.group = new Group();
    this.group.name = "the cube";

    this.makeFace(
      [
        new Vector3(1, -1, 1),
        new Vector3(1, 1, 1),
        new Vector3(-1, -1, 1),
        new Vector3(1, 1, 1),
        new Vector3(-1, 1, 1),
        new Vector3(-1, -1, 1),
      ],
      "red",
      "red"
    );

    this.makeFace(
      [
        new Vector3(1, 1, -1),
        new Vector3(1, -1, -1),
        new Vector3(-1, -1, -1),
        new Vector3(1, 1, -1),
        new Vector3(-1, -1, -1),
        new Vector3(-1, 1, -1),
      ],
      "blue",
      "blue"
    );

    this.makeFace(
      [
        new Vector3(-1, 1, 1),
        new Vector3(-1, 1, -1),
        new Vector3(-1, -1, -1),
        new Vector3(-1, 1, 1),
        new Vector3(-1, -1, -1),
        new Vector3(-1, -1, 1),
      ],
      "green",
      "green"
    );

    this.makeFace(
      [
        new Vector3(1, 1, 1),
        new Vector3(1, -1, -1),
        new Vector3(1, 1, -1),
        new Vector3(1, 1, 1),
        new Vector3(1, -1, 1),
        new Vector3(1, -1, -1),
      ],
      "yellow",
      "yellow"
    );

    this.makeFace(
      [
        new Vector3(1, 1, 1),
        new Vector3(1, 1, -1),
        new Vector3(-1, 1, -1),
        new Vector3(1, 1, 1),
        new Vector3(-1, 1, -1),
        new Vector3(-1, 1, 1),
      ],
      "white",
      "white"
    );

    this.makeFace(
      [
        new Vector3(1, -1, 1),
        new Vector3(-1, -1, -1),
        new Vector3(1, -1, -1),
        new Vector3(1, -1, 1),
        new Vector3(-1, -1, 1),
        new Vector3(-1, -1, -1),
      ],
      "black",
      "black"
    );
  }

  makeFace(points: Vector3[], color: ColorRepresentation, name: string) {
    const buffer = new BufferGeometry().setFromPoints(points);
    buffer.computeVertexNormals();
    const mesh = new Mesh(
      buffer,
      new MeshPhongMaterial({ color: color, side: FrontSide })
    );
    mesh.name = name;
    this.group.add(mesh);
  }

  private applyForceToCube(position: Vector3) {
    // NOTE: cube is centered at origin
    // NOTE: Z axis goes into the screen, Y is up
    const factor = 1;
    const rotationPower = new Quaternion().setFromAxisAngle(
      new Vector3(-position.y, position.x).normalize(),
      factor * new Vector2(position.x, position.y).length()
    );
    this.rotationVelocity.slerp(rotationPower, 0.5);
  }

  // TODO: make this based on frame rate?
  tick() {
    this.rotationVelocity.slerp(new Quaternion(), 0.01).normalize();

    // apply extra dampening if moving slow
    const stopThreshold = 1;
    const angleToStopped = this.rotationVelocity.angleTo(new Quaternion());
    if (angleToStopped < stopThreshold) {
      const dampeningEffect = Math.pow(
        (stopThreshold - angleToStopped) / stopThreshold,
        1000
      );
      this.rotationVelocity.slerp(new Quaternion(), dampeningEffect);
    }

    // rotate cube based on rotation velocity
    this.group.quaternion
      .copy(this.rotationVelocity.clone().multiply(this.group.quaternion))
      .normalize();
  }

  raycastCube(normalizedPosition: Vector2, camera: Camera): void {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(normalizedPosition, camera);
    const intersects = raycaster.intersectObjects(this.group.children);
    if (intersects.length) {
      this.applyForceToCube(intersects[0].point);
      const name = intersects[0].object.name;
      switch (name) {
        case "red":
          stateManager.state.primitives.red += 1;
          break;
        case "blue":
          stateManager.state.primitives.blue += 1;
          break;
        case "green":
          stateManager.state.primitives.green += 1;
          break;
        case "yellow":
          stateManager.state.primitives.yellow += 1;
          break;
        case "white":
          stateManager.state.primitives.white += 1;
          break;
        case "black":
          stateManager.state.primitives.black += 1;
          break;
        default:
          console.error("unsupported raycast type");
      }
    }
  }
}
