// Adapted from https://www.shadertoy.com/view/flVGWK
// Rebuilt for enve by axiomgraph
// Opengl version 3.3

#version 330 core

layout(location = 0) out vec4 fragColor;

uniform sampler2D texture;

in vec2 texCoord;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform vec2 resolution;
uniform float time;

void main(void)
{
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    float m = time; // 0 <> 1
    float m2 = sin(3.14159265 * m);
    
    float parallax = 0.2;
    vec4 col1 = texture2D(texture, uv + vec2(m*parallax, 0.));
    vec4 col2 = vec4(0.0,0.0,0.0,0.0);
    
    float curve = uv.y * sin(uv.y + m * 3.1415) * .1 * m2;
    float s = uv.x + curve;
    float cut = smoothstep(0.5, 0.501, s+m-.5);
    vec4 col = mix(col1, col2, cut);

    fragColor = vec4(col);
}
