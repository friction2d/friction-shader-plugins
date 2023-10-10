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
uniform float decay;  
uniform vec4 FColor;  


//Procedural Flare Generation
float glow(vec2 uv, vec2 pos, float size)
{
    float rot = radians(globalRotate)*evolution;
    mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    uv  = m*uv;
    pos = m*pos;

    vec2 main = uv-pos;

    float ang = atan(main.y, main.x);
    float dist=length(main); dist = pow(dist,.1);


    float f0 = 1./(length(main*decay)*(1.0/size*100)/(coresize*globalSize));
    return f0;
}


void main(void)
{
    
	vec2 uv = gl_FragCoord.xy / resolution.xy *2.0-1.0;
	uv.x *= resolution.x/resolution.y; //fix aspect ratio
	vec3 mouse = vec3(Position.xy/resolution.xy,0.0);
	mouse.x *= resolution.x/resolution.y; //fix aspect ratio
	float c = glow(uv,mouse.xy,1.);
	
	vec4 linker = texture2D(texture,texCoord);
	
	fragColor = vec4(c*FColor.rgb,1.0)+linker;
}
