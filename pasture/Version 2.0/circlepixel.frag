// Adapted from https://godotshaders.com/shader/circle-pixel/
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

uniform vec2 Amount; 



void main(void){
vec2 uv = texCoord;

	vec2 pos = uv;
	pos *= vec2(Amount.x, Amount.y);
	pos = ceil(pos);
	pos /= vec2(Amount.x, Amount.y);
	vec2 cellpos = pos - (0.5 / vec2(Amount.x, Amount.y));
	
	pos -= uv;
	pos *= vec2(Amount.x, Amount.y);
	pos = vec2(1.0) - pos;
	
	float dist = distance(pos, vec2(0.5));

	vec4 c = texture(texture, cellpos);
	vec4 COLOR = c * step(0.0, (0.5* c.a) - dist);
    fragColor = vec4(COLOR);
}
