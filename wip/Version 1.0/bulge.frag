// Ported from olive video editor project
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core


layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;


const float PI = 3.1415926535;

uniform vec2 scenePos;
uniform float Amount;
uniform vec2 Center;

vec2 distort(vec2 p, vec2 offset) {
    float theta  = atan(p.y, p.x);
    float radius = length(p);
    radius = pow(radius, (1.0+Amount*0.01));
    p.x = radius * cos(theta) + offset.x;
    p.y = radius * sin(theta) + offset.y;
    return 0.5 * (p + 1.0);
}

void main(void) {
	vec2 offset = vec2(Center.x/scenePos.x, Center.y/scenePos.y);
	vec2 xy = 2.0 * texCoord- 1.0 - offset;
	vec2 uv;
	float d = length(xy);
	uv = distort(xy, offset);
	if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
		fragColor = texture2D(texture, uv);
	} else {
		discard;
	}	
}
