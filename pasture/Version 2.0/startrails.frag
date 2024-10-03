/* Adapted from https://www.shadertoy.com/view/Wtl3D7
// Rebuilt for enve by axiomgraph
// Opengl version 3.3*/
#version 330 core
#ifdef GL_ES
precision mediump float; 
#endif

#define PI 3.1415926

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;
uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;


uniform vec2 position;
uniform float scale;
uniform vec4 color;// = vec3(.3,0.3,.5);
uniform vec4 bgcolor;// =vec3(0.2,0.0,0.2) ;


float rand(float t)
{
    return fract(sin(dot(vec2(t,t) ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void)
{
	float time=iTime;
	vec2 uv=(gl_FragCoord.xy*2.0-resolution.xy)/resolution.y;
 	vec2 uv1=uv-position; 
    
    float r = length(uv1)*scale; 
    
    float t = ceil(r);
    float a = fract(atan(uv1.y, uv1.x)/PI+time*rand(t)*.1 +t*0.1);

    float ang = rand(t);
    float c = smoothstep(ang,ang-1.5,a*5.) ;
    
    vec3 col = color.rgb*3.; 
    
    // float rr = length(uv-vec2(0.6,1.4))-0.8; Add gradient option
    
	//vec3 coll=vec3(0.,rr*0.1,rr*0.24);
    
 //   vec3 coll=vec3(0.2,0.0,0.2); /// background color
    
   vec3 coll=mix(bgcolor.rgb,col*rand(t),c*step(0.1,r/111.));
    
    fragColor=vec4(coll,texture(texture,texCoord).a);
}

