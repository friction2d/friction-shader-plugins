// Adapted from (https://godotshaders.com/shader/pseudo-pixel-sorting/ @ahopness)
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

uniform float Sort;

void main(void){
	vec2 uv = texCoord;
	
	// Pseudo Pixel Sorting
	float sortThreshold = 1.0 - clamp(Sort / 2.6, 0.0, 1.0);
	vec2 sortUv = vec2(uv.x, sortThreshold);
	
	// Curved melting transition
	vec2 transitionUV = uv;
	transitionUV.y += pow(Sort, 2.0 + (Sort * 2.0)) * uv.x * fract(sin(dot(vec2(transitionUV.x), vec2(12.9, 78.2)))* 437.5);
	fragColor = texture(texture, transitionUV);
	
	// Draw pixel sorting effect behind the melting transition
	if(transitionUV.y > 1.){
		fragColor = texture(texture, sortUv);
	}else{
		fragColor = texture(texture, uv);
	}
}