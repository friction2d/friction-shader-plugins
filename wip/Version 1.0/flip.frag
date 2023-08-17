// Ported from olive video editor project
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

in vec2 texCoord;

uniform sampler2D texture;

uniform int horiz;
uniform int vert;


void main(void) {
	float x = texCoord.x;
	float y = texCoord.y;

	if (horiz == 1) x = 1.0 - x;
	if (vert == 1) y = 1.0 - y;

	vec4 textureColor = texture2D(texture, vec2(x, y));
	fragColor = vec4(
		textureColor.r,
		textureColor.g,
		textureColor.b,
		textureColor.a
	);
}