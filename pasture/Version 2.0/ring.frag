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
uniform float Radius; // = .25; // Radius, min=0., max=2.
uniform float Thickness; // = .12; // Thickness, min=0., max=.9
uniform float softness; // = .5; // Softness, min=.1, max=1.
uniform int raycount; // = 100; // Ray Count , min=0., max=200.
uniform float raydepth; // = .3; // Ray depth , min=-1.5, max=1.5
uniform float rotation; // = .0; // Rotation , min=0.,max=360.
uniform vec4 Color; // = vec3(.25,.25,.25); // Color


//creates a ring with or without Rays
float ring(vec2 uv, vec2 pos, float radius, float thick)
{
    float rot = radians(rotation+globalRotate)*evolution;
	mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv  = m*uv;
   	pos = m*pos;
    
  vec2 main = pos-uv;
  float ang = atan(main.y, main.x);
  float dist=length(main); dist = pow(dist,.1);
  float f0 = mix(0.0, 1.0, smoothstep(thick*globalSize, thick-softness, abs(length(pos-uv) - (radius*globalSize))));
  
  return f0*(sin((ang)*raycount)*raydepth+dist*.1+.9);
}

void main(void )
{
	vec2 uv = texCoord*2.0-1.0;
	
	uv.x *= resolution.x / resolution.y;
	
	vec2 mouse = Position.xy/resolution.xy;
	 
	mouse.x *= resolution.x / resolution.y;
	
   
	vec4 linker = texture(texture,texCoord);
	
	float c = ring(uv, mouse, Radius, Thickness);
	
	fragColor = vec4(vec3(c*Color.rgb), 1)+linker;
}
