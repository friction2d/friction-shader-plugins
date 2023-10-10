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
uniform float Radius;  
uniform int Polycount; 
uniform float GlowDistance; 
uniform float threshold;  
uniform float rotation;  
uniform float squized;  
uniform float skewRot; 
uniform float chrome;  
uniform int brightness;  
uniform vec4 Color;  



const float      PI = 3.14159265359;
const float  TWO_PI = 6.28318530718;


float rand(float n){
    return fract(cos(n*89.42)*343.42);
}


//creates a Star
float star(vec2 uv, vec2 pos, float n, float radius)
{
    float rot = radians(rotation+globalRotate)*evolution;
	mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv  = m*uv;
   	pos = m*pos;
    
    vec2 p = pos;
    float angle = atan(p.x, p.y*squized) + PI*skewRot;
    float r = TWO_PI / n;
    float d = 1./(cos(floor(.5 + angle / r) * r - angle) * length(-p) / (radius*globalSize));

    return smoothstep(GlowDistance, 1.0+threshold, d);

}

void main(void)
{
	vec2 uv = texCoord*2.0-1.0;	 
	uv.x *= resolution.x / resolution.y;	
	vec2 mouse = Position.xy/resolution.xy;	 
	mouse.x *= resolution.x / resolution.y;     
	vec4 linker = texture(texture,texCoord);	
	float cr = star(uv, (vec2(uv.x+chrome*.04,uv.y)-mouse), Polycount, Radius)*brightness;
	float cg = star(uv, (vec2(uv.x+chrome*.01,uv.y)-mouse), Polycount, Radius)*brightness;
	float cb = star(uv, (vec2(uv.x+chrome*.03,uv.y)-mouse), Polycount, Radius)*brightness;
	vec3 col = vec3(cr,cg,cb)*Color.rgb;	
	fragColor = vec4(col, 1)+linker;
}
