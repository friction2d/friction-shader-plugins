/* Credit : https://www.shadertoy.com/view/NdKyDw Hex Marching
 Rebuilt for enve by axiomgraph*/
#version 330 core

#define ROT(a)      mat2(cos(a), sin(a), -sin(a), cos(a))
#define PI          3.141592654
#define TAU         (2.0*PI)


layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;

uniform float time;
uniform float BPM; 
uniform float scale;

const float planeDist = 1.0-0.2;

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
  return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}
// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
//  Macro version of above to enable compile-time constants
#define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))


// License: Unknown, author: Unknown, found: don't remember
vec4 alphaBlend(vec4 back, vec4 front) {
  float w = front.w + back.w*(1.0-front.w);
  vec3 xyz = (front.xyz*front.w + back.xyz*back.w*(1.0-front.w))/w;
  return w > 0.0 ? vec4(xyz, w) : vec4(0.0);
}

// License: Unknown, author: Unknown, found: don't remember
vec3 alphaBlend(vec3 back, vec4 front) {
  return mix(back, front.xyz, front.w);
}

// License: Unknown, author: Unknown, found: don't remember
float tanh_approx(float x) {
  //  Found this somewhere on the interwebs
  //  return tanh(x);
  float x2 = x*x;
  return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
}

// License: Unknown, author: Unknown, found: don't remember
float hash(float co) {
  return fract(sin(co*12.9898) * 13758.5453);
}

vec3 offset(float z) {
  float a = z;
  vec2 p = -0.15*(vec2(cos(a), sin(a*sqrt(2.0))) + vec2(cos(a*sqrt(0.75)), sin(a*sqrt(0.5))));
  return vec3(p, z);
}

vec3 doffset(float z) {
  float eps = 0.05;
  return 0.5*(offset(z + eps) - offset(z - eps))/(2.0*eps);
}

vec3 ddoffset(float z) {
  float eps = 0.05;
  return 0.5*(doffset(z + eps) - doffset(z - eps))/(2.0*eps);
}

// License: CC0, author: Mårten Rånge, found: https://github.com/mrange/glsl-snippets
vec2 toPolar(vec2 p) {
  return vec2(length(p), atan(p.y, p.x));
}

// License: CC0, author: Mårten Rånge, found: https://github.com/mrange/glsl-snippets
vec2 toRect(vec2 p) {
  return vec2(p.x*cos(p.y), p.x*sin(p.y));
}

// License: MIT OR CC-BY-NC-4.0, author: mercury, found: https://mercury.sexy/hg_sdf/
float mod1(inout float p, float size) {
  float halfsize = size*0.5;
  float c = floor((p + halfsize)/size);
  p = mod(p + halfsize, size) - halfsize;
  return c;
}

vec2 hextile(inout vec2 p) {
  // See Art of Code: Hexagonal Tiling Explained!
  // https://www.youtube.com/watch?v=VmrIDyYiJBA
  const vec2 sz       = vec2(1.0, sqrt(3.0));
  const vec2 hsz      = 0.5*sz;

  vec2 p1 = mod(p, sz)-hsz;
  vec2 p2 = mod(p - hsz, sz)-hsz;
  vec2 p3 = dot(p1, p1) < dot(p2, p2) ? p1 : p2;
  vec2 n = ((p3 - p + hsz)/sz);
  p = p3;

  n -= vec2(0.5);
  // Rounding to make hextile 0,0 well behaved
  return round(n*2.0)*0.5;
}

vec4 effect(vec2 p, float aa, float h) {
  vec2 hhn = hextile(p);
  const float w = 0.02;
  vec2 pp = toPolar(p);
  float a = pp.y;
  float hn = mod1(pp.y, TAU/6.0);
  vec2 hp = toRect(pp);
  float hd = hp.x-(w*10.0);
  
  float x = hp.x-0.5*w;
  float n = mod1(x, w);
  float d = abs(x)-(0.5*w-aa);
  
  float h0 = hash(10.0*(hhn.x+hhn.y)+2.0*h+n);
  float h1 = fract(8667.0*h0);
  float cut = mix(-0.5, 0.999, 0.5+0.5*sin(time+TAU*h0));
  const float coln = 6.0;
  float t = smoothstep(aa, -aa, d)*smoothstep(cut, cut-0.005, sin(a+2.0*(h1-0.5)*time+h1*TAU))*exp(-150.0*abs(x));
  vec3 col = hsv2rgb(vec3(floor(h0*coln)/coln, 0.8, 1.0))*t*1.75;

  t = mix(0.9, 1.0, t);
  t *= smoothstep(aa, -aa, -hd);
  if (hd < 0.0) {
    col = vec3(0.0);
    t = 15.*dot(p, p);
  }
  return vec4(col, t);
}

