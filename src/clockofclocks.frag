/* Adapted from https://www.shadertoy.com/view/ws2XRd
Rebuilt for enve by axiomgraph
 Opengl version 3.3*/
#version 330 core

#define PI 3.14159265359
#define TAU 6.28318530718f

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float NumberOfAnimations;

uniform float hours; 
uniform float  minutes;
uniform float  seconds;


float date = (hours*3600.0)+(minutes*60.0)+seconds;

const vec2 o[11] = vec2[11](
    vec2(359.9,180.), 	//vertical 0
    vec2(90.,270.), 	//horizontal 1
    vec2(359.9,90.), 	//bottomLeftCorner 2
    vec2(90.,180.),		//topLeftCorner 3
    vec2(270.,180.), 	//topRightCorner 4
    vec2(359.9,270.), 	//bottomRightCorner 5
    vec2(135,135),    	//"hidden" 6
    vec2(359.9,359.9),	//botStump 7
    vec2(180,180),		//topStump 8
    vec2(90,90),		//leftStump 9
    vec2(270,270)		//rightStump 10
    );

const vec2 numbers[4*8*10] = vec2[4*8*10](
    o[2],o[1],o[1],o[5],
    o[0],o[2],o[5],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[3],o[4],o[0],
    o[3],o[1],o[1],o[4],
    //ONE
    o[6],o[6],o[2],o[5],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[6],o[2],o[4],o[0],
    o[6],o[3],o[1],o[4],
    //TWO
    o[2],o[1],o[1],o[5],
    o[0],o[2],o[1],o[4],
    o[0],o[0],o[6],o[6],
    o[0],o[3],o[1],o[5],
    o[3],o[1],o[5],o[0],
    o[6],o[6],o[0],o[0],
    o[2],o[1],o[4],o[0],
    o[3],o[1],o[1],o[4],
    //THREE
    o[2],o[1],o[1],o[5],
    o[3],o[1],o[5],o[0],
    o[6],o[6],o[0],o[0],
    o[2],o[1],o[4],o[0],
    o[3],o[1],o[5],o[0],
    o[6],o[6],o[0],o[0],
    o[2],o[1],o[4],o[0],
    o[3],o[1],o[1],o[4],
    //FOUR
    o[6],o[6],o[2],o[5],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[2],o[1],o[4],o[0],
    o[0],o[2],o[5],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[0],o[0],o[0],
    o[3],o[4],o[3],o[4],
    //FIVE
    o[2],o[1],o[1],o[5],
    o[3],o[1],o[5],o[0],
    o[6],o[6],o[0],o[0],
    o[2],o[1],o[4],o[0],
    o[0],o[2],o[1],o[4],
    o[0],o[0],o[6],o[6],
    o[0],o[3],o[1],o[5],
    o[3],o[1],o[1],o[4],
    //SIX
    o[2],o[1],o[1],o[5],
    o[0],o[2],o[5],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[3],o[4],o[0],
    o[0],o[2],o[1],o[4],
    o[0],o[0],o[6],o[6],
    o[0],o[3],o[1],o[5],
    o[3],o[1],o[1],o[4],
    //SEVEN
    o[6],o[6],o[2],o[5],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[6],o[6],o[0],o[0],
    o[2],o[1],o[4],o[0],
    o[3],o[1],o[1],o[4],
    //EIGHT
    o[2],o[1],o[1],o[5],
    o[0],o[2],o[5],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[3],o[4],o[0],
    o[0],o[2],o[5],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[3],o[4],o[0],
    o[3],o[1],o[1],o[4],
    //NINE
    o[2],o[1],o[1],o[5],
    o[0],o[2],o[5],o[0],
    o[3],o[4],o[0],o[0],
    o[2],o[1],o[4],o[0],
    o[0],o[2],o[5],o[0],
    o[0],o[0],o[0],o[0],
    o[0],o[3],o[4],o[0],
    o[3],o[1],o[1],o[4]
    );

