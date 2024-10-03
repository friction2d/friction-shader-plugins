/* Adapted from natron plugins (https://www.shadertoy.com/view/Xs2GDd)
// Opengl version 3.3*/
#version 330 core

#define PI 3.14159265359

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;//


uniform vec4 col1;// = vec3(0.216, 0.471, 0.698); // blue
uniform vec4 col2;// = vec3(1.00, 0.329, 0.298); // red
uniform vec4 col3;// = vec3(0.867, 0.910, 0.247); // yellow

uniform float speed = 2.0; // Speed : (speed)

float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.008, radius+0.008, length(r-center));
}

void main(void)
{
	float t = iTime*speed;
	vec2 r = (2.0*gl_FragCoord.xy - resolution.xy) / resolution.y;
	r *= 1.0 + 0.05*sin(r.x*5.+iTime) + 0.05*sin(r.y*3.+iTime);
	r *= 1.0 + 0.2*length(r);
	float side = 0.5;
	vec2 r2 = mod(r, side);
	vec2 r3 = r2-side/2.;
	float i = floor(r.x/side)+2.;
	float j = floor(r.y/side)+4.;
	float ii = r.x/side+2.;
	float jj = r.y/side+4.;	
	
	vec3 pix = vec3(1.0);
	
	float rad, disks;
		
	rad = 0.15 + 0.05*sin(t+ii*jj);
	disks = disk(r3, vec2(0.,0.), rad);
	pix = mix(pix, col2.rgb, disks);

	float speed = 2.0;
	float tt = iTime*speed+0.1*i+0.08*j;
	float stopEveryAngle = PI/2.0;
	float stopRatio = 0.7;
	float t1 = (floor(tt) + smoothstep(0.0, 1.0-stopRatio, fract(tt)) )*stopEveryAngle;
		
	float x = -0.07*cos(t1+i);
	float y = 0.055*(sin(t1+j)+cos(t1+i));
	rad = 0.1 + 0.05*sin(t+i+j);
	disks = disk(r3, vec2(x,y), rad);
	pix = mix(pix, col1.rgb, disks);
	
	rad = 0.2 + 0.05*sin(t*(1.0+0.01*i));
	disks = disk(r3, vec2(0.,0.), rad);
	pix += 0.2*col3.rgb*disks * sin(t+i*j+i);

	pix -= smoothstep(0.3, 5.5, length(r));	
	fragColor = vec4(pix,texture(texture,texCoord).a);
}
