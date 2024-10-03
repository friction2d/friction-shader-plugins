/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/Radial.glsl
License: MIT
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
in vec2 texCoord;

uniform vec2 resolution; 

uniform float progress;  
uniform float feather;  

const float PI = 3.141592653589;

vec4 transition(vec2 p, vec2 uv) {
  float ar = resolution.x/resolution.y;
   p.x*=ar;
   vec2 rp = p ;
   p.x/=ar;
  return mix(
   vec4(0.0),
    texture2D(texture,uv),
    smoothstep(0., feather, atan(rp.y ,rp.x) - (progress-.5) * PI * 2.5)
  );
}
void main(void)
{
vec2 uv = texCoord;
   fragColor = transition(texCoord *2.0-1.0, uv);
}

