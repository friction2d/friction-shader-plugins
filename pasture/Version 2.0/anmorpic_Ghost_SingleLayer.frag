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

//parametres
uniform int objectCount; //= 5; // Object Count, min=0, max=30
uniform int intesmult; //= 1; // Intensity Multiplyer, min=1, max=10
uniform float objectdist; // = 0.16; // Object Distance , min=-2.,max=2.
uniform float tapperness; // = 1.0; // Tapperness, min=0., max=1.
uniform vec2 cpos; // = 0.0; // Position X , min=-2.,max=2.
uniform vec2 size; // = .20; // Scale X , min=0., max=10. uniform float rotation = 0.0; // Rotation , min=0.,max=360.
uniform float rotation;
uniform float Thresold; // = .03; // Round Corner, min=0., max=10.
uniform float Hardness; // = 3.6; // Hardness, min=0.0, max=50.
uniform float parallax; // = -1.0; // Parallax , min=-1., max=1.
uniform vec4 Color; // = vec3(1.,1.,1.); // Color


const float      PI = 3.14159265359;
const float  TWO_PI = 6.28318530718;

//creates a adjustable Anamorphic spot
float circleBox(vec2 uv, vec2 pos, vec2 size, float cornerRadius, float between)
{
    vec2 main = uv-pos;
	float ang = atan(main.y, main.x);
	float dist=length(main); dist = pow(dist,.1);
	
    float rot = radians(rotation);
	mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv  = m*uv;
   	pos = m*pos;
    

    float sd = (length(uv-pos) - size.x); // circle
    size -= vec2(cornerRadius);           // rounded box
    vec2 d = (abs(uv-pos) - size);
    float box = min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - cornerRadius;
    float v = (1.0 - between)*sd + box*between;  //mix
    float f = clamp (Hardness*-v , 0.0, 1.0);
    return f;
}

float objects(vec2 uv, vec2 pos)
{
    float c = 0.0;
    for(int i=0; i<objectCount; i++){
        c+= circleBox(vec2((uv.x+cpos.x+(float(i)*(objectdist-pos.x*.2))),(uv.y+cpos.y)), pos*-parallax, vec2(size.x,size.y)*globalSize, Thresold, tapperness);
    }
    
    return c*float(intesmult);
}

void main(void)
{
	vec2 uv = texCoord*2.0-1.0;
	uv.x *= resolution.x / resolution.y;	
	vec2 mouse = Position.xy/resolution.xy;
	mouse.x *= resolution.x / resolution.y;
	
	vec4 linker = texture(texture,texCoord);
	
	float c = objects(uv, mouse);
	fragColor = vec4(vec3(c*Color.rgb), 1)+linker;
}
