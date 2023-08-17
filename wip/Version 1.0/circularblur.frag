/* built from scratch, with some borrowing (rotation) from https://godotshaders.com/shader/rotational-motion-blur-2d/
built for enve by axiomgraph
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

 Opengl version 3.3 */
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;

in vec2 texCoord;
uniform vec2 scenePos;


uniform int Quality;
uniform float Angle;
uniform vec2 Pivot;
uniform float Gain;

float aspect = scenePos.x/scenePos.y;

vec2 rotate(vec2 uv, vec2 p, float angle)
{
	mat2 rotation = mat2(vec2(cos(angle), -sin(angle)),
						vec2(sin(angle), cos(angle)));
	uv.x *= aspect;					
	uv -= p;
	uv = uv * rotation;
	uv += p;
	uv.x *= 1.0 / aspect;
	return uv;
}



void main(void)
{

    
    vec2 uv = texCoord;
    vec4 Color =vec4(0.0);
    float v;
   
    vec2 origin = Pivot/100.0;
    
    for( float i=0.0;i<1.0;i+=1.0/float(Quality))
    {
    
        v = 0.0+float(i)*0.5*Angle/100.0;
        Color += texture2D(texture,rotate(uv,origin, v));  //
        Color += texture2D(texture,rotate(uv,origin, v/-1.0)); 
    }
    Color /= float(Quality*2.0);
    
    fragColor =  vec4(Color.rgb*Gain,Color.a) ;
}


