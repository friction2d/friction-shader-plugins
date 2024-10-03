// Adapted from natron plugins
// Rebuild for enve by axiomgraph
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
in vec2 texCoord;


uniform float gain; 
uniform float iterations; 
uniform vec2 angle; 


float random(vec2 scale, float seed)
{
    return fract(sin(dot(texCoord.xy + seed, scale)) * 8643.5453 + seed);
}

void main(void)
{
	vec2 uv = texCoord;
	vec2 direction;
	direction = angle;
    float noise = random(vec2(543.12341, 74.30434), 2.0);
    vec4 color = vec4(0.0);
    float ws = 0.0;

	for(float steps = -iterations; steps <= iterations; steps++)
    {
        float p = (steps + noise - 0.5) / 16.0;
        float w = 1.0 - abs(p);
        color += texture(texture, uv + direction*.02 * p) * w;
        ws += w;
    }

	fragColor = vec4(color / ws * gain);

}
