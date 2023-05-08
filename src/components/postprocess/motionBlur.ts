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
  const vertexShader = /* glsl */ `
  precision highp float;
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 1.0, 1.0);
  }`;

  const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uSceneNew;
  uniform sampler2D uSceneOld;
  uniform float uBlurAmount;
  uniform vec2 uResolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 newColor = texture2D(uSceneNew, uv).rgb;
    vec3 oldColor = texture2D(uSceneOld, uv).rgb;

    gl_FragColor = vec4(mix(newColor, oldColor, uBlurAmount), 1.0);
  }`;

  const material = new RawShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uSceneNew: { value: new Texture() },
      uSceneOld: { value: new Texture() },
      uResolution: { value: new Vector2() },
      uBlurAmount: { value: 0.9 },
    },
  });
  return material;
}

export class MotionBlur {
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

  applyTextures(newTexture: Texture, oldTexture: Texture, resolution?: Vector2) {
    this.material.uniforms.uSceneNew.value = newTexture;
    this.material.uniforms.uSceneOld.value = oldTexture;
    if (resolution) {
      this.material.uniforms.uResolution.value = resolution;
    }
  }

  applyBlurAmount(amount: number) {
    this.material.uniforms.uBlurAmount.value = amount;
  }

  getScene() {
    return this.scene;
  }
}
