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
uniform float Thickness;  
uniform float softness; 
uniform int raycount;
uniform float raydepth;
uniform float rotation;

uniform vec4 Color1;
uniform vec4 Color2;
uniform vec4 Color3;


//creates a ring with or without Rays
vec3 ring(vec2 uv, vec2 pos, float radius, float thick)
{
    float rot = radians(rotation+globalRotate)*evolution;
	mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv  = m*uv;
   	pos = m*pos;
    
  vec2 main = pos-uv;
  float ang = atan(main.y, main.x);
  float dist=length(main); dist = pow(dist,.1);
  vec3 f0 = vec3(0.0);
	f0 += mix(0.0, 1.0, smoothstep(thick*globalSize, thick-softness, abs(length(pos-uv) - (radius*globalSize*1.0))))*Color1.rgb;
	f0 += mix(0.0, 1.0, smoothstep(thick*globalSize, thick-softness, abs(length(pos-uv) - (radius*globalSize*1.1))))*Color2.rgb;
	f0 += mix(0.0, 1.0, smoothstep(thick*globalSize, thick-softness, abs(length(pos-uv) - (radius*globalSize*1.2))))*Color3.rgb;
	
  vec3 c = f0*(sin((ang)*raycount)*raydepth+dist*.1+.9);

  return c;
}

void main(void)
{
	vec2 uv = texCoord*2.0-1.0;	 
	uv.x *= resolution.x / resolution.y;	
	vec2 mouse = Position.xy/resolution.xy;	 
	mouse.x *= resolution.x / resolution.y;	    
	vec4 linker = texture(texture,texCoord);	
	vec3 c = ring(uv, mouse, Radius, Thickness);	
	fragColor = vec4(c, 1.0)+linker;
}
