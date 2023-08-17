// Adapted from natron plugins 
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core


layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;
uniform sampler2D texture;
uniform vec2 scenePos;
in vec2 texCoord;


uniform float iTime;

uniform vec4 c1; 
uniform vec4 c2;
uniform vec4 c3;
uniform vec4 c4;
uniform vec4 c5;
uniform vec4 c6;

uniform float detail;
uniform float globalAmplitude;

uniform float shiftt;
uniform float distance;

uniform vec2 speed;
uniform float acceleration;
uniform float offset;



vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(vec2 n) {
    return fract(sin(cos(dot(n, vec2(12.9898,12.1414)))) * 83758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n, float detail, float amp) {
    float total = 0.0, amplitude = 1.0;
    for (int i = 0; i <5; i++) {
        total += noise(n) * amplitude;
        n += n*detail;
        amplitude *= amp;
    }
    return total;
}


void main(void) {

    float globalSpeed = iTime * acceleration;
    float shift = 1.327+sin(globalSpeed*2.0*shiftt)/2.4;

    
    //change the constant term for all kinds of cool distance versions,
    //make plus/minus to switch between 
    //ground fire and fire rain!
	float dist = 3.5-sin(globalSpeed*0.4)/1.89;
    
    vec2 p = gl_FragCoord.xy * dist / scenePos.xx + distance;
    p.x -= globalSpeed/1.1;
    float q = fbm(p - globalSpeed * 0.01+1.0*sin(globalSpeed)/10.0 , detail , globalAmplitude);
    float qb = fbm(p - globalSpeed * 0.002+0.1*cos(globalSpeed)/5.0 , detail , globalAmplitude);
    float q2 = fbm(p - globalSpeed * 0.44 - 5.0*cos(globalSpeed)/7.0 , detail , globalAmplitude) - 6.0;
    float q3 = fbm(p - globalSpeed * 0.9 - 10.0*cos(globalSpeed)/30.0 , detail , globalAmplitude)-4.0;
    float q4 = fbm(p - globalSpeed * 2.0 - 20.0*sin(globalSpeed)/20.0 , detail , globalAmplitude)+2.0;
    q = (q + qb - .4 * q2 -2.0*q3  + .6*q4)/3.8;
    vec2 r = vec2(fbm (p + q /2.0 + globalSpeed + offset * speed.x - p.x - p.y , detail , globalAmplitude), fbm(p + q - globalSpeed * speed.y , detail , globalAmplitude));
    vec3 c = mix(c1.rgb, c2.rgb, fbm(p + r , detail , globalAmplitude)) + mix(c3.rgb, c4.rgb, r.x) - mix(c5.rgb, c6.rgb, r.y);
    vec3 color = vec3(c * cos(shift * texCoord.y));
    color += .05;
    color.r *= .8;
    vec3 hsv = rgb2hsv(color);
    hsv.y *= hsv.z  * 1.1;
    hsv.z *= hsv.y * 1.13;
    hsv.y = (2.2-hsv.z*.9)*1.20;
    color = hsv2rgb(hsv);
    fragColor = vec4(color.x, color.y, color.z, texture2D(texture,texCoord).a);
}