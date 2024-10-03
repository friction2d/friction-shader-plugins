// Adapted from natron project (https://www.shadertoy.com/view/lslGRr
// Sharpen
// Adapted to Natron by F. Devernay)
// Rebuilt for enve by axiomgraph
// Opengl version 3.3

#version 330


layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;

in vec2 texCoord;

uniform float sharpness; // = 1.; // Amount (Amount of sharpening.), min=0., max=1.

void main(void)
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
	vec2 step = 1.0 / resolution.xy;
	
	vec3 texA = texture2D( texture, uv + vec2(-step.x, -step.y) * 1.5 ).rgb;
	vec3 texB = texture2D( texture, uv + vec2( step.x, -step.y) * 1.5 ).rgb;
	vec3 texC = texture2D( texture, uv + vec2(-step.x,  step.y) * 1.5 ).rgb;
	vec3 texD = texture2D( texture, uv + vec2( step.x,  step.y) * 1.5 ).rgb;
   
    vec3 around = 0.25 * (texA + texB + texC + texD);
	vec3 center  = texture2D( texture, uv ).rgb;
	
	vec3 col = center + (center - around) * sharpness;
	
    fragColor = vec4(col,texture2D(texture,texCoord).a);
}
