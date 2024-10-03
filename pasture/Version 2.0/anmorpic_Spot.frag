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

//parametres
uniform int objectCount; 
uniform int intesmult; 
uniform float objectdist; 
uniform float tapperness;  
uniform vec2 cpos; 
uniform vec2 size;  
uniform float randomized; 
uniform float rotation; 
uniform float RoundCorner;  
uniform float intensity;  
uniform float brightness;  
uniform float parallax; 
uniform vec4 BGColor; 
uniform vec4 Color1; 
uniform vec4 Color2;
uniform vec4 Color3;


const float      PI = 3.14159265359;
const float  TWO_PI = 6.28318530718;

float rand(float n){
    return fract(cos(n*89.42)*343.42);
}

//creates a adjustable Anamorphic spot
vec3 circleBox(vec2 uv, vec2 pos, vec2 size, float cornerRadius, float between, vec3 color, float intens)
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
    float f = clamp (intens*-v , 0.0, 1.0);
    return f*color;
}

vec3 objects(vec2 uv, vec2 pos)
{
    vec3 c = vec3(0.0);
    for(int i=0; i<objectCount; i++){
        //Top
        c+= circleBox(vec2((uv.x+cpos.x+float(i)*(objectdist-pos.x*rand(float(i)*randomized*2.9))), (uv.y+cpos.y)), pos*-parallax, //position
        vec2(size.x,size.y)*globalSize*rand(float(i)*randomized*1.9), //size
        RoundCorner, tapperness, Color1.rgb, 
        intensity*rand(float(i)*randomized*.9));//intensity
        
        c+= circleBox(vec2((uv.x-cpos.x-float(i)*(objectdist-pos.x*rand(float(i)*randomized*5.9))), (uv.y+cpos.y)), pos*-parallax, //position
        vec2(size.x,size.y)*globalSize*rand(float(i)*randomized*4.9), //size
        RoundCorner, tapperness, Color2.rgb, 
        intensity*rand(float(i)*randomized*.5))*brightness;//intensity
        
        c+= circleBox(vec2((uv.x+cpos.x+float(i)*(objectdist-pos.x*rand(float(i)*randomized*8.9))), (uv.y+cpos.y)), pos*-parallax, //position
        vec2(size.x,size.y)*globalSize*rand(float(i)*randomized*7.9), //size
        RoundCorner, tapperness, Color3.rgb, 
        intensity*rand(float(i)*randomized*.6))*brightness;//intensity
        
        //bottom
        c+= circleBox(vec2((uv.x+cpos.x+float(i)*(objectdist-pos.x*rand(float(i)*randomized*4.9))), (uv.y+(cpos.y*-1))), pos*-parallax, //position
        vec2(size.x,size.y)*globalSize*rand(float(i)*randomized*1.9), //size
        RoundCorner, tapperness, Color3.rgb, 
        intensity*rand(float(i)*randomized*.8))*brightness;//intensity
        
        c+= circleBox(vec2((uv.x-cpos.x+float(i)*(objectdist-pos.x*rand(float(i)*randomized*5.9))), (uv.y+(cpos.y*-1))), pos*-parallax, //position
        vec2(size.x,size.y)*globalSize*rand(float(i)*randomized*6.9), //size
        RoundCorner, tapperness, Color1.rgb, 
        intensity*rand(float(i)*randomized*1.9))*(brightness*rand(float(i)*randomized*.9));//intensity
        
        c+= circleBox(vec2((uv.x+cpos.x-float(i)*(objectdist-pos.x*rand(float(i)*randomized*2.9))), (uv.y+(cpos.y*-1))), pos*-parallax, //position
        vec2(size.x,size.y)*globalSize*rand(float(i)*randomized*3.9), //size
        RoundCorner, tapperness, Color2.rgb, 
        intensity*rand(float(i)*randomized*1.5))*(brightness*rand(float(i)*randomized*2.9));//intensity
        
        //mid
        c+= circleBox(vec2((uv.x+0.0+float(i)*(objectdist-pos.x*rand(float(i)*randomized*4.9))), (uv.y+(0.0*-1))), pos*-parallax, //position
        vec2(size.x*.5,size.y*4)*globalSize*rand(float(i)*randomized*1.9), //size
        RoundCorner*1.5, tapperness, Color3.rgb, 
        intensity*rand(float(i)*randomized*8))*(brightness*rand(float(i)*randomized*2.9));//intensity
        
        c+= circleBox(vec2((uv.x-0.0+float(i)*(objectdist-pos.x*rand(float(i)*randomized*5.9))), (uv.y+(0.0*-1))), pos*-parallax, //position
        vec2(size.x*.3,size.y*2)*globalSize*rand(float(i)*randomized*6.9), //size
        RoundCorner*.8, tapperness, Color1.rgb, 
        intensity*rand(float(i)*randomized*1.9));//intensity
        
        c+= circleBox(vec2((uv.x+cpos.x-float(i)*(objectdist-pos.x*rand(float(i)*randomized*2.9))), (uv.y+(0.0*-1))), pos*-parallax, //position
        vec2(size.x*.7,size.y*2)*globalSize*rand(float(i)*randomized*10.9), //size
        RoundCorner*1.2, tapperness, Color2.rgb, 
        intensity*rand(float(i)*randomized*.2));//intensity
        
        //mid Blur
        c+= circleBox(vec2((uv.x+0.0+float(i)*(objectdist-pos.x*rand(float(i)*randomized*2.9))), (uv.y+0.0)), pos*-parallax, //position
        vec2(size.x,size.y*10)*globalSize*rand(float(i)*randomized*8.9), //size
        RoundCorner*3, tapperness, Color1.rgb,
        intensity*rand(float(i)*randomized*0.2)*.02);//intensity
        
        c+= circleBox(vec2((uv.x+0.0-float(i)*(objectdist-pos.x*rand(float(i)*randomized*2.9))), (uv.y+0.0)), pos*-parallax, //position
        vec2(size.x*3,size.y*5)*globalSize*rand(float(i)*randomized*8.9), //size
        RoundCorner*2, tapperness, Color2.rgb,
        intensity*rand(float(i)*randomized*0.2)*.02);//intensity
        
        c+= circleBox(vec2((uv.x+0.0+float(i)*(objectdist-pos.x*rand(float(i)*randomized*2.9))), (uv.y+0.0)), pos*-parallax, //position
        vec2(size.x*5,size.y*8)*globalSize*rand(float(i)*randomized*8.9), //size
        RoundCorner*5, tapperness, Color3.rgb,
        intensity*rand(float(i)*randomized*0.2)*.01)*brightness;//intensity
        
//         //filler
//         c+= circleBox(vec2((uv.x-0.0+float(i)*(objectdist-pos.x*rand(float(i)*randomized*5.9))), (uv.y+0.0)), pos*-parallax, //position
//         vec2(sizex*7,sizey*10)*globalSize*rand(float(i)*randomized*4.9), //size
//         RoundCorner, tapperness*.5, Color2, 
//         intensity*rand(float(i)*randomized*0.1)*.02);//intensity
//         
//         c+= circleBox(vec2((uv.x+0.0+float(i)*(objectdist-pos.x*rand(float(i)*randomized*8.9))), (uv.y+0.0)), pos*-parallax, //position
//         vec2(sizex*10,sizey*9)*globalSize*rand(float(i)*randomized*7.9), //size
//         RoundCorner, tapperness*.8, Color3, 
//         intensity*rand(float(i)*randomized*0.5)*.03);//intensity
    }
    
    return c*intesmult;
}

void main(void)
{
	vec2 uv = texCoord*2.0-1.0;
	uv.x *= resolution.x / resolution.y;	
	vec2 mouse = Position.xy/resolution.xy;
	mouse.x *= resolution.x / resolution.y;
	vec4 linker = texture(texture,texCoord);	
	vec3 c = objects(uv, mouse);
	fragColor = vec4(c*BGColor.rgb, 1.0)+linker;
}
