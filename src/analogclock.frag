/* Adapted from https://www.shadertoy.com/view/DtScWV
Rebuilt for enve by axiomgraph
 Opengl version 3.3*/
#version 330 core
#define PI 3.14159

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform   float hours; 
uniform   float minutes;
uniform   float seconds; 

float deg2Rad(float degrees)
{
    return degrees * 0.0174533;
}

vec2 rotate(vec2 vec, float angle)
{
    mat2 rotMat = mat2(cos(angle), -sin(angle),
        sin(angle), cos(angle));

    return vec * rotMat;
}

float circleShape(vec2 center, vec2 uv, float radius)
{
    float dist = length(uv - center);
    return 1.0 - smoothstep(radius - 0.0025, radius + 0.0025, dist);
}

float rectShape(vec2 center, vec2 size, vec2 uv, float rotation)
{
    vec2 le = center - size / 2.0;
    vec2 ue = center + size / 2.0;

    uv -= 0.5;
    uv = rotate(uv, deg2Rad(rotation));
    uv.y += size.y / 2.0;
    uv += 0.5;

    float smoothness = 0.0025;

    float rect = smoothstep(le.x - smoothness, le.x + smoothness, uv.x);
    rect *= smoothstep(le.y - smoothness, le.y + smoothness, uv.y);

    rect *= 1.0 - smoothstep(ue.x - smoothness, ue.x + smoothness, uv.x);
    rect *= 1.0 - smoothstep(ue.y - smoothness, ue.y + smoothness, uv.y);

    return rect;
}

float angleCoords(vec2 uv, float rotation) 
{
    uv -= 0.5;
    uv = rotate(uv, deg2Rad(rotation));
    float angle = atan(uv.x, uv.y);
    angle /= PI;
    angle += 1.0;
    angle /= 2.0;
    return angle;
}

float clockMarkings(vec2 uv, vec2 center, float count, float thickness, 
    float radius, float lngth, float smoothness)
{
    float seg = cos(angleCoords(uv, 0.0) * PI * 2.0 * count);
    float ring = circleShape(vec2(0.5, 0.5), uv, radius);
    ring -= circleShape(vec2(0.5, 0.5), uv, radius - lngth);
    return smoothstep(1.0 - thickness, 1.0 + smoothness - thickness, seg) * ring;
}

void main(void)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution.xy;

    float scale = 0.9;

    uv -= 0.5;
    uv *= 1.0 / scale;
    uv.x *= resolution.x / resolution.y;
    uv = rotate(uv, deg2Rad(180.0));
    uv += 0.5;

    vec2 center = vec2(0.5, 0.5);

    //Base color
    float mask = circleShape(center, uv, 0.525);
    vec3 col1 = mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), mask);

    //Minute markings
    vec3 markColor = vec3(0.1, 0.1, 0.1);
    float mark = clockMarkings(uv, center, 60.0, 0.1, 0.5, 0.02, 0.1);
    vec3 col = mix(col1, markColor, mark);

    //5 minutes markings
    vec3 mark1Color = vec3(0.0, 0.0, 0.0);
    float mark1 = clockMarkings(uv, center, 12.0, 0.02, 0.5, 0.035, 0.01);
    col = mix(col, mark1Color, mark1);


    //Hours hand
    vec3 hand1Color = vec3(0.0, 0.0, 0.0);
    float hand1 = rectShape(center, vec2(0.025, 0.3), uv, hours * 360.0 / 12.0);
    col = mix(col, hand1Color, hand1);
    
    //Circle
    vec3 circleColor = vec3(0.0, 0.0, 0.0);
    float circle = circleShape(center, uv, 0.03);
    col = mix(col, circleColor, circle);

    //Minutes hand
    vec3 hand2Color = vec3(0.2, 0.2, 0.2);
    float hand2 = rectShape(center, vec2(0.02, 0.4), uv, minutes * 360.0 / 60.0);
    col = mix(col, hand2Color, hand2);
    
    //Circle
    circleColor = vec3(0.2, 0.2, 0.2);
    circle = circleShape(center, uv, 0.025);
    col = mix(col, circleColor, circle);

    //Seconds hand
    vec3 hand3Color = vec3(1.0, 0.0, 0.0);
    float hand3 = rectShape(center, vec2(0.01, 0.475), uv, seconds * 360.0 / 60.0);
    col = mix(col, hand3Color, hand3);

    //Circle
    circleColor = vec3(1.0, 0.0, 0.0);
    circle = circleShape(center, uv, 0.02);
    col = mix(col, circleColor, circle);
    
    //Circle
    circleColor = vec3(1.0, 1.0, 1.0);
    circle = circleShape(center, uv, 0.0125);
    col = mix(col, circleColor, circle);

vec3 alphacomb = col1*texture2D(texture,gl_FragCoord.xy/resolution.xy).a;

    // Output to screen
   fragColor = vec4(col,alphacomb);
}
