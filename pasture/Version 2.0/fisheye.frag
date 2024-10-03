/*Adapted from olive video editor project 
Rebuilt for enve by axiomgraph
 Opengl version 3.3*/

#version 330 core
#define M_PI 3.1415926535897932384626433832795

layout(location = 0) out vec4 fragColor;

uniform sampler2D texture;

in vec2 texCoord;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform float size;

void main(void) {
	float maxFactor = 2.0 - (size * 0.01);

	vec2 uv;
	vec2 xy = 2.0 * texCoord - 1.0;
	float d = length(xy);
	if (d < (2.0-maxFactor)) 	{
		d = length(xy * maxFactor);
		float z = sqrt(1.0 - d * d);
		float r = atan(d, z) / M_PI;
		float phi = atan(xy.y, xy.x);
		
		uv.x = r * cos(phi) + 0.5;
		uv.y = r * sin(phi) + 0.5;
	} else {
		uv = texCoord;
	}
	vec4 c = texture(texture, uv);
	fragColor = c;
}
