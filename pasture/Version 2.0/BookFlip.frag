/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/BookFlip.glsl
License: MIT
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
 in vec2 texCoord;

uniform float progress; 
 
vec2 skewRight(vec2 p) {
  float skewX = (p.x - progress)/(0.5 - progress) * 0.5;
  float skewY =  (p.y - 0.5)/(0.5 + progress * (p.x - 0.5) / 0.5)* 0.5  + 0.5;
  return vec2(skewX, skewY);
}

vec2 skewLeft(vec2 p) {
  float skewX = (p.x - 0.5)/(progress - 0.5) * 0.5 + 0.5;
  float skewY = (p.y - 0.5) / (0.5 + (1.0 - progress ) * (0.5 - p.x) / 0.5) * 0.5  + 0.5;
  return vec2(skewX, skewY);
}

vec4 addShade() {
  float shadeVal  =  max(0.7, abs(progress - 0.5) * 2.0);
  return vec4(vec3(shadeVal ), 1.0);
}

vec4 transition (vec2 p) {
  float pr = step(1.0 - progress, p.x);

  if (p.x < 0.5) {
    return mix(texture(texture,p), vec4(1.0)* addShade(), pr);
  } else {
    return mix(texture(texture,skewRight(p)) * addShade(), vec4(0.0),   pr);
  }
}

void main(void)
{
 
    fragColor = transition(texCoord);
}

