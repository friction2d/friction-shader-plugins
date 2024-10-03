// Adapted from Olive video editor community
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

uniform float gamma_cent;
uniform float numColors;


void main() {
	float gamma = gamma_cent*0.01;
	vec4 color = texture(texture, texCoord);
	vec3 c = color.rgb;
	c = pow(c, vec3(gamma, gamma, gamma));
	c = c * numColors;
	c = floor(c);
	c = c / numColors;
	c = pow(c, vec3(1.0/gamma));
	fragColor = vec4(c, color.a);
}