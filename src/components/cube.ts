import { BoxGeometry, Color, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, Scene } from "three";

export class Cube {
  group: Group;

  constructor() {
    const piece = new BoxGeometry(1, 1, 1).toNonIndexed();
    const material = new MeshBasicMaterial({
      vertexColors: true
    });
    const positionAttribute = piece.getAttribute('position');
    const colors = [];
  
    const color = new Color();
  
    for (let i = 0; i < positionAttribute.count; i += 6) {
  
      color.setHex(0xffffff * Math.random());
  
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
  
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    } // for
  
    // define the new attribute
    piece.setAttribute('color', new Float32BufferAttribute(colors, 3));
    const cube = new Mesh(piece, material);

    this.group = new Group();
    this.group.add(cube);
  }
}