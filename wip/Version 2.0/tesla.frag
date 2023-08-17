/* Adapted from Natron  "Adapted to Natron by F.Fernandez
// Original code : crok_tesla Matchbox for Autodesk Flame"
// Opengl version 3.3*/
#version 330 core

#define PI 3.14159265359

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;//

uniform int noOfBolts; // = 5; // Bolts : (how much lightning bolts), min=1, max=1000
uniform int iteration; // = 7; // Detail : , min=1.0, max=10

uniform float amp; // = 1.0; // Amplitude : (noise amplitude), min=-20000.0, max=20000.0
uniform float h_scale ; //= 1.0; // Width High : (width of the outer glow), min=0.01, max=100000
uniform float l_scale; // = 1.0; // Width Low : (width of the bolt), min=0.01, max=100000

uniform float speed ; //= 0.2; // Speed : (speed of the animation), min=-20000.0, max=20000.0
uniform float Offset; // = 0.0; // Offset : (offset the animation in time), min=-20000.0, max=20000.0

uniform int locked; // = false; // Enable Lock : (source and target will be merged)
uniform float y_scale; // = 0.2; // Scale : (scales the Y position for the bolts), min=-20000.0, max=20000.0
uniform vec2 posA ; //= vec2(0.0,0.5); // Left position : 
uniform vec2 posB ; //= vec2(0.5,0.5); // Middle position : 
uniform vec2 posC; // = vec2(1.0,0.5); // Right position : 

uniform float gamma ; //= 1.0; // Brightness : (adjust brightness), min=0.0, max=10
uniform float contrast; // = 1.0; // Contrast : (adjust contrast), min=0.0, max=100000
uniform float brightness; // = 1.0; // Gamma : (adjust gamma), min=0.0, max=100000

uniform vec2 tint_col1;// = vec3(0.8,1.6,2.0)
uniform float tint_col2;
 // Tint Colour : (tint colour)
uniform float tint; // = 0.75; // Tint Intensity : (how much tint is applied), min=0.0, max=1.0





vec3 tint_col =vec3(tint_col1,tint_col2);
float p1=(posA.y-0.5)*3.33;
float p5=(posB.y-0.5)*6.66;
float p10=(posC.y-0.5);

float time = iTime *.01 * speed + Offset;

const vec3 LumCoeff = vec3(0.2125, 0.7154, 0.0721);

// https://www.shadertoy.com/view/Mds3W7
// Lightning shader
// rand,noise,fmb functions from https://www.shadertoy.com/view/Xsl3zN
// jerome
// additionl stuff http://humus.name/index.php?page=3D&ID=35

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
    vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
    float total = 0.0, amplitude = 1.0;
    for (int i = 0; i < iteration; i++) {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.5 * amp;
    }
    return total;
}

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

float noise22(vec3 m) {
    return   0.5333333*simplex3d(m)
			+0.2666667*simplex3d(2.0*m)
			+0.1333333*simplex3d(4.0*m)
			+0.0666667*simplex3d(8.0*m);
}


float bolt(float shift,vec2 fragCoord){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
	float s = texture(texture, uv).r;
	
    vec2 t = uv * vec2(2.0,1.0) - (time + shift * 10.0)*3.0;
    vec3 p3 = vec3(uv, time * 5.0 + shift);    
    float ycenter = 0.0;
	float brightness_scale = 1.0;
	
	float diff = 0.0;
	if ( bool(locked) )
	{
		ycenter = mix( p1*(1.0-uv.x)+p5*uv.x , -20. + 0.5 * noise22(vec3(p3*y_scale * s)) + fbm(t)*20.0, uv.x * y_scale * s);
		float a = clamp((uv.x * -uv.x * 0.15) + 0.15, 0., 1.);   
		diff = abs(amp*2.0*ycenter * -a + uv.y - 0.5 - p10*uv.x );
		brightness_scale = 2.0;                  
   }
   else
   {
       float ycenter = fbm(t)*0.5;
	   diff = abs(uv.y - ycenter);
   }
    float hi_col = clamp ((0.5 - diff  / h_scale * 100. * brightness_scale), 0.0, 1.0);
	float low_col = clamp ((0.5 - diff  / l_scale * 10. * brightness_scale), 0.0, 1.0);
	return mix(low_col, hi_col, 0.5 );

    }

void main(void)
{
	float lightning = 0.0;
	for(float i = 0.0; i < noOfBolts; i++)
{
    lightning += bolt(i,gl_FragCoord.xy);
}

	vec3 avg_lum = vec3(0.5, 0.5, 0.5);
	vec3 col = pow(vec3(lightning), vec3(1.0 / (gamma - 0.5)));
	vec3 intensity = vec3(dot(col.rgb, LumCoeff));
	vec3 con_color = mix(avg_lum, intensity, contrast);
	vec3 brt_color = con_color - 1.0 + brightness;
	vec3 fin_color = mix(brt_color, brt_color * tint_col, tint);
	fragColor = vec4(fin_color * 5., texture(texture,texCoord).a);
}
