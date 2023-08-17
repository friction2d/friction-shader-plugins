/*  Adapted from natron https://www.shadertoy.com/view/XssSDs
Rebuilt for enve by axiomgraph
// Opengl version 3.3*/
#version 330 core

#define PI 3.1415926535897932384626433832795

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;  

uniform bool multiplicative; // Multiplicative (Apply multiplicative noise instead of additive noise)
uniform float strength; // Strength, min=0., max=50.

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    vec4 color = texture(texture, uv);
    
    float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (iTime * 10.0);
	vec4 grain = vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;
    
    if (bool(multiplicative))
    {
    	grain = 1.0 - grain;
		fragColor = color * grain;
    }
    else
    {
		fragColor = color + grain;
    }
}
