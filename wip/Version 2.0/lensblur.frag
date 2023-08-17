// Ported from Natron Plugins
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
in vec2 texCoord;

uniform sampler2D texture;
uniform vec2 scenePos;
uniform int SAMPLES;
uniform float amount; 
uniform float aspect; 

int ANGLE_SAMPLES = 4 * SAMPLES ; 
int OFFSET_SAMPLES = 1 * SAMPLES ;

float degs2rads(float degrees) {
    return degrees * 0.01745329251994329576923690768489;
}

vec2 rot2D(float offset, float angle) {
    angle = degs2rads(angle);
    return vec2(cos(angle) * offset, sin(angle) * offset);
}

vec3 circle_blur(sampler2D sp, vec2 uv, vec2 scale) {
    vec2 ps = (1.0 / scenePos.xy) * amount * scale ;
    vec3 col = vec3(0.0);
    float accum = 0.0;

    for (int a = 0; a < 360; a += 360 / ANGLE_SAMPLES) {
        for (int o = 0; o < OFFSET_SAMPLES; ++o) {
			col += texture(sp, uv + ps * rot2D(float(o), float(a))).rgb * float(o * o);
            accum += float(o * o);
        }
    }

    return col / accum;
}

void main(void)
{
  /*
  if ( aspect > 1.0 )
    direction.x = (direction.x - 1.0) * 10.0 + 1.0; */
  vec2 dir = vec2(1.0);
  dir = vec2(dir.x / aspect, dir.y * aspect);
  vec2 uv = ( gl_FragCoord.xy / scenePos.xy);;
  vec3 col = circle_blur(texture, uv, dir);
  fragColor = vec4(col, 1.0);
}

