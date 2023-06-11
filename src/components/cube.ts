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
  HSL,
  Line,
  LineBasicMaterial,
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
import { addCubePointsWithMultipliers } from "@/currency/currency";

export class Cube {
  cubeGroup: Group;
  debugGroup: Group;
  spin: Spin = makeSpin();
  lastFaceClicked = "";
  faceMaterials: Map<string, MeshPhongMaterial> = new Map();

  constructor() {
    this.cubeGroup = new Group();
    this.cubeGroup.name = "the cube";

    this.debugGroup = new Group();
    this.debugGroup.name = "debug";

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
    const material = new MeshPhongMaterial({ color: color, side: FrontSide });
    this.faceMaterials.set(name, material);
    const mesh = new Mesh(
      buffer,
      material,
    );
    mesh.name = name;
    this.cubeGroup.add(mesh);
  }

  private applyForceToCube(position: Vector3) {
    // NOTE: cube is centered at origin
    // NOTE: Z axis goes into the screen, Y is up
    const spinFactor = stateManager.state.upgrades.clickPower;

    this.spin = combineSpin(this.spin, {
      direction: new Vector2(position.x, position.y).multiplyScalar(spinFactor),
    });
  }

  debugCubeAxis() {
    const quat = this.cubeGroup.quaternion;
    const points = [];
    const quat2 = getSpinQuaternion(this.spin);
    points.push( new Vector3( 0, 0, 0 ) );
    points.push( new Vector3( Math.abs(quat.x), Math.abs(quat.y), Math.abs(quat.z) ).multiplyScalar(100) );
    points.push( new Vector3( 0, 0, 0 ) );
    points.push( new Vector3( Math.abs(quat2.x), Math.abs(quat2.y), Math.abs(quat2.z) ).multiplyScalar(100) );
    const geometry = new BufferGeometry().setFromPoints( points );
    const material = new LineBasicMaterial( { color: 0x0000ff } );
    const line = new Line( geometry, material );
    this.debugGroup.remove(this.debugGroup.children[0]);
    this.debugGroup.add(line);
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
    const rclone = rotation.clone();

    this.cubeGroup.quaternion
      .copy(rotation.multiply(this.cubeGroup.quaternion))
      .normalize();

    const regular = this.cubeGroup.quaternion;
    const invert = this.cubeGroup.quaternion.clone().invert();
    const result = new Quaternion().multiply(invert).multiply(rclone).multiply(regular);
    console.log(result.x.toPrecision(2), result.y.toPrecision(2), result.z.toPrecision(2));

    // this.debugCubeAxis();
  }

  modifyCombo(faceClicked: string) {
    if (!stateManager.state.upgrades.combo) {
      return;
    }
    if (this.lastFaceClicked == faceClicked) {
      stateManager.state.upgrades.combo.totalCombo += 1;
    } else {
      stateManager.state.upgrades.combo.totalCombo = 0;
    }
    this.lastFaceClicked = faceClicked;
  }

  saturateFace(name: string) {
    const material = this.faceMaterials.get(name);
    if (!material) {
      console.error("invalid face to saturate");
      return;
    }
    const oldColor = material.color;
    const hsl = oldColor.getHSL({ h: 0, s: 0, l: 0});
    hsl.s -= 0.1;
    const newColor = new Color().setHSL(hsl.h, hsl.s, hsl.l);
    material.color = newColor;
    console.log(hsl);
  }

  raycastCube(normalizedPosition: Vector2, camera: Camera): void {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(normalizedPosition, camera);
    const intersects = raycaster.intersectObjects(this.cubeGroup.children);
    if (intersects.length) {
      this.applyForceToCube(intersects[0].point);
      const name = intersects[0].object.name;
      switch (name) {
        case "red":
        case "blue":
        case "green":
        case "yellow":
        case "white":
        case "black":
          // this.saturateFace(name);
          this.modifyCombo(name);
          addCubePointsWithMultipliers();
          break;
        default:
          console.error("unsupported raycast type");
      }
    }
  }
}
