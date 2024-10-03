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
uniform vec4 Color;


//creates a Glimmer
float ring(vec2 uv, vec2 pos, float radius, float thick)
{
    float rot = radians(globalRotate)*evolution;
    mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    uv  = m*uv;
    pos = m*pos;

    vec2 main = pos-uv;
    float ang = atan(main.y, main.x);
    float dist=length(main); dist = pow(dist,.1);
    float f0 = mix(0.0, 1.0, smoothstep(thick*.8*globalSize, thick-softness*.8, abs(length(pos-uv) - radius)));
    float f1 = mix(0.0, 1.0, smoothstep(thick*1.5*globalSize, thick-softness*.5, abs(length(pos-uv) - radius)));
    float f2 = mix(0.0, 1.0, smoothstep(thick*globalSize, thick-softness, abs(length(pos-uv) - radius)));

    return f0*(sin((ang)*raycount)*raydepth+dist*.1+.9)*
    f1*(sin((ang)*raycount*.8)*raydepth+dist*.1+.9)*
    f2*(sin((ang)*raycount*.5)*raydepth+dist*.1+.9);
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy*2.0-1.0;
	//uv -= 0.5;
	uv.x *= resolution.x / resolution.y;
	
	vec2 mouse = Position.xy/resolution.xy;
	//mouse -= 0.5;
	mouse.x *= resolution.x / resolution.y;
	
    
	vec4 linker = texture2D(texture,texCoord);
	
	float c = ring(uv, mouse, Radius*globalSize, Thickness);
	
	fragColor = vec4(vec3(c*Color.rgb), 1)+linker;
}
