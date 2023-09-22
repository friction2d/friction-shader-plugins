/* Credit : 
 Rebuilt for enve by axiomgraph*/
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;

uniform float time;
uniform vec4 color;

float N21(vec2 p) {
	p = fract(p * vec2(2.15, 8.3));
    p += dot(p, p + 2.5);
    return fract(p.x * p.y);
}

vec2 N22(vec2 p) {
	float n = N21(p);
    return vec2(n, N21(p + n));
}

vec2 getPos(vec2 id, vec2 offset) {
	vec2 n = N22(id + offset);
    float x = cos(time * n.x);
    float y = sin(time * n.y);
    return vec2(x, y) * 0.4 + offset;
}

float distanceToLine(vec2 p, vec2 a, vec2 b) {
	vec2 pa = p - a;
    vec2 ba = b - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
    return length(pa - t * ba);
}

float getLine(vec2 p, vec2 a, vec2 b) {
	float distance = distanceToLine(p, a, b);
    float dx = 15./resolution.y;
    return smoothstep(dx, 0., distance) * smoothstep(1.2, 0.3, length(a - b));
}

float layer(vec2 st) {
    float m = 0.;
    vec2 gv = fract(st) - 0.5;
    vec2 id = floor(st);
    // m = gv.x > 0.48 || gv.y > 0.48 ? 1. : 0.;
    vec2 pointPos = getPos(id, vec2(0., 0.));
    m += smoothstep(0.05, 0.03, length(gv - pointPos));
    
    float dx=15./resolution.y;
    // m += smoothstep(-dx,0., abs(gv.x)-.5);
    // m += smoothstep(-dx,0., abs(gv.y)-.5);
    // m += smoothstep(dx, 0., length(gv - pointPos)-0.03);
    
    vec2 p[9];
    p[0] = getPos(id, vec2(-1., -1.));
    p[1] = getPos(id, vec2(-1.,  0.));
    p[2] = getPos(id, vec2(-1.,  1.));
    p[3] = getPos(id, vec2( 0., -1.));
    p[4] = getPos(id, vec2( 0.,  0.));
    p[5] = getPos(id, vec2( 0.,  1.));
    p[6] = getPos(id, vec2( 1., -1.));
    p[7] = getPos(id, vec2( 1.,  0.));
    p[8] = getPos(id, vec2( 1.,  1.));
    
    for (int j = 0; j <=8 ; j++) {
    	m += getLine(gv, p[4], p[j]);
        vec2 temp = (gv - p[j]) * 100.;
        m += 1./dot(temp, temp) * (sin(10. * time + fract(p[j].x) * 20.) * 0.5 + 0.5);
        
    }
    
    m += getLine(gv, p[1], p[3]);
    m += getLine(gv, p[1], p[5]);
    m += getLine(gv, p[3], p[7]);
    m += getLine(gv, p[5], p[7]);
    
    // m += smoothstep(0.05, 0.04, length(st - vec2(0., 0.)));
    return m;
}

void main(void)
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    
    float m = 0.;
    
    float theta = time * 0.1;
    mat2 rot = mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
    vec2 gradient = uv;
    uv = rot * uv;
    
    for (float i = 0.; i < 1.0 ; i += 0.25) {
    	float depth = fract(i + time * 0.1);
        m += layer(uv * mix(10., 0.5, depth) + i * 20.) * smoothstep(0., 0.2, depth) * smoothstep(1., 0.8, depth);
    }
    
    vec3 baseColor = color.rgb;  
    
    vec3 col = (m - gradient.y) * baseColor; // disable gradient in future
    // Output to screen
    fragColor = vec4(col, texture(texture,texCoord).a); 
}



