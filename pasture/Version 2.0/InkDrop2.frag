/* Adapted from https://www.shadertoy.com/view/3tGyWm Author : dtsmio 
 Adapted for enve/friction by axiomgraph
 Opengl version 3.3*/
#version 330 core
#define PI 3.1415926535
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;

uniform float shape; 
uniform float size;
float noi( in vec2 p )
{
    return 0.5*(cos(6.2831*p.x) + cos(6.2831*p.y));
}

//3D simplex noise from: https://www.shadertoy.com/view/XsX3zB
const float F3 =  0.3333333;
const float G3 =  0.1666667;

vec3 random3(vec3 c) {
    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
    vec3 r;
    r.z = fract(512.0*j);
    j *= .125;
    r.x = fract(512.0*j);
    j *= .125;
    r.y = fract(512.0*j);
    return r-0.5;
}

float simplex3d(vec3 p) {
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 vec4 w, d;
	 
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 w = max(0.6 - w, 0.0);
	 
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 return dot(d, vec4(52.0));
}

float fbm(vec3 p)
{
	float f = 0.0;	
	float frequency = 1.0;
	float amplitude = 0.5;
	for (int i = 0; i < 5; i++)
	{
		f += simplex3d(p * frequency) * amplitude;
		amplitude *= 0.5;
		frequency *= 2.0 + float(i) / 100.0;
	}
	return abs(min(f, 1.0));
}


float nsin(float a) // a = (-0.5:0.5)
{
    return sin(a * PI * 2.) * 0.5 + 0.5;
}

float ink(vec2 uv, float time, float prog)
{
	float a = atan(uv.y, uv.x) / PI / 2.;
    
    float f1 = fbm(vec3(nsin(a) * 0.5, 0., time));
    f1 += fbm(vec3(nsin(a + 0.4) * 2.5, 1., time)) * 0.5;
    
    float f2 = fbm(vec3(nsin(a) * 25.5, 2., time));
    f2 += fbm(vec3(nsin(a + 0.4) * 15.5, 3., time)) * 0.5;
    
    float mn = prog + f1 * 6. * prog;
    float mx = mn + (0.1 + f2 * 1.) * prog;
    
    return 1. - smoothstep(mn, mx, length(uv));
}

void main(void)
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    vec2 uv1 = gl_FragCoord.xy/resolution.xy;

    vec3 col = vec3(0.0);
    
 
    uv *= 5.;
    uv.x += fbm(vec3(uv.x, uv.y, shape * 20.)) * 0.5;
    
             
    float ink1 =ink(uv + vec2(0.0, 0.) * vec2(sin(1.0 * 1264.), cos(1.0 * 12645.)), shape, size) ;
    
    col = mix(vec3(0.0),texture(texture,uv1).rgb,ink1);
    
    fragColor = vec4(col,texture(texture,texCoord).a*ink1);
}

