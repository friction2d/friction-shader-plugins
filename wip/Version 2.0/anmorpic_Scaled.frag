/* Adapted from natron plugins Author : CGVIRUS
 Adapted for enve/friction by axiomgraph
 Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;

uniform vec2 Position;

//Global parametres
uniform float globalSize; // = 1.0; // Global Scale, min=0., max=100.
uniform float globalRotate; //= 0.0; // Global Rotation, min=0., max=360.
uniform float evolution; //= 1.0; // Evolution, min=1.0, max=360.


//parametres
uniform float tapperness; 
uniform vec2 cpos; 
uniform vec2 size; 
uniform float rotation; 
uniform float Thresold; 
uniform float Hardness; 
uniform float parallax; 
uniform int raycount; 
uniform float raydepth; 
uniform vec4 Color; 


const float      PI = 3.14159265359;
const float  TWO_PI = 6.28318530718;

//creates a adjustable Anamorphic spot
float circleBox(vec2 uv, vec2 pos, vec2 size, float cornerRadius, float between)
{
    vec2 main = uv-pos;
	float ang = atan(main.y, main.x);
	float dist=length(main); dist = pow(dist,.1);
	
    float rot = radians(rotation+globalRotate)*evolution;
	mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv  = m*uv;
   	pos = m*pos;
    

    float sd = (length(uv-pos) - size.x); // circle
    size -= vec2(cornerRadius);           // rounded box
    vec2 d = (abs(uv-pos) - size);
    float box = min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - cornerRadius;
    float v = (1.0 - between)*sd + box*between;  //mix
    
    
    float f0 = 1.0/((length(v))*(1.0/tapperness*Hardness*100))*globalSize;
    return f0+f0*(sin((ang)*raycount)*raydepth+dist*.1+.9);
}

void main(void)
{
	vec2 uv = texCoord*2.0-1.0;
	uv.x *= resolution.x / resolution.y;	
	vec2 mouse = Position.xy/resolution.xy;
	mouse.x *= resolution.x / resolution.y;
	vec4 linker = texture(texture,texCoord);
	
	
	float c = circleBox(vec2((uv.x+cpos.x),(uv.y+cpos.y)), mouse*-parallax, vec2(size.x,size.y)*globalSize, Thresold, tapperness);
	
	fragColor = vec4(vec3(c*Color.rgb), 1)+linker;
}
