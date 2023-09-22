/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/PolkaDotsCurtain.glsl
License: MIT
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
 in vec2 texCoord;
uniform vec2 resolution;

const float SQRT_2 = 1.414213562373;

uniform float progress; 
uniform float dots;
uniform vec2 center;

vec4 transition(vec2 uv) {
 float ar = resolution.x/resolution.y;
  uv.x*=ar;
  bool nextImage = distance(fract(uv * dots), vec2(0.5, 0.5)) < ( progress / distance(uv, center));
   uv.x/=ar;
//  return nextImage ? vec4(0.0) : texture2D(texture,uv);
return nextImage ? texture(texture,uv) : vec4(0.0);
}

void main(void)
{
     fragColor = transition(texCoord);
}

