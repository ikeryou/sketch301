precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vViewDir;

void main(void){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 clipPosition = projectionMatrix * viewPosition;

  vUv = uv;
  vPos = position;
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-viewPosition.xyz);

  gl_Position = clipPosition;
}
