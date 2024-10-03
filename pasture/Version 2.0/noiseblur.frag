// Adapted from https://www.shadertoy.com/view/cdfSzH
// Rebuilt for enve by axiomgraph
#version 330 core
layout(location = 0) out vec4 fragColor;


uniform sampler2D texture;
in vec2 texCoord;

uniform float SIZE;
uniform int ITER;


void srand(vec2 a, out float r)
{
	r=sin(dot(a,vec2(1233.224,1743.335)));
}

float rand(inout float r)
{
	r=fract(3712.65*r+0.61432);
	return (r-0.5)*2.0;
}

void main(void)
{
	vec2 uv = texCoord;
	float p=SIZE/1000.0; 
	vec4 c=vec4(0.0);
	float r;
	srand(uv, r);
	vec2 rv;
	
	for(int i=0;i<ITER;i++)
	{
		rv.x=rand(r);
		rv.y=rand(r);
		c+=texture(texture,uv+rv*p)/float(ITER);
	}
	fragColor = c;
}
