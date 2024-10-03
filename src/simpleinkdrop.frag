/* Adapted from https://www.shadertoy.com/view/Nl2SWd  Author : shiyuugo
 Adapted for enve/friction by axiomgraph
 Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;

uniform   float time; 

float random(float n){return fract(sin(n) * 43758.5453123);}
float random(vec2 st) {return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);}
float noise(float p){
	float fl = floor(p), fc = fract(p);
	return mix(random(fl), random(fl + 1.0), fc);
}
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(random(b), random(b + d.yx), f.x), mix(random(b + d.xy), random(b + d.yy), f.x), f.y);
}


float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;}

float permute(float x) { return mod289(((x * 34.0) + 1.0) * x);}
vec2 permute(vec2 x) { return mod289(((x * 34.0) + 1.0) * x);}
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x);}
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x);}

/*============================== SimplexNoise ==============================*/
//### 2D
float snoise(vec2 v) {
  vec4 C   = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i   = floor(v + dot(v, C.yy));
  vec2 x0  = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i      = mod289(i);  // Avoid truncation effects in permutation
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m  = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m       = m * m;
  m       = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 uv, int oct) {
  vec2  pos = uv;
  float amp = 1.0, val = 0.0;
  for (int i = 0; i < oct; i++) {
    val += amp * snoise(pos);
    pos *= 2.0;
    amp *= 0.5;
  }
  return val;
}

//### 3D
float snoise(vec3 v) {
  vec2 C   = vec2(1.0 / 6.0, 1.0 / 3.0);
  vec4 D   = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i   = floor(v + dot(v, C.yyy));
  vec3 x0  = v - i + dot(i, C.xxx);
  vec3 g   = step(x0.yzx, x0.xyz);
  vec3 l   = 1.0 - g;
  vec3 i1  = min(g.xyz, l.zxy),i2  = max(g.xyz, l.zxy);
  vec3 x1  = x0 - i1 + C.xxx, x2  = x0 - i2 + C.yyy, x3  = x0 - D.yyy;
  i        = mod289(i);
  vec4  p  = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4  j  = p - 49.0 * floor(p * ns.z * ns.z);
  vec4  x_ = floor(j * ns.z);
  vec4  y_ = floor(j - 7.0 * x_);
  vec4  x  = x_ * ns.x + ns.yyyy;
  vec4  y  = y_ * ns.x + ns.yyyy;
  vec4  h  = 1.0 - abs(x) - abs(y);
  vec4  b0 = vec4( x.xy, y.xy );
  vec4  b1 = vec4( x.zw, y.zw );
  vec4  s0 = floor(b0) * 2.0 + 1.0, s1 = floor(b1) * 2.0 + 1.0;
  vec4  sh = -step(h, vec4(0, 0, 0, 0));
  vec4  a0 = b0.xzyw + s0.xzyw * sh.xxyy, a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3  p0 = vec3(a0.xy, h.x), p1 = vec3(a0.zw, h.y), p2 = vec3(a1.xy, h.z), p3 = vec3(a1.zw, h.w);
  //Normalise gradients
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m      = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
float fbm(vec2 uv, int oct, float time) {
  vec2  pos = uv;
  float amp = 1.0;
  float val = 0.0;
  for (int i = 0; i < oct; i++) {
    val += amp * snoise(vec3(pos, time));
    pos *= 2.0;
    amp *= 0.5;
  }
  return val;
}


/*============================== hash ==============================*/
float hash11(float p) {
  p = fract(p * .1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash13(vec3 p3) {
  p3 = fract(p3 * .1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash21(float p) {
  vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
vec2 hash23(vec3 p3) {
  p3 = fract(p3 * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
vec3 hash31(float p) {
  vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
vec3 hash32(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}
vec4 hash41(float p) {
  vec4 p4 = fract(vec4(p) * vec4(.1031, .1030, .0973, .1099));
  p4 += dot(p4, p4.wzxy + 33.33);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
vec4 hash42(vec2 p) {
  vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
  p4 += dot(p4, p4.wzxy + 33.33);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
vec4 hash43(vec3 p) {
  vec4 p4 = fract(vec4(p.xyzx) * vec4(.1031, .1030, .0973, .1099));
  p4 += dot(p4, p4.wzxy + 33.33);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
vec4 hash44(vec4 p4) {
  p4 = fract(p4 * vec4(.1031, .1030, .0973, .1099));
  p4 += dot(p4, p4.wzxy + 33.33);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}


float inkdrop(vec2 p, float scale){
    float t = scale;// * 0.5;
    float noise1 = snoise(vec3(p*vec2(2.0), t));
    float noise2 = 0.5 + 0.5 * fbm(p*vec2(5.0), 5, t);
    float noise3 = 0.5 + 0.5 * fbm(p*vec2(3.0), 3, t);

    float n = noise1*0.1 + noise2 *0.05 + noise3 *0.025;
    float r = length(p - 0.);
    float res = 0.0;
    //res = 1.0 - smoothstep(t * 0.99, t, r - n);
    //res = 1.0 - smoothstep(t * 0.99, t, r - n *pow(t,0.75));
    
    float aaVal = 3./ min(resolution.x, resolution.y);
    res = 1.0 - smoothstep(t - aaVal, t, r - n *pow(t,0.75));

    return res;
}

 void main(void)
{
     vec2 uv = (gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x, resolution.y);
    vec2 uv1 = texCoord;
       
   float utime = pow(time, 0.8);
    float ink = inkdrop(uv, utime);
      vec3 col = vec3(ink);
     
    vec3 col1 = mix(vec3(0.0), texture2D(texture,uv1).rgb, col); // texture
    
    fragColor = vec4(col1,col*texture2D(texture,uv1).a);
    
}
