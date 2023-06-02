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
  Camera,
  WebGLRenderTarget,
  RawShaderMaterial,
  Vector2,
  BufferGeometry,
  BufferAttribute,
  Material,
  Texture,
  OrthographicCamera,
  RGBAFormat,
  LinearEncoding,
  LinearFilter,
} from "three";
import { TextureToScene } from "@/components/postprocess/noChange";
import { MotionBlur } from "@/components/postprocess/motionBlur";
import stateManager from "@/store/state";

export class Renderer {
  renderer: WebGLRenderer;
  renderTarget: WebGLRenderTarget;
  previousTarget: WebGLRenderTarget;
  tempTarget: WebGLRenderTarget;
  index = 0;
  postProcessScene: Scene = new Scene();
  material!: RawShaderMaterial;
  textureToScene: TextureToScene = new TextureToScene();
  motionBlur: MotionBlur = new MotionBlur();

  constructor(canvas: HTMLElement) {
    // Create a renderer with Antialiasing
    this.renderer = new WebGLRenderer({
      antialias: false,
      canvas: canvas,
    });
    document.body.appendChild(this.renderer.domElement);

    // Configure renderer clear color
    this.renderer.setClearColor("#aaddff");

    // Configure renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setDrawingBufferSize(
      window.innerWidth,
      window.innerHeight,
      2
    );

    // make the render targets
    const resolution = new Vector2();
    this.renderer.getDrawingBufferSize(resolution);

    const params = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      encoding: LinearEncoding,
    };

    this.renderTarget = new WebGLRenderTarget(
      resolution.x,
      resolution.y,
      params
    );

    this.previousTarget = new WebGLRenderTarget(
      resolution.x,
      resolution.y,
      params
    );

    this.tempTarget = new WebGLRenderTarget(resolution.x, resolution.y, params);
  }

  render(scene: Scene, camera: Camera) {
    // TODO: (CUBE-1) move ths out of render loop :)
    const resolution = new Vector2();
    this.renderer.getDrawingBufferSize(resolution);

    // render scene to primary texture
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(scene, camera);

    // blend old frame and previous frame into new texture
    const speed = stateManager.state.cubeProperties.spinSpeed;
    const blurAmount = speed / (0.1 + speed);
    this.motionBlur.applyBlurAmount(blurAmount);
    this.motionBlur.applyTextures(
      this.renderTarget.texture,
      this.previousTarget.texture ?? new Texture(),
      resolution
    );
    this.renderer.setRenderTarget(this.tempTarget);
    this.renderer.render(this.motionBlur.getScene(), camera);

    // render texture to screen
    this.textureToScene.applyTexture(this.tempTarget.texture, resolution);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.textureToScene.getScene(), camera);

    const temp__DO_NOT_USE_OR_GET_FIRED = this.previousTarget;
    this.previousTarget = this.tempTarget;
    this.tempTarget = temp__DO_NOT_USE_OR_GET_FIRED;
  }
}
