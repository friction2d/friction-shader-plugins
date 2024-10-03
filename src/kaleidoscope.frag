/* Adapted from natron project  https://www.shadertoy.com/view/XsfGzj ,Adapted to Natron by F. Devernay 
 Rebuilt for enve by axiomgraph
 Opengl version 3.3*/
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;

uniform float size; //  = 1.; // Size, min=0.0, max=10.
uniform int addup ; // = false; // Add Up
uniform float speed ; // = 0.2; // Speed, min=0., max=10.

vec2 mirror(vec2 x)
{
        return abs(fract(x/2.0) - 0.5)*2.0;
}

// There are two versions
// One adds up the colors from all the iterations, the other uses only the last.
void main(void)
{
        vec2 uv = ((2*gl_FragCoord.xy - resolution.xy)/ resolution.x)/size;

        float a = iTime*speed;
        vec4 color = vec4(0.0);
        for (float i = 1.0; i < 10.0; i += 1.0) {
                uv = vec2(sin(a)*uv.y - cos(a)*uv.x, sin(a)*uv.x + cos(a)*uv.y);
                uv = mirror(uv);

                // These two lines can be changed for slightly different effects
                // This is just something simple that looks nice
                a += i;
                a /= i;
                if (bool(addup)) {
			color += texture2D(texture, mirror(uv*vec2(1.,resolution.x/resolution.y)*2.0)) * 10.0/i;
		}
        }
	if (bool(addup)) {
        fragColor = color / 28.289;
	} else {
        fragColor = texture2D(texture, mirror(uv*vec2(1.,resolution.x/resolution.y)*2.0));
	}
}
