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

function makePostProcessMaterial(): RawShaderMaterial {
  const vertexShader = /* glsl */`
  precision highp float;
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 1.0, 1.0);
  }`;
  

  const fragmentShader = /* glsl */`
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 color = texture2D(uTexture, uv).rgb;
    gl_FragColor = vec4(color, 1.0);
  }`;

  const material = new RawShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uTexture: { value: new Texture() },
      uResolution: { value: new Vector2() },
    },
  });
  return material;
}

export class TextureToScene {
  private scene: Scene;
  private material: RawShaderMaterial;

  constructor() {
    const postProcessScene = new Scene();

    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      -1.0, -1.0,
      3.0, -1.0,
      -1.0, 3.0
    ]);
    geometry.setAttribute('position', new BufferAttribute(vertices, 2));
    this.material = makePostProcessMaterial();
    const triangle = new Mesh(geometry, this.material);
    triangle.frustumCulled = false;
    postProcessScene.add(triangle);
  
    this.scene = postProcessScene;
  }

  applyTexture(texture: Texture, resolution?: Vector2) {
    this.material.uniforms.uTexture.value = texture;
    if (resolution) {
      this.material.uniforms.uResolution.value = resolution;
    }
  }

  getScene() {
    return this.scene;
  }
}
