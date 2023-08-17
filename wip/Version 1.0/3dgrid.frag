/* Adapted from Natron  "Adapted to Natron by F.Fernandez
// Original code : crok_3d_grid Matchbox for Autodesk Flame"
// Opengl version 3.3*/
#version 330 core

#define PI 3.14159265359

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;//

uniform int Itterations; // = 40; // Iterations : (how much iteration), min=1, max=100
uniform int res; // = 4; // Resolution : (grid resolution), min=1, max=8

uniform float Thickness; // = 0.5; // Thickness : (adjust Thickness of the grid lines), min=0, max=10
uniform float p1; // = 1.0; // Seed : (seed value), min=-1.0, max=1.0
uniform float p2; // = 0.0; // Variance : (add a bit of variation to the grid), min=-10000, max=10000


uniform float Speed; // = 20.0; // Overall speed : (animation speed), min=-10000, max=10000
uniform float Offset; // = 0.0; // Offset : (offsets the grid in time), min=-10000, max=10000

uniform float x; // = 0.0; // Speed x : (horizontal speed adjustments), min=-10000, max=10000
uniform float y; // = 0.0; // Speed y : (vertical speed adjustments), min=-10000, max=10000
uniform float z; // = 1.0; // Speed z : (depth speed adjustments), min=-10000, max=10000

uniform vec2 center; // = vec2( 0.5 , 0.5 ); // Center : (adjust the center of the grid)
uniform float zoom; // = 1.0; // Zoom : (zoom in/out of the grid), min=-10000, max=10000



float time = iTime *.05 * Speed + Offset;

// a raymarching experiment by kabuto
//fork by tigrou ind (2013.01.22)

vec3 field(vec3 p) {
	p *= .1;
	float f = .1;
	for (int i = 0; i < res; i++) {
		p = p.yzx*mat3(.6* p1,.6* p1,0,-.6,.6*p1,0,0,0,1);
		p += vec3(.1*p2,.456* p2,.789*p2)*float(0.1);
		p = abs(fract(p)-.5);
		p *= 2.0;
		f *= 2.001;
	}
	p *= p;
	return sqrt(p+p.yzx)/f-.035 * Thickness;
}

void main(void)
{
	float jit = 0.01;
	if (mod(time, 0.1) < 2.0 ) jit = 0.005;
	vec3 dir = normalize(vec3((gl_FragCoord.xy - resolution * center ) / resolution.x, zoom));
	float a = 0.0;
	vec3 pos = vec3(x * time, y * time, z * time);
	dir *= mat3(1,0,0,0,cos(a),-sin(a),0,sin(a),cos(a));
	dir *= mat3(cos(a),0,-sin(a),0,1,0,sin(a),0,cos(a));
	vec3 color = vec3(0);
	for (int i = 0; i < Itterations; i++) {
		vec3 f2 = field(pos);
		float f = min(min(f2.x,f2.y),f2.z);
		
		pos += dir*f;
		color += float(Itterations-i)/(f2+jit);
	}
	vec3 color3 = vec3(1.-1./(1.+color*(.09/float(Itterations*Itterations))));
	color3 *= color3;
	fragColor = vec4(vec3(color3.r+color3.g+color3.b),texture2D(texture,texCoord).a);
}