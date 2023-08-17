/*Adapted from olive video editor project ( Luma key simple program
Based on Edward Cannon's Simple Chroma Key (adaptation by Olive Team)
Feel free to modify and use at will )
Rebuilt for enve by axiomgraph
 Opengl version 3.3*/

#version 330 core


layout(location = 0) out vec4 fragColor;

uniform sampler2D texture;

in vec2 texCoord;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform float iTime;


uniform float loc;
uniform float hic;
uniform int invert;

void main(void) {
	vec4 texture_color = texture2D(texture,texCoord);

	float luma = max(max(texture_color.r,texture_color.g), texture_color.b) + min(min(texture_color.r,texture_color.g), texture_color.b);
	
	luma /= 2.0;

	if (luma > hic/100.0) {
        texture_color.a = (bool(invert) ? 0.0 : 1.0);
    } else if (luma < loc/100.0) {
        texture_color.a = (bool(invert )? 1.0 : 0.0);
    } else {
        texture_color.a = (bool(invert) ? 1.0-luma : luma);
    }
	
	texture_color.rgb *= texture_color.a;
	fragColor = texture_color; 
}
