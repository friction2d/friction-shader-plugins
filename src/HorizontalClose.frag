/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/HorizontalClose.glsl
License: MIT
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
in vec2 texCoord;
 
uniform float progress; 
uniform float feather;
vec4 transition (vec2 uv) {

  float s = 2.0 - abs((uv.y - 0.5) / (progress - 1.0)) - 2.0 * progress;
  
  return mix(
    texture2D(texture,uv),
    vec4(0.0),  
    smoothstep(feather, 0.0 , s)
  ); 
}
void main(void)
{
   fragColor = transition(texCoord);
}

