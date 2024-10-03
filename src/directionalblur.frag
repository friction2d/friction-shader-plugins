/*Adapted from olive video editor project 
Rebuilt for enve by axiomgraph
 Opengl version 3.3*/

#version 330 core
#define M_PI 3.1415926535897932384626433832795

layout(location = 0) out vec4 fragColor;

uniform sampler2D texture;

in vec2 texCoord;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform float iTime;

uniform sampler2D image;

uniform float angle; // degrees
uniform float length;

uniform vec2 resolution;

void main(void) {
	if (length > 0.0) {
		float ceillen = ceil(length);
		float radians = (angle*M_PI)/180.0;
		float divider = 1.0 / ceillen;
		float sin_angle = sin(radians);
		float cos_angle = cos(radians);

		vec4 color = vec4(0.0);
		for (float i=-ceillen+0.5;i<=ceillen;i+=2.0) {
			float y = sin_angle * i;
			float x = cos_angle * i;
			color += texture2D(texture, vec2(gl_FragCoord.x+x, gl_FragCoord.y+y)/resolution)*(divider);
		}
		fragColor = color;
	} else {
		fragColor = texture2D(texture, gl_FragCoord.xy/resolution);
	}
}
