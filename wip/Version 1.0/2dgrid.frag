// Adapted from https://godotshaders.com/shader/2d-grid-with-adjacent-cells/
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

uniform float columns; 
uniform float rows; 
uniform float border_width; 
uniform vec4 border_color; 

void  main(void) {
vec2 uv = texCoord;
    vec2 grid = fract(vec2(uv.x * columns, uv.y * rows));
	vec2 bottom_left = step(vec2(border_width), grid);
	vec2 top_right = step(vec2(border_width), 1.0 - grid);
	vec4 color = border_color - (bottom_left.x * bottom_left.y * top_right.x * top_right.y);

  fragColor = vec4(color.rgb,texture2D(texture,texCoord).a);
}