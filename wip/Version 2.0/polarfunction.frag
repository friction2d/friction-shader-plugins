/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/polar_function.glsl
License: MIT
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
#define PI 3.14159265359
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
in vec2 texCoord;
uniform vec2 resolution; 

uniform float progress;  
uniform int segments;
uniform float rotation;  

vec4 transition (vec2 uv,vec2 uv1) {
  float angle = atan(uv.y,uv.x) - rotation * PI;
  float radius = (cos(float(segments) * angle) + 4.0) / 4.0;
  float difference =  length(uv) ;  
  if (difference > radius * progress)
     return texture(texture,uv1);
   else
     return vec4(0.0);
}

void main(void)
{
     vec2 uv = texCoord*2.0-1.0;  
    vec2 uv1 =texCoord;    
    uv.x*=resolution.x/resolution.y; 
    fragColor = transition(uv,uv1);
}

