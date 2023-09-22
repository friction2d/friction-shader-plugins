/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/ButterflyWaveScrawler.glsl
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

uniform float amplitude ; 
uniform float waves;  
uniform float colorSeparation;  

float PI = 3.14159265358979323846264;
float compute(vec2 p, float progress, vec2 center) {
vec2 o = p*sin(progress * amplitude)-center;
// horizontal vector
vec2 h = vec2(1., 0.);
// butterfly polar function (don't ask me why this one :))
float theta = acos(dot(o, h)) * waves;
return (exp(cos(theta)) - 2.*cos(4.*theta) + pow(sin((2.*theta - PI) / 24.), 5.)) / 10.;
}
vec4 transition(vec2 uv) {
  vec2 p = uv.xy / vec2(1.0).xy;
  float inv = 1. - progress;
  vec2 dir = p - vec2(.5);
  float dist = length(dir);
  float disp = compute(p, progress, vec2(0.5, 0.5)) ;
  //vec4 texTo = getToColor(p + inv*disp); // for future use
    vec4 texTo = vec4(0.0);
  vec4 texFrom = vec4(
 texture2D(texture,p + progress*disp*(1.0 - colorSeparation)).r,
 texture2D(texture,p + progress*disp).g,
texture2D(texture,p + progress*disp*(1.0 + colorSeparation)).b,
  1.0);
  return texTo*progress + texFrom*inv;
}
void main(void)
{
     fragColor = transition(texCoord);
}

