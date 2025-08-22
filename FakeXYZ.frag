#version 330 core

layout(location = 0) out vec4 fragColor;

in vec2 texCoord;
uniform sampler2D tex;

uniform float rotX;
uniform float rotY;
uniform float rotZ;

vec2 rotateAndProject(vec2 p)
{
    vec3 v = vec3(p.x, p.y, 0.0) - vec3(0.5, 0.5, 0.0);

    // X axis
    float cosX = cos(rotX);
    float sinX = sin(rotX);
    mat3 rotMatX = mat3(
        1.0, 0.0, 0.0,
        0.0, cosX, -sinX,
        0.0, sinX, cosX
    );
    v = rotMatX * v;

    // Y axis
    float cosY = cos(rotY);
    float sinY = sin(rotY);
    mat3 rotMatY = mat3(
        cosY, 0.0, sinY,
        0.0, 1.0, 0.0,
        -sinY, 0.0, cosY
    );
    v = rotMatY * v;

    // Z axis
    float cosZ = cos(rotZ);
    float sinZ = sin(rotZ);
    mat3 rotMatZ = mat3(
        cosZ, -sinZ, 0.0,
        sinZ, cosZ, 0.0,
        0.0, 0.0, 1.0
    );
    v = rotMatZ * v;

    v += vec3(0.5, 0.5, 0.0);

    float perspectiveZ = 1.0 / (v.z + 1.0);
    vec2 projected = v.xy * perspectiveZ;
    
    return projected;
}

void main()
{
    vec2 uv = rotateAndProject(texCoord);

    vec4 col;
    if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
        col = vec4(0.0);
    } else { col = texture(tex, uv); }

    fragColor = col;
}
