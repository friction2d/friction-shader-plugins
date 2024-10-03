
#version 330 core
layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;
uniform int invert;

void main(void) {
    vec4 color = texture2D(texture, texCoord);
    if(invert == 0) {
        fragColor = color;
    } else {
    fragColor = vec4(1.0-color.rgb,color.a);
    }
}
