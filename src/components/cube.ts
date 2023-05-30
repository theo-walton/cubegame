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
import {
  Spin,
  applyDynamicDrag,
  applyStaticDrag,
  combineSpin,
  getSpinQuaternion,
  makeSpin,
} from "@/math/rotation";

export class Cube {
  group: Group;
  spin: Spin = makeSpin();

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
    const spinFactor = 0.01;

    this.spin = combineSpin(this.spin, {
      direction: new Vector2(position.x, position.y).multiplyScalar(spinFactor),
    });
  }

  // TODO: make this based on frame rate?
  tick() {
    this.spin = applyStaticDrag(
      this.spin,
      stateManager.state.cubeProperties.staticDrag
    );

    this.spin = applyDynamicDrag(
      this.spin,
      stateManager.state.cubeProperties.dynamicDrag
    );

    stateManager.state.cubeProperties.spinSpeed = this.spin.direction.length();

    // rotate cube based on rotation velocity
    const rotation = getSpinQuaternion(this.spin);

    this.group.quaternion
      .copy(rotation.multiply(this.group.quaternion))
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
          stateManager.state.currency.red += 1;
          break;
        case "blue":
          stateManager.state.currency.blue += 1;
          break;
        case "green":
          stateManager.state.currency.green += 1;
          break;
        case "yellow":
          stateManager.state.currency.yellow += 1;
          break;
        case "white":
          stateManager.state.currency.white += 1;
          break;
        case "black":
          stateManager.state.currency.black += 1;
          break;
        default:
          console.error("unsupported raycast type");
      }
    }
  }
}
