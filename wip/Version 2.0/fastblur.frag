/*  Adapted from natron https://www.shadertoy.com/view/XssSDs
// Opengl version 3.3*/
#version 330 core

#define PI 3.1415926535897932384626433832795

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

const vec2 iRenderScale = vec2(1.,1.);
const vec2 iChannelOffset[4] = vec2[4]( vec2(0.,0.), vec2(0.,0.), vec2(0.,0.), vec2(0.,0.) );

uniform float size; // = 10.; // Blur Size (Blur size in pixels), min=0., max=20.
uniform int perpixel_size; // = false; // Modulate (Modulate the blur size by multiplying it by the first channel of the Modulate input)

vec2 Circle(float Start, float Points, float Point) 
{
	float Rad = (3.141592 * 2.0 * (1.0 / Points)) * (Point + Start);
	return vec2(sin(Rad), cos(Rad));
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    float Start = 2.0 / 14.0;
	vec2 Scale = size * iRenderScale / resolution.xy;
	if (bool(perpixel_size)) {
		Scale *= texture(texture, (gl_FragCoord.xy-iChannelOffset[1].xy)/resolution.xy).x;
	}
    
    vec4 N0 = texture(texture, uv + Circle(Start, 14.0, 0.0) * Scale).rgba;
    vec4 N1 = texture(texture, uv + Circle(Start, 14.0, 1.0) * Scale).rgba;
    vec4 N2 = texture(texture, uv + Circle(Start, 14.0, 2.0) * Scale).rgba;
    vec4 N3 = texture(texture, uv + Circle(Start, 14.0, 3.0) * Scale).rgba;
    vec4 N4 = texture(texture, uv + Circle(Start, 14.0, 4.0) * Scale).rgba;
    vec4 N5 = texture(texture, uv + Circle(Start, 14.0, 5.0) * Scale).rgba;
    vec4 N6 = texture(texture, uv + Circle(Start, 14.0, 6.0) * Scale).rgba;
    vec4 N7 = texture(texture, uv + Circle(Start, 14.0, 7.0) * Scale).rgba;
    vec4 N8 = texture(texture, uv + Circle(Start, 14.0, 8.0) * Scale).rgba;
    vec4 N9 = texture(texture, uv + Circle(Start, 14.0, 9.0) * Scale).rgba;
    vec4 N10 = texture(texture, uv + Circle(Start, 14.0, 10.0) * Scale).rgba;
    vec4 N11 = texture(texture, uv + Circle(Start, 14.0, 11.0) * Scale).rgba;
    vec4 N12 = texture(texture, uv + Circle(Start, 14.0, 12.0) * Scale).rgba;
    vec4 N13 = texture(texture, uv + Circle(Start, 14.0, 13.0) * Scale).rgba;
    vec4 N14 = texture(texture, uv).rgba;
    
    float W = 1.0 / 15.0;
    
    vec4 color = vec4(0.);
    
	color.rgba =
		(N0 * W) +
		(N1 * W) +
		(N2 * W) +
		(N3 * W) +
		(N4 * W) +
		(N5 * W) +
		(N6 * W) +
		(N7 * W) +
		(N8 * W) +
		(N9 * W) +
		(N10 * W) +
		(N11 * W) +
		(N12 * W) +
		(N13 * W) +
		(N14 * W);
    
    fragColor = color.rgba;
}
