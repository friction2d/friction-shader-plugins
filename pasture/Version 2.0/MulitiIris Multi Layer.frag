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

//multi_iris Params
uniform int corpoly; 
uniform int Polycount;  
uniform int MIrisAmount; 
uniform float MIrisDistance;  
uniform float MIrisSize;  
uniform float randomized;  
uniform float MIrisPosition;  
uniform float MIrisOpacity;
uniform float brightness;
uniform vec4 MIrisColor1;
uniform vec4 MIrisColor2;
uniform vec4 MIrisColor3;


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
        float r = TWO_PI / n;
        float d = cos(floor(0.5 + angle / r) * r - angle) * length(p) / (size*(irisize*.04));
        
        return vec3(smoothstep(1.0,.1,d)*irisopacity*.01)*iriscolor;}
    
}


vec3 lensflare(vec2 uv,vec2 pos, float b, float size)
{
    
    vec3 c = vec3(0.0,0.0,0.0);
    
    for (int i=0; i<MIrisAmount; i++){
        c+= miris(uv, pos, MIrisDistance*i+rand(i*randomized*8.9)+MIrisPosition, size*rand(i+randomized*2.5)*5.24, MIrisSize*globalSize, Polycount,  MIrisOpacity*0.8, MIrisColor1.rgb);
        c+= miris(uv, pos, MIrisDistance*i+rand(i*randomized*5.6)+MIrisPosition, size*rand(i+randomized*4.5)*3.78, MIrisSize*globalSize, Polycount, MIrisOpacity*1.2, MIrisColor3.rgb);
        c+= miris(uv, pos, MIrisDistance*i+rand(i*randomized*7.9)+MIrisPosition, size*rand(i+randomized*1.5)*1.33, MIrisSize*globalSize, Polycount, MIrisOpacity, MIrisColor2.rgb);
        c+= miris(uv, pos, MIrisDistance*i+rand(i*randomized*2.3)+MIrisPosition, size*rand(i+randomized*7.8)*0.56, MIrisSize*globalSize, Polycount, MIrisOpacity*1.5, MIrisColor1.rgb);
    }

    return c*b;
}


void main(void)
{
	vec2 uv = texCoord*2.0-1.0;
	uv.x *= resolution.x / resolution.y;
	
	vec2 mouse = Position.xy/resolution.xy;
	mouse.x *= resolution.x / resolution.y;
	vec4 linker = texture(texture,texCoord);
	
	vec3 c = lensflare(uv,mouse,brightness,1.);
	
	fragColor = vec4(c, 1)+linker;
}
