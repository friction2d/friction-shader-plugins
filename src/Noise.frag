// Adapted from natron plugins (Adapted to Natron by F.Fernandez
// Original code : crok_vhs Matchbox for Autodesk Flame)
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
/* 
                  ..::::::::...         
             .:------------------:.     
          .:-------:::-------------:.   
        :------:.       .:-----------:  
      :------:            .-----------. 
    .-------:               ----------: 
   .--------.               :---------. 
  .---------.               :---------  
  :----------              .-------=:   
 .------------.           :-----==:     
 :--------------:.    ..:-----=-:       
 :-------------------------=-:.         
 .---------------------::..             
  --------:.......                 ..   
  .--------.                  .:--====- 
   .---------:.           .:-=========- 
    .----------==-------============-:  
      .------=====================:.    
        .:-==================-::.       
            ..::------:::..             
*/
#version 330 core


layout(location = 0) out vec4 fragColor;

uniform sampler2D texture;

in vec2 texCoord;
layout(origin_upper_left) in vec4 gl_FragCoord;
uniform float iTime;

uniform float contrast = 1.0;

float time = iTime * 0.05;

#define ITERATIONS 2
#define HASHSCALE1 .1031

// Real contrast adjustments by  Miles
float adjust_contrast(float col, float con)
{
float t = .18;
col = (1.0 - con) * t + con * col;

return col;
}

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

void main(void)
{
  
  vec2 position = gl_FragCoord.xy;
  float a = 0.0;
  for (int t = 0; t < ITERATIONS; t++)
  {
      float v = float(t+1)*.152;
      vec2 pos = (position * v + time * 1500. + 50.0);
      a += hash12(pos);
  }
  float col = a / float(ITERATIONS);
  col = adjust_contrast(col, contrast +0.2);
  fragColor = vec4(col,col,col,texture2D(texture,texCoord).a);
}
