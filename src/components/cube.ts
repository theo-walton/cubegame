import { BackSide, BoxGeometry, BufferGeometry, Color, ColorRepresentation, DoubleSide, Float32BufferAttribute, FrontSide, Group, Mesh, MeshBasicMaterial, MeshPhongMaterial, Scene, Vector3 } from "three";

export class Cube {
  group: Group;

  constructor() {
    this.group = new Group();
    this.group.name = "the cube";

    this.makeFace([
        new Vector3(1, -1, 1),
        new Vector3(1, 1, 1),
        new Vector3(-1, -1, 1),
        new Vector3(1, 1, 1),
        new Vector3(-1, 1, 1),
        new Vector3(-1, -1, 1),
      ],
      "red",
      "red",
    );

    this.makeFace([
        new Vector3(1, 1, -1),
        new Vector3(1, -1, -1),
        new Vector3(-1, -1, -1),
        new Vector3(1, 1, -1),
        new Vector3(-1, -1, -1),
        new Vector3(-1, 1, -1),
      ],
      "blue",
      "blue",
    );

    this.makeFace([
        new Vector3(-1, 1, 1),
        new Vector3(-1, 1, -1),
        new Vector3(-1, -1, -1),
        new Vector3(-1, 1, 1),
        new Vector3(-1, -1, -1),
        new Vector3(-1, -1, 1),
      ],
      "green",
      "green",
    );

    this.makeFace([
        new Vector3(1, 1, 1),
        new Vector3(1, -1, -1),
        new Vector3(1, 1, -1),
        new Vector3(1, 1, 1),
        new Vector3(1, -1, 1),
        new Vector3(1, -1, -1),
      ],
      "yellow",
      "yellow",
    );

    this.makeFace([
        new Vector3(1, 1, 1),
        new Vector3(1, 1, -1),
        new Vector3(-1, 1, -1),
        new Vector3(1, 1, 1),
        new Vector3(-1, 1, -1),
        new Vector3(-1, 1, 1),
      ],
      "white",
      "white",
    );

    this.makeFace([
      new Vector3(1, -1, 1),
      new Vector3(-1, -1, -1),
      new Vector3(1, -1, -1),
      new Vector3(1, -1, 1),
      new Vector3(-1, -1, 1),
      new Vector3(-1, -1, -1),
    ],
    "black",
    "black",
  );
  }

  makeFace(points: Vector3[], color: ColorRepresentation, name: string) {
    const buffer = new BufferGeometry().setFromPoints(points);
    buffer.computeVertexNormals();
    const mesh = new Mesh(buffer, new MeshPhongMaterial({ color: color, side: FrontSide}));
    mesh.name = name;
    this.group.add(mesh);
  }
}