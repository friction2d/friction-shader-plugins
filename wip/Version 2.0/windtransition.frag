/* Adapted from https://www.shadertoy.com/view/7dj3Dh
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

uniform float size; 
uniform int lefttoright; 

float rand (vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}



void main(void)
{
    vec2 uv = texCoord;
  
   float r = rand(vec2(1.0, uv.y));
  
  if(bool(lefttoright)){ float m = smoothstep(0.0,size, uv.x*(1.0-size) + size*r - (time * (1.0 + size)));    
   
   fragColor =texture(texture,uv)*m;}
   else{   float m = smoothstep(0.0,-size, uv.x*(1.0-size) + size*r - (time * (1.0 + size)));       
   fragColor =texture(texture,uv)*m;
   
   }
}
