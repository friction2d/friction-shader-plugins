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

//Params
uniform int corpoly;  
uniform int Polycount; 
uniform int MIrisAmount;  
uniform float MIrisDistance;  
uniform float MIrisSize;  
uniform float randomized;  
uniform float MIrisPosition; 
uniform float MIrisOpacity;  
uniform float brightness;  
uniform vec4 MIrisColor;  


const float      PI = 3.14159265359;
const float  TWO_PI = 6.28318530718;


float rand(float n){
    return fract(cos(n*89.42)*343.42);
}

//multi_iris Objects
vec3 miris(vec2 uv, vec2 pos, float dist, float size, float irisize, int n, float irisopacity, vec3 iriscolor)
{
    float rot = radians(globalRotate)*evolution;
    mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    uv  = m*uv;
    pos = m*pos;


    if (corpoly == 0){
        float r = max(0.01-pow(length(uv+(dist)*pos),1.*irisize)*(1./(size*irisize)),.0)*irisopacity;
        float g = max(0.01-pow(length(uv+(dist)*pos),1.*irisize)*(1./(size*irisize)),.0)*irisopacity;
        float b = max(0.01-pow(length(uv+(dist)*pos),1.*irisize)*(1./(size*irisize)),.0)*irisopacity;
    
        return vec3(r,g,b)*iriscolor;}
    
    else{
        vec2 p = uv+(dist)*pos;
        float angle = atan(p.x, p.y) + PI;
        float r = TWO_PI / float(n);
        float d = cos(floor(0.5 + angle / r) * r - angle) * length(p) / (size*(irisize*.04));
        
        return vec3(smoothstep(1.0,.1,d)*irisopacity*.01)*iriscolor;}
    
}

vec3 lensflare(vec2 uv,vec2 pos, float b, float size)
{
    
    vec3 c = vec3(0.0,0.0,0.0);
    
    for (int i=0; i<MIrisAmount; i++){
        c+= miris(uv, pos, MIrisDistance*float(i)+rand(float(i)*randomized)+MIrisPosition, size*rand(float(i)+randomized)*2.0, MIrisSize*globalSize, Polycount, MIrisOpacity, MIrisColor.rgb);
    }

    return c*b;
}


void main(void)
{
	vec2 uv = texCoord*2.0-1.0;	 
	uv.x *= resolution.x / resolution.y;	
	vec2 mouse = Position.xy/resolution.xy;	 
	mouse.x *= resolution.x / resolution.y;     
	vec4 linker = texture2D(texture,texCoord);	
	vec3 c = lensflare(uv,mouse,brightness,1.);	
	fragColor = vec4(c, 1)+linker;
}
