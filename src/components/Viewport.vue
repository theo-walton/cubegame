<template>
  <canvas id="Viewport" class="viewport">
  </canvas>
</template>
  
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
Object3D,
AmbientLight,
PointLight,
MeshPhongMaterial,
} from "three";
import { Cube } from "./cube";
import { Mouse } from "./mouse";

@Options({
})
export default class Viewport extends Vue {
  renderer!: WebGLRenderer;
  scene!: Scene;
  camera!: PerspectiveCamera;

  // temp
  cube!: Cube;
  mouse!: Mouse;

  mounted() {
    this.scene = new Scene();

    // Create a basic perspective camera
    this.camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 4;

    // Create a renderer with Antialiasing
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: document.getElementById("Viewport") as any,
    });

    // Configure renderer clear color
    this.renderer.setClearColor("#aaddff");

    // Configure renderer size
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    // Append Renderer to DOM
    document.body.appendChild( this.renderer.domElement );

    this.initializeScene();

    // initialize mouse event handler
    this.mouse = new Mouse(window);

    // start game loop
    requestAnimationFrame(this.gameLoop);
  }

  initializeScene(): void {
    // add lighting
    const ambient = new AmbientLight(0x777777);
    this.scene.add(ambient);

    const point1 = new PointLight(0xffffff, 1, 100);
    point1.position.set(10, 10, 10);
    this.scene.add(point1);

    this.cube = new Cube();

    this.scene.add(this.cube.group);
    console.log(this.scene);
  }

  gameLoop(): void {
    this.renderer.render(this.scene, this.camera);

    this.cube.group.rotation.x += 0.01;
    this.cube.group.rotation.y += 0.02;

    this.cube.raycastCube(this.mouse.normalizedPosition, this.camera);

    requestAnimationFrame(this.gameLoop);
  }
};
</script>
  
<style scoped>
.viewport {
  top: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
  