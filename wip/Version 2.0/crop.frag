// Ported from olive video editor project
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core


layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;


const float PI = 3.1415926535;


uniform float left;
uniform float top;
uniform float right;
uniform float bottom;
uniform float feather;
uniform int invert;


void main(void) {
	vec4 textureColor = texture(texture,texCoord);
	float alpha = textureColor.a;
	if (feather == 0.0) {
		if (texCoord.x < (left*0.01) || texCoord.y < (top*0.01) || texCoord.x > (1.0-(right*0.01)) || texCoord.y > (1.0-(bottom*0.01))) {
			alpha = 0.0;
		}
	} else {
		float f = pow(2.0, 10.0-(feather*0.1));
		if (left > 0.0) alpha = alpha * clamp(((texCoord.x+(0.5/f))-(left*0.01))*f, 0.0, 1.0); // left
		if (top > 0.0) alpha = alpha * clamp(((texCoord.y+(0.5/f))-(top*0.01))*f, 0.0, 1.0); // top
		if (right > 0.0) alpha = alpha * clamp((((1.0-texCoord.x)+(0.5/f))-(right*0.01))*f, 0.0, 1.0); // right
		if (bottom > 0.0) alpha = alpha * clamp((((1.0-texCoord.y)+(0.5/f))-(bottom*0.01))*f, 0.0, 1.0); // bottom
	}

	if (invert==1)
	{fragColor = vec4(
		textureColor.r*(1.0 - alpha),textureColor.g*(1.0 - alpha),textureColor.b*(1.0 - alpha),	1.0 - alpha)*textureColor.a;}
	else{
		fragColor = vec4(textureColor.r*(alpha),textureColor.g*(alpha),textureColor.b*(alpha),alpha)*textureColor.a;}
}
