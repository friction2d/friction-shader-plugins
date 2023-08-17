// Adapted from in77Camera 
// Rebuilt for enve by axiomgraph
// Opengl version 3.3

#version 330


layout(location = 0) out vec4 fragColor;

uniform sampler2D texture;

in vec2 texCoord;

uniform float edge;
uniform float mixxer;
uniform float opacity; 


void main(void)
{
    
    vec4 color =  texture(texture, texCoord);
    float gray = length(color.rgb);
    vec3 col =vec3(step(edge/10.0, length(vec2(dFdx(gray), dFdy(gray)))));
    vec3 col2 =  texture(texture, texCoord).rgb;
    fragColor = vec4(mix(col,col2,mixxer), opacity);
}
