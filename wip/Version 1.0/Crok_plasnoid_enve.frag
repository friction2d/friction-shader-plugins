// Adapted from natron plugins (// Adapted to Natron by F.Fernandez
// Original code : crok_plasnoid Matchbox for Autodesk Flame)
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
layout(origin_upper_left) in vec4 gl_FragCoord;
uniform sampler2D texture;

in vec2 texCoord;


uniform float iTime;

uniform float speed;
uniform float offset; 

uniform float detail; 
uniform vec2 noise; 

uniform vec2 fractal; 
uniform vec2 random; 

uniform int itterations; 
uniform vec4 color; 




float time = iTime*.025 * speed + offset;

float getGas(vec2 p)
{
	return (cos(p.y * detail + time)+1.0)*0.5+(sin(time))*0.0+0.1;
}

void main(void)
{

	vec2 position = texCoord;
	
	vec2 p=position;
	for(int i=1;i<itterations;i++){
		vec2 newp=p;
		

		newp.x+=(noise.x / (float(i)))*(sin(p.y*(fractal.x + time * 0.0001))*0.2*sin(p.x * random.x)*0.8);
		newp.y+=(noise.y / (float(i)))*(cos(p.x*(fractal.y + time * 0.0001))*0.2*sin(p.x * random.y)+time*0.1);
		p=newp;
	}

	vec3 clr=vec3(color.r * .2 ,color.g *.2 , color.b * .2);
	clr/=getGas(p);

	fragColor = vec4( clr, texture2D(texture,texCoord).a );

}