//https://gist.github.com/itsmrpeck/be41d72e9d4c72d2236de687f6f53974
float lerpRadians(float a, float b, float lerpFactor) // Lerps from angle a to b (both between 0.f and TAU), taking the shortest path
{
    float result;
    float diff = b - a;
    if (diff < -PI)        // lerp upwards past TAU
    {
        b += TAU;
        result = mix(a, b, lerpFactor);
        if (result >= TAU)
        {
            result -= TAU;
        }
    }
    else if (diff > PI)        // lerp downwards past 0
    {
        b -= TAU;
        result = mix(a, b, lerpFactor);
        if (result < 0.f)
        {
            result += TAU;
        }
    }
    else         // straight lerp
    {
        result = mix(a, b, lerpFactor);
    }

    return result;
}

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}

vec2 getRotation(int x, int y, int n) {
	return numbers[((4 * y) + x) + (n * 32)];
}

float distanceToSegment( in vec2 p, in vec2 a, in vec2 b ) 
{
    //Iq's function (I use this for smooth lines)
	vec2 pa = p-a;
	vec2 ba = b-a;
	float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
	return length( pa - ba*h );
}

int getNumber(int time, int digit)
{
    float d = mod(float(digit), 2.);
    int t = int(mod(float(time),10.0) * (1.0 - d));
    t += (time / 10) * int(d);
    
    return t;
}

vec2 displayTimeWithWave(in vec2 uv, in vec2 id,in float frac)
{    
    id.x -= 10.;
    id.y += 4.;
    vec2 rotation = vec2(0,0);
	vec2 nextRotation = vec2(0,0);
    float time = date ;
    float nextTime = time + 1.;
    
    float check = 0.;
    
    //digits
    for(int i =0; i < 3; i++){
        for(int j = 0; j < 2; j++){
            check = when_gt(id.x, -1.0) * when_lt(id.x, 4.)* when_gt(id.y, -1.0) * when_lt(id.y,8.);
            
            rotation += getRotation(int(id.x), int(id.y), getNumber(int(mod(time, 60.)),j)) 
                * check;

            nextRotation += getRotation(int(id.x), int(id.y), getNumber(int(mod(nextTime, 60.)), j))
                * check;

            id.x += 4.;
        }
        id.x += 2.;
        time = floor(time / 60.);
        nextTime = floor(nextTime / 60.);
    }
    
    //colons
    id.x -=13.;
    for(int i = 0; i < 2; i++) {
        check = when_gt(id.x, 0.0) * when_lt(id.x, 3.)* when_gt(id.y, 1.0) * when_lt(id.y,6.);
        rotation.x += (270. + 180. * id.x) * check;
        nextRotation.x += (270. + 180. * id.x) * check;
        rotation.y += (0. + 180. * id.y) * check;
        nextRotation.y += (0. + 180. * id.y) * check;
        id.x -=10.;
    }    
    
    //reset id for animation
   	id = floor(uv);   
    
    //lerp between current time and next time(time+1)
    float clockLerp = clamp(mod(date * 2.,2.),0.,1.);
    float h = mix(rotation.x, nextRotation.x, clockLerp);
    float m = mix(rotation.y, nextRotation.y, clockLerp);
    
    //animate the non clock part
    float animLerp = mod(id.x * .035 + id.y * .035 + frac,2.);
    h += (90. + id.x * 0. - animLerp * 360. ) * (1. - clamp(rotation.x,0.,1.));
    m += (270. + id.y * 0. + animLerp * 360. ) * (1. - clamp(rotation.y,0.,1.));
    
    float radianHour = radians(mod(h,360.));
    float radianMinute = radians(mod(m,360.));
    
    return vec2(radianHour,radianMinute);
}

vec2 waveAnimation(in vec2 uv, in vec2 id, in float frac)
{
    float animLerp = mod(id.x * .035 + id.y * .035 + (frac - 1.0),2.);
    float h = (90. + id.x * 0. - animLerp * 360. );
    float m = (-90. + id.y * 0. + animLerp * 360. );
    
    float radianHour = radians(mod(h,360.));
    float radianMinute = radians(mod(m,360.));
    
    return vec2(radianHour,radianMinute);
}

