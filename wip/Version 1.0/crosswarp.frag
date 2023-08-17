/* Adapted from https://www.shadertoy.com/view/ssj3Dh
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


uniform int lefttoright; 
uniform int righttoleft; 
uniform int toptobottom; 
uniform int bottomtotop;


void main(void)
{
  vec2 p = texCoord;
   float x = time; // time
   
  if(lefttoright == 1 && righttoleft== 0 && toptobottom==0 &&  bottomtotop==0){ 
  x=smoothstep(.0,1.0,(x*4.0-p.x-1.0));  
  fragColor= mix(texture2D(texture,(p-.5)*(1.-x)+.5), vec4(0.0,0.0,0.0,0.0), x);  }
  else if(lefttoright == 0 && righttoleft== 1 && toptobottom==0 &&  bottomtotop==0){
   x=smoothstep(.0,1.0,(x*2.0+p.x-1.0));  
  fragColor= mix(texture2D(texture,(p-.5)*(1.-x)+.5), vec4(0.0,0.0,0.0,0.0), x);  
  
  }
  else if(lefttoright == 0 && righttoleft== 0&& toptobottom==1 &&  bottomtotop==0 ){  
  x=smoothstep(.0,1.0,(x*3.0-p.y-1.0));  
  fragColor= mix(texture2D(texture,(p-.5)*(1.-x)+.5), vec4(0.0,0.0,0.0,0.0), x); 
  }
  else if(lefttoright == 0 && righttoleft== 0&& toptobottom==0&&  bottomtotop==1 ){  
  x=smoothstep(.0,1.0,(x*4.0+p.y-1.0));  
  fragColor= mix(texture2D(texture,(p-.5)*(1.-x)+.5), vec4(0.0,0.0,0.0,0.0), x); 
  }
  else {
  fragColor =texture2D(texture,texCoord); 
  }
  }
