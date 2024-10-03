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
uniform float globalSize;  
uniform float globalRotate;  
uniform float evolution;  

//parametres
uniform float coresize;  
uniform int raycount;  
uniform float raydepth;  
uniform float rotation; 
uniform vec4 SunColor;  


//Procedural Sun Generation
float sun(vec2 uv, vec2 pos, float size)
{
    float rot = radians(rotation+globalRotate)*evolution;
    mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    uv  = m*uv;
    pos = m*pos;
    
    vec2 vector = uv-pos;
	
	float angle = atan(vector.y, vector.x);
	float dist=length(vector); dist = pow(dist,.1);
	
	float f0 = 1.0/(length(uv-pos)*(1.0/size*100.0)/(coresize*globalSize));
	
    
    return f0+f0*(sin((angle)*float(raycount))*raydepth+dist*.1+.9);
}


void main(void)
{
    
	vec2 uv = texCoord*2.0-1.0;
	uv.x *= resolution.x/resolution.y; //fix aspect ratio
	vec2 mouse =  Position.xy/resolution.xy;
	mouse.x *= resolution.x/resolution.y; //fix aspect ratio
	float c = sun(uv,mouse,1.);   
	vec4 linker = texture(texture,texCoord);	
	fragColor = vec4(c*SunColor.rgb,1.0)+linker;
}
