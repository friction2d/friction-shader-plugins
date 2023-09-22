/* Adapted from https://github.com/gl-transitions/gl-transitions/blob/master/transitions/LeftRight.glsl
License: MIT
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
in vec2 texCoord;
 
uniform float progress;  

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
    return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
    vec2 spfr,spto = vec2(-1.);

    float size = mix(1.0, 3.0, progress*0.2);
    spto = (uv + vec2(-0.5,-0.5))*vec2(size,size)+vec2(0.5,0.5);
    spfr = (uv - vec2(1.-progress, 0.0));
    if(inBounds(spfr)){
        return vec4(0.0);
    }else if(inBounds(spto)){
        return texture2D(texture,spto) * (1.0 - progress);
    } else{
        return black;
    }
}
void main(void)
{
   fragColor = transition(texCoord);
}

