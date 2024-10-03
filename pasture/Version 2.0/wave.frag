// Ported from olive video editor project
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core

layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;


uniform float frequency;
uniform float intensity;
uniform float evolution;
uniform int vertical;

void main(void) {
	float x = texCoord.x;
	float y = texCoord.y;

	if (vertical == 1) {
		x -= sin((texCoord.y-(evolution*0.01))*frequency)*intensity*0.01;
	} else {
		y -= sin((texCoord.x-(evolution*0.01))*frequency)*intensity*0.01;
	}

	if (y < 0.0 || y > 1.0 || x < 0.0 || x > 1.0) {
		discard;
	} else {
		vec4 textureColor = texture(texture, vec2(x, y));
		fragColor = vec4(
			textureColor.r,
			textureColor.g,
			textureColor.b,
			textureColor.a
		);
	}	
}