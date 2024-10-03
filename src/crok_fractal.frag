/* Adapted from natron plugins "
 (Adapted to Natron by F.Fernandez
 Original code :crok_fractal Matchbox for Autodesk Flame"
 http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
 original created by JoshP in 7/5/2013*/
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
uniform vec2 scenePos;
in vec2 texCoord;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform float iTime;

uniform int resolution;
uniform vec2 offset;
uniform float seed;
uniform float zoom;
uniform float gain;
uniform vec4 color;

float myGlobalTime = iTime;


float field(in vec3 p) {
	float strength = 9. + .00003 * log(1.e-6 + fract(sin(myGlobalTime) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < resolution; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 4.3 * accum / tw - 0.7);
}

void main(void) 
{
	vec2 uv = 2. * texCoord - 1.;
	vec2 uvs = uv * scenePos.xy / max(scenePos.x, scenePos.y);
	vec3 p = vec3(uvs / zoom, 0) + vec3(1., -1.3, 0.);
	p += .2 * vec3(offset.x, offset.y, myGlobalTime / seed);
	float t = field(p);
    fragColor = mix(0.1, 1.0, gain) * vec4(color.r * t * t * t, color.g *t * t, color.b * t, texture2D(texture,texCoord).a );
} 