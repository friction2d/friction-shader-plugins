/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/windowslice.glsl
License: MIT
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
precision mediump float;

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
 in vec2 texCoord;

uniform float progress; 
 
uniform float count;  
uniform float smoothness;  

vec4 transition (vec2 p) {
  float pr = smoothstep(-smoothness, 0.0, p.x - progress * (1.0 + smoothness));
  float s = step(pr, fract(count * p.x));
  return mix(texture(texture,p), vec4(0.0), s); // for future use
}

void main(void)
{
 
    fragColor = transition(texCoord);
}