vec4 plane(vec3 ro, vec3 rd, vec3 pp, vec3 npp, vec3 off, float n) {
  float h0 = hash(n);
  float h1 = fract(8667.0*h0);

  vec3 hn;
  vec2 p  = (pp-off*vec3(1.0, 1.0, 0.0)).xy;
  p *= ROT(TAU*h0);
  p.x -= 0.25*h1*(pp.z-ro.z);
  const float z = 1.0;
  p /= z;
  float aa = distance(pp,npp)*sqrt(1.0/3.0)/z;
  vec4 col = effect(p, aa, h1);

  return col;
}

vec3 skyColor(vec3 ro, vec3 rd) {
  return vec3(0.0);
}

vec3 color(vec3 ww, vec3 uu, vec3 vv, vec3 ro, vec2 p) {
  float lp = length(p);
  vec2 np = p + 2.0/resolution.y;
  float rdd = (scale-0.5*tanh_approx(lp));  // Playing around with rdd can give interesting distortions
//  float rdd = 2.;
  
  vec3 rd = normalize(p.x*uu + p.y*vv + rdd*ww);
  vec3 nrd = normalize(np.x*uu + np.y*vv + rdd*ww);

  const int furthest = 5;
  const int fadeFrom = max(furthest-2, 0);

  const float fadeDist = planeDist*float(furthest - fadeFrom);
  float nz = floor(ro.z / planeDist);

  vec3 skyCol = skyColor(ro, rd);


  vec4 acol = vec4(0.0);
  const float cutOff = 0.95;
  bool cutOut = false;

  float maxpd = 0.0;

  // Steps from nearest to furthest plane and accumulates the color 
  for (int i = 1; i <= furthest; ++i) {
    float pz = planeDist*nz + planeDist*float(i);

    float pd = (pz - ro.z)/rd.z;

    if (pd > 0.0 && acol.w < cutOff) {
      vec3 pp = ro + rd*pd;
      maxpd = pd;
      vec3 npp = ro + nrd*pd;

      vec3 off = offset(pp.z);

      vec4 pcol = plane(ro, rd, pp, npp, off, nz+float(i));

      float nz = pp.z-ro.z;
      float fadeIn = smoothstep(planeDist*float(furthest), planeDist*float(fadeFrom), nz);
      float fadeOut = smoothstep(0.0, planeDist*0.1, nz);
//      pcol.xyz = mix(skyCol, pcol.xyz, fadeIn);
      pcol.w *= fadeOut*fadeIn;
      pcol = clamp(pcol, 0.0, 1.0);

      acol = alphaBlend(pcol, acol);
    } else {
      cutOut = true;
      acol.w = acol.w > cutOff ? 1.0 : acol.w;
      break;
    }

  }

  vec3 col = alphaBlend(skyCol, acol);
// To debug cutouts due to transparency  
//  col += cutOut ? vec3(1.0, -1.0, 0.0) : vec3(0.0);
  return col;
}

vec3 effect(vec2 p, vec2 q) {
  float tm  = planeDist*time*BPM/60.0;
  vec3 ro   = offset(tm);
  vec3 dro  = doffset(tm);
  vec3 ddro = ddoffset(tm);

  vec3 ww = normalize(dro);
  vec3 uu = normalize(cross(normalize(vec3(0.0,1.0,0.0)+ddro), ww));
  vec3 vv = cross(ww, uu);

  vec3 col = color(ww, uu, vv, ro, p);
  
  return col;
}


const mat2 brot = ROT(2.399);
//  simplyfied version of Dave Hoskins blur
vec3 dblur(vec2 q,float rad) {
  vec3 acc=vec3(0);
  const float m = 0.002;
  vec2 pixel=vec2(m*resolution.y/resolution.x,m);
  vec2 angle=vec2(0,rad);
  rad=1.;
  const int iter = 30;
  for (int j=0; j<iter; ++j) {  
    rad += 1./rad;
    angle*=brot;
   // vec4 col=texture(iChannel1,q+pixel*(rad-1.)*angle);
    vec4 col=vec4(0.0,0.0,0.0,q+pixel*(rad-1.)*angle); 
    acc+=col.xyz;
  }
  return acc*(1.0/float(iter));
}




void main(void) {

  vec2 q = texCoord;
  vec2 p = -1. + 2. * q;
  p.x *= resolution.x/resolution.y;
  vec3 col1 = effect(p, q);
  
 
  vec2 p2 = -1.0+2.0*q;
  vec3 pcol = col1;  
  vec3 bcol = dblur(q, .75);  
  vec3 col = pcol.xyz;
  col += vec3(0.9, .8, 1.2)*mix(0.5, 0.66, length(p2))*(0.05+bcol);
  
    
  col = clamp(col, 0.0, 1.0);
  col = sqrt(col);
  fragColor = vec4(col, texture2D(texture,texCoord).a);
}




