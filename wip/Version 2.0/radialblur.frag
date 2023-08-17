// Ported from https://www.shadertoy.com/view/XsfSDs by jcant0n 
// Rebuild for enve by axiomgraph
// Opengl version 3.3
#version 330 core

layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;
uniform vec2 position;
uniform float blur;
uniform int samples; 



void main(void)
{
    vec2 center = position/100;
	float blurStart = 1.0;
    float blurWidth = blur/100;

    
	vec2 uv = texCoord;
    
    uv -= center;
    float precompute = blurWidth * (1.0 / float(samples - 1));
    
    vec4 color = vec4(0.0);
    for (int i = 0; i < samples; i++)
    {
        float scale = blurStart + (float(i)* precompute);
        color += texture(texture, uv * scale + center);
    }
    
    
    color /= float(samples);
    
	fragColor = color;
}
