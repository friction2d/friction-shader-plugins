/* Adapted from  https://www.shadertoy.com/view/ttB3Rt  Shader License: CC BY 3.0
Rebuilt for enve/friction by axiomgraph
 Opengl version 3.3*/
 
#version 330 core
#define PI 3.14159
#define TWO_PI 6.283185
#define FREQ_STEP (0.001953125 * 3.0)

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;
uniform int randomsize;
uniform float PARTICLE_ITERATIONS; // 6.0
uniform float PARTICLE_RADIUS; //  0.15
uniform float PARTICLE_RADIUS2; // 0.3
uniform float PARTICLE_SIZE_VARIATION; // 0.2
uniform vec4 PARTICLE_COLOR; // 0.3, 0.9, 0.9
uniform float BRIGHTNESS; // 0.45

bool RANDOMIZED_SIZE = bool(randomsize); // boolean value


float pow3(in float x)
{
 	return x*x*x;   
}

float hash1_2(in vec2 x)
{
 	return fract(sin(dot(x, vec2(52.127, 61.2871))) * 521.582);   
}

vec2 hash2_3(in vec3 x)
{
    return fract(sin(x * mat2x3(20.5283, 24.1994, 70.2913, 
                                89.9132, 57.1454, 45.1211)) * 492.194);
}

                 
//Simple interpolated noise
vec2 noise2_3(vec3 coord)
{
    //vec3 f = fract(coord);
    vec3 f = smoothstep(0.0, 1.0, fract(coord));
 	
    vec3 uv000 = floor(coord);
    vec3 uv001 = uv000 + vec3(0,0,1);
    vec3 uv010 = uv000 + vec3(0,1,0);
    vec3 uv011 = uv000 + vec3(0,1,1);
    vec3 uv100 = uv000 + vec3(1,0,0);
    vec3 uv101 = uv000 + vec3(1,0,1);
    vec3 uv110 = uv000 + vec3(1,1,0);
    vec3 uv111 = uv000 + vec3(1,1,1);
    
    vec2 v000 = hash2_3(uv000);
    vec2 v001 = hash2_3(uv001);
    vec2 v010 = hash2_3(uv010);
    vec2 v011 = hash2_3(uv011);
    vec2 v100 = hash2_3(uv100);
    vec2 v101 = hash2_3(uv101);
    vec2 v110 = hash2_3(uv110);
    vec2 v111 = hash2_3(uv111);
    
    vec2 v00 = mix(v000, v001, f.z);
    vec2 v01 = mix(v010, v011, f.z);
    vec2 v10 = mix(v100, v101, f.z);
    vec2 v11 = mix(v110, v111, f.z);
    
    vec2 v0 = mix(v00, v01, f.y);
    vec2 v1 = mix(v10, v11, f.y);
    vec2 v = mix(v0, v1, f.x);
    
    return v;
}

//Simple interpolated noise
float noise1_2(in vec2 uv)
{
    vec2 f = fract(uv);
    //vec2 f = smoothstep(0.0, 1.0, fract(uv));
    
 	vec2 uv00 = floor(uv);
    vec2 uv01 = uv00 + vec2(0,1);
    vec2 uv10 = uv00 + vec2(1,0);
    vec2 uv11 = uv00 + 1.0;
    
    float v00 = hash1_2(uv00);
    float v01 = hash1_2(uv01);
    float v10 = hash1_2(uv10);
    float v11 = hash1_2(uv11);
    
    float v0 = mix(v00, v01, f.y);
    float v1 = mix(v10, v11, f.y);
    float v = mix(v0, v1, f.x);
    
    return v;
}


//Calculates particle movement
vec2 cellPointFromRootUV(vec2 rootUV, vec2 originalUV, out float len)
{
    vec2 displacement = (noise2_3(vec3(rootUV * 0.07 + iTime * 0.3, 0.5 * (iTime + 0.1) * 1.0 + noise1_2(originalUV * 0.04))) - 0.5);
 	len = dot(displacement, displacement);
    return displacement * 3.0 * (PARTICLE_ITERATIONS) + 0.5 + rootUV;   
}

//Calculates particle size
float particleFromUVAndPoint(in vec2 uv, in vec2 point, in vec2 rootUV, in float pixelSize)
{
	float dist = distance(uv, point);
if ( RANDOMIZED_SIZE) {
    dist += (hash1_2(rootUV * 10.0) - 0.5) * PARTICLE_SIZE_VARIATION;
    }

    float particle = 1.0 - smoothstep(PARTICLE_RADIUS - dist * 0.05, PARTICLE_RADIUS2 - dist * 0.05 + pixelSize, dist);
    return particle * particle;
}

//Particle system
vec3 surfaceParticles(in vec2 uv, in float pixelSize)
{
    vec3 particles = vec3(0.0);
 	vec2 rootUV = floor(uv);
    
   	vec2 tempRootUV;
    vec2 pointUV;
    float dist;
    vec3 color;
    for (float x = -PARTICLE_ITERATIONS; x <= PARTICLE_ITERATIONS; x += 1.0)
    {
        for (float y = -PARTICLE_ITERATIONS; y <= PARTICLE_ITERATIONS; y += 1.0)
        {
            tempRootUV = rootUV + vec2(x, y);
            pointUV = cellPointFromRootUV(tempRootUV, uv, dist);
          	color = mix(vec3(0), PARTICLE_COLOR.rgb *1.0, pow(smoothstep(0.3, 0.0, dist), 4.0));
            particles += particleFromUVAndPoint(uv, pointUV, tempRootUV, pixelSize) * color;
        }
    }
    
    return particles;
}

void main(void)
{
    vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.x;
    
    float vignette = 1.0 - smoothstep(0.5, 1.3, length(uv* vec2(1.0, resolution.x / resolution.y)));
    
    //for antialiasing
    float pixelSize = 1.5 / resolution.x;	
    
    uv *= 70.0;
    pixelSize *= 70.0;
    
    vec3 particles = surfaceParticles(uv, pixelSize) * BRIGHTNESS;
    
    //postprocess
    particles = smoothstep(-0.2, 0.8, particles * vignette);
    
    fragColor = vec4(particles, texture(texture,texCoord).a);
}
