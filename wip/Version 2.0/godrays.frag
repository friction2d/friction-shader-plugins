/* Adapted from https://godotshaders.com/shader/god-rays/ Author : pend00 
 Adapted for enve/friction by axiomgraph
 Opengl version 3.3*/
#version 330 core
#define PI 3.1415926535
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture; 
in vec2 texCoord;

uniform float time;
uniform float angle; 
uniform float position; 
uniform float spread; 
uniform float cutoff; 
uniform float falloff; 
uniform float edge_fade; 

uniform float speed; 
uniform float ray1_density; 
uniform float ray2_density; 
uniform float ray2_intensity; 

uniform vec4 color; 

uniform int hdr;  // boolean value
uniform float seed; 

// Random and noise functions from Book of Shader's chapter on Noise.
float random(vec2 _uv) {
    return fract(sin(dot(_uv.xy,
                         vec2(12.9898, 78.233))) *
        43758.5453123);
}

float noise (in vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));


    // Smooth Interpolation

    // Cubic Hermine Curve. Same as SmoothStep()
    vec2 u = f * f * (3.0-2.0 * f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

mat2 rotate(float _angle){
    return mat2(vec2(cos(_angle), -sin(_angle)),
                vec2(sin(_angle), cos(_angle)));
}


void main(void)
{
	
	// Rotate, skew and move the UVs
	vec2 transformed_uv = ( rotate(angle) * (texCoord - position) )  / ( (texCoord.y + spread) - (texCoord.y * spread) );
	
	// Animate the ray according the the new transformed UVs
	vec2 ray1 = vec2(transformed_uv.x * ray1_density + sin(time * 0.1 * speed) * (ray1_density * 0.2) + seed, 1.0);
	vec2 ray2 = vec2(transformed_uv.x * ray2_density + sin(time * 0.2 * speed) * (ray1_density * 0.2) + seed, 1.0);
	
	// Cut off the ray's edges
	float cut = step(cutoff, transformed_uv.x) * step(cutoff, 1.0 - transformed_uv.x);
	ray1 *= cut;
	ray2 *= cut;
	
	// Apply the noise pattern (i.e. create the rays)
	float rays;
	
	if (bool(hdr)){
		// This is not really HDR, but check this to not clamp the two merged rays making 
		// their values go over 1.0. Can make for some nice effect
		rays = noise(ray1) + (noise(ray2) * ray2_intensity);
	}
	else{
		 rays = clamp(noise(ray1) + (noise(ray2) * ray2_intensity), 0., 1.);
	}
	
	// Fade out edges
	rays *= smoothstep(0.0, falloff, (1.0 - texCoord.y)); // Bottom
	rays *= smoothstep(0.0 + cutoff, edge_fade + cutoff, transformed_uv.x); // Left
	rays *= smoothstep(0.0 + cutoff, edge_fade + cutoff, 1.0 - transformed_uv.x); // Right
	
	// Color to the rays
	vec3 shine = vec3(rays) * color.rgb;
 
	
	fragColor = vec4(shine, rays * texture(texture, texCoord).a);
}

