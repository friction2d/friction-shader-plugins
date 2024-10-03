/* Adapted from https://www.shadertoy.com/view/4dK3Wc
Rebuilt for enve by axiomgraph
 Opengl version 3.3*/
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

//#define HIGH_QUALITY

#ifndef HIGH_QUALITY
const int hres = 200;
const float intensity = 0.04;
const float thres = 0.004;
#else
const int hres = 800;
const float intensity = 0.03;
const float thres = 0.001;
#endif

void main( void )
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 col = vec3(0);
    float s = uv.y*1.8 - 0.15;
    float maxb = s+thres;
    float minb = s-thres;
    
    for (int i = 0; i <= hres; i++) {
        vec3 x = texture(texture, vec2(float(i)/float(hres), uv.x)).rgb;
		col += vec3(intensity)*step(x, vec3(maxb))*step(vec3(minb), x);

		float l = dot(x, x);
		col += vec3(intensity)*step(l, maxb*maxb)*step(minb*minb, l);
    }

	fragColor = vec4(col,texture(texture,texCoord));
}