vec2 boxAnimation(in vec2 uv, in vec2 id, in float frac)
{    
    vec2 rotation = vec2(0,0);
    
    float h = (90. + id.x * 180. + frac * 360. );
    float m = (0. - id.y * 180. + frac * 360. );
      
    float radianHour = radians(mod(h,360.));
    float radianMinute = radians(mod(m,360.));
    
    return vec2(radianHour,radianMinute);
}

vec2 boxAnimation2(in vec2 uv, in vec2 id, in float frac)
{    
    vec2 rotation = vec2(0,0);
    
    float h = (90. + id.x * 180. + frac * 360. );
    float m = (0. - id.y * 180. - frac * 360. );
       
    float radianHour = radians(mod(h,360.));
    float radianMinute = radians(mod(m,360.));
    
    return vec2(radianHour,radianMinute);
}

vec2 diamondAnimation(in vec2 uv, in vec2 id, in float frac)
{   
    vec2 rotation = vec2(0,0);
    
    float h = 45. + clamp((frac*34.) - (abs(id.x)) - (abs(id.y)),0.,34.) * 11.25;
    float m = -135. + clamp((frac*34.) - (abs(id.x)) - (abs(id.y)),0.,34.) * 11.25;
       
    float radianHour = radians(mod(h,360.));
    float radianMinute = radians(mod(m,360.));
    
    return vec2(radianHour,radianMinute);
}

// Animation transition code
// Lifted from Klems, https://www.shadertoy.com/view/ll2SWW
vec2 getAnimation(int fx, vec2 uv, vec2 id, float frac) 
{
 	vec2 value = vec2(0,0);
    fx = int(mod(float(fx), NumberOfAnimations));
    if(fx == 0) value = displayTimeWithWave(uv,id,frac);
    else if(fx == 1) value = boxAnimation(uv,id,frac);
   	else if(fx == 2) value = boxAnimation2(uv,id,frac);
    else if(fx == 3) value = diamondAnimation(uv,id,frac);
    else value = waveAnimation(uv,id,frac);
    
    return value;   
}

vec2 getFinalRotation(in vec2 uv, in vec2 id) 
{
    float animationTime = 5.;
    float segue = .8; 
    int fx = int(date / animationTime);
    float frac = mod(date, animationTime)/ animationTime;
   
	vec2 valueA = getAnimation(fx, uv, id, frac - segue);
    vec2 valueB = getAnimation(fx - 1, uv, id, (1. - segue) + frac);
    
    return vec2(lerpRadians(valueB.x,valueA.x,smoothstep(segue,1.0,frac)),
                lerpRadians(valueB.y,valueA.y,smoothstep(segue,1.0,frac)));   
}

void main(void)
{
    vec2 uv = (gl_FragCoord.xy -.5 * resolution.xy)/resolution.y;
    uv*= 22.;
      
   	float p = 20./min(resolution.x, resolution.y);
    
    //draw circles
    vec2 gv = fract(uv) - 0.5;   
    float d = length(gv);
    float outerCircle = smoothstep(0.485 + p, 0.485 - p, d);
    float innerCircle = smoothstep(0.445 - p, 0.445 + p, d);
	vec3 col = vec3(1,1,1);

    //Get rotation
   	vec2 id = floor(uv);   
    vec2 radian = getFinalRotation(uv,id);
    
    //draw clock hands
    col -= smoothstep(1.0-p, 1.0+p,1. - ((distanceToSegment(gv, vec2(0.),vec2(sin(radian.x),cos(radian.x))*.4) - .04)));
    col -= smoothstep(1.0-p, 1.0+p,1. - ((distanceToSegment(gv, vec2(0.),vec2(sin(radian.y),cos(radian.y))*.3) - .04)));
    
    col -= ((innerCircle * outerCircle) * .3);
    //debug
    //col = vec3(radian.x/(PI*2.),0,0);
    
    //white border and darken
    col += 2. * (1. - (when_gt(id.x, -18.0) * when_lt(id.x, 17.)* when_gt(id.y, -8.0) * when_lt(id.y,7.)));
   	col = clamp(col,0.,1.);
    col -= .1;

    fragColor = vec4(col,texture2D(texture,texCoord).a);
}
