// Ported from natron plugins project "CGVIRUS"
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core

layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;
uniform vec2 scenePos;

//Global parametres
uniform vec2 Position;
uniform float globalSize; // = 1.0; // Global Scale, min=0., max=100.
uniform float globalRotate; //= 0.0; // Global Rotation, min=0., max=360.
uniform float evolution; //= 1.0; // Evolution, min=1.0, max=360.

//parametres
uniform float thickness; // = .4; // Thichness , min=0., max=10.
uniform int raycount; // = 10; // Ray Count , min=0., max=100.
uniform float raydepth; // = .2; // Ray depth , min=-1.5, max=1.5
uniform float rotation; // = .0; // Rotation , min=0.,max=360.
uniform float parallax; // = -1; // Parallax , min=-1., max=1.
uniform vec4 FColor; // = vec4(1.,1.,1.); // Color


//Procedural Flare Generation
float sun(vec2 uv, vec2 pos, float size)
{
    vec2 main = uv-pos;
	
	float ang = atan(main.y, main.x);
	float dist=length(main); dist = pow(dist,.1);
	
	float rot = radians(rotation+globalRotate)*evolution;
	mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv  = m*uv;
   	pos = m*pos;
	
	float f0 = 1.0/((length((uv.y-pos.y*-parallax)/(uv.x-pos.x)))*(1.0/size*100)/(thickness*globalSize));
    
    return f0+f0*(sin((ang)*raycount)*raydepth+dist*.1+.9);
}


void main(void)
{
    
	vec2 uv = gl_FragCoord.xy / scenePos.xy - 0.5;
	uv.x *= scenePos.x/scenePos.y; //fix aspect ratio
	vec2 mouse = vec2(Position.xy/scenePos.xy - 0.5);
	mouse.x *= scenePos.x/scenePos.y; //fix aspect ratio
	float c = sun(uv,mouse.xy,1.);
	
    vec2 xy = gl_FragCoord.xy / scenePos.xy;
    vec4 linker = texture(texture,xy);
	
	fragColor = vec4(c*FColor.rgb,texture(texture,texCoord).a)+linker;
}
