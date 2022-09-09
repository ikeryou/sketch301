precision highp float;

uniform mat4 viewMatrix;
uniform vec3 diffuse;
uniform vec3 emissive;

uniform float rate;
uniform float test;
uniform vec3 color;
uniform vec3 light;
uniform float glossiness;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vViewDir;

#include <common>
#include <bsdfs>
#include <lights_pars_begin>


void main(void) {
  float testX = (vPos.x + 0.5);
  float a = mix(step(0.5, testX), 1.0 - step(0.5, testX), test);
  if(a <= 0.0) {
    discard;
  }

  // directional light
  float NdotL = dot(vNormal, directionalLights[0].direction);
  float lightIntensity = smoothstep(0.0, 0.01, NdotL);
  vec3 directionalLight = directionalLights[0].color * lightIntensity;

  // specular reflection
  vec3 halfVector = normalize(directionalLights[0].direction + vViewDir);
  float NdotH = dot(vNormal, halfVector);

  float specularIntensity = pow(NdotH * lightIntensity, 1000.0 / glossiness);
  float specularIntensitySmooth = smoothstep(0.05, 0.1, specularIntensity);

  vec3 specular = specularIntensitySmooth * directionalLights[0].color * 0.6;

  // rim lighting
  float rimDot = 1.0 - dot(vViewDir, vNormal);
  float rimAmount = 0.6;

  float rimThreshold = 0.2;
  float rimIntensity = rimDot * pow(NdotL, rimThreshold);
  rimIntensity = smoothstep(rimAmount - 0.01, rimAmount + 0.01, rimIntensity);

  vec3 rim = rimIntensity * directionalLights[0].color;

  vec3 dest = color - vNormal.y * 0.1;
  gl_FragColor = vec4(dest * light * (directionalLight + ambientLightColor + specular + rim), 1.0);
}