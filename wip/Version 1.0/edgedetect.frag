// Ported from "https://www.shadertoy.com/view/Xdf3Rf by Jeroen Baert - jeroen.baert@cs.kuleuven.be www.forceflow.be"
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
layout(pixel_center_integer) in vec4 gl_FragCoord;
in vec2 texCoord;
uniform sampler2D texture;


uniform vec2 scenePos;


// Use these parameters to fiddle with settings
uniform float size;// = 0.9
uniform float opacity;// =0.5;

float intensity(in vec4 color){
	return sqrt((color.x*color.x)+(color.y*color.y)+(color.z*color.z));
}

vec3 sobel(float stepx, float stepy, vec2 center){
	// get samples around pixel
    float tleft = intensity(texture2D(texture,center + vec2(-stepx,stepy)));
    float left = intensity(texture2D(texture,center + vec2(-stepx,0)));
    float bleft = intensity(texture2D(texture,center + vec2(-stepx,-stepy)));
    float top = intensity(texture2D(texture,center + vec2(0,stepy)));
    float bottom = intensity(texture2D(texture,center + vec2(0,-stepy)));
    float tright = intensity(texture2D(texture,center + vec2(stepx,stepy)));
    float right = intensity(texture2D(texture,center + vec2(stepx,0)));
    float bright = intensity(texture2D(texture,center + vec2(stepx,-stepy)));
 
	// Sobel masks (see http://en.wikipedia.org/wiki/Sobel_operator)
	//        1 0 -1     -1 -2 -1
	//    X = 2 0 -2  Y = 0  0  0
	//        1 0 -1      1  2  1
	
	// You could also use Scharr operator:
	//        3 0 -3        3 10   3
	//    X = 10 0 -10  Y = 0  0   0
	//        3 0 -3        -3 -10 -3
 
    float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
    float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
    float color = sqrt((x*x) + (y*y));
    return vec3(color,color,color);
 }

void main(void){
	vec2 uv = gl_FragCoord.xy/scenePos.xy;
	vec4 color = texture2D(texture, uv.xy);
	vec3 color2 = sobel(size/scenePos[0], size/scenePos[1], uv);
    
    fragColor =vec4(mix(color.rgb,color2.rgb,opacity),texture2D(texture,uv).a);
}