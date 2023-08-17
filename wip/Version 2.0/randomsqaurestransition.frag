/* Adapted from https://www.shadertoy.com/view/Ndy3zt, https://gl-transitions.com/editor/randomsquares
// Rebuilt for enve by axiomgraph
// Opengl version 3.3*/
#version 330 core
precision mediump float;


layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;


uniform float time;

uniform  vec2 size;// = vec2(10,10)
uniform float smoothness; // = 0.5; // 0-1
 
float rand (vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void)
{
   vec2 uv = texCoord;
   float r = rand(floor(vec2(size) * uv));
   float j;
   float m = smoothstep(0.0, -smoothness, r - (time* (1.0 + smoothness)));
   fragColor=  mix(texture(texture,uv),vec4(0.0,0.0,0.0,0.0), m);
}
