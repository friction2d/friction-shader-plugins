/*Adapted from olive video editor project 
Rebuilt for enve by axiomgraph
 Opengl version 3.3*/

#version 330 core
#define M_PI 3.1415926535897932384626433832795

layout(location = 0) out vec4 fragColor;

uniform sampler2D texture;

in vec2 texCoord;
layout(pixel_center_integer) in vec4 gl_FragCoord;


uniform vec2 lensRadius;
uniform vec2 center;
uniform int circular;

uniform vec2 resolution;
uniform int invert;
// uniform vec2 lensRadius; // 0.45, 0.38



void main(void) {
	if (lensRadius.x == 0.0) {
		discard;
	}
	vec4 c = texture(texture, texCoord);
	vec2 vignetteCoord = texCoord;
	if (bool(circular)) {
		float ar = (resolution.x/resolution.y);
		vignetteCoord.x *= ar;
		vignetteCoord.x -= (1.0-(1.0/ar));
	}
	float dist = distance(vignetteCoord, vec2(0.5 + center.x*0.01, 0.5 + center.y*0.01));
	float size = (lensRadius.x*0.01);
	
	if (bool(invert))
	{c *= 1.0 - smoothstep(size, size*0.99*(1.0-lensRadius.y*0.01), dist);}
	else
	{c *= smoothstep(size, size*0.99*(1.0-lensRadius.y*0.01), dist);}
	
	fragColor = c;
}
