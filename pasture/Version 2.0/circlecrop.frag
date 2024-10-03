/* Made for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
precision mediump float;
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
in vec2 texCoord;
uniform vec2 resolution; 

uniform float size;  
uniform vec2 position;
uniform float feather;

void main(void)
{
    vec2 uv = texCoord*2.0-1.0;
    uv.x*= resolution.x/resolution.y;
    vec2 uv1 = texCoord;     
    float radius = distance(uv, position)/ size; // circle
    float feath = smoothstep(0.1,feather,radius); // feather     
    vec4 col = mix(texture(texture,uv1),vec4(0.0),feath);
    fragColor = col;
}
