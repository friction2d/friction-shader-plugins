// Adapted from natron plugins "// Adapted to Natron by F.Fernandez
// Original code : crok_stars Matchbox for Autodesk Flame "
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
uniform vec2 scenePos;
in vec2 texCoord;

uniform float iTime;
uniform float Speed;
uniform float Density;
uniform float Brightness;
uniform float Seed ;

float time =  iTime*.08 * Speed;

#define PI  3.141592

// Random number implementation found at: lumina.sourceforge.net/Tutorials/Noise.html
float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Formulas stars 
// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
float Stars(vec3 p) {
	vec3 pos=p;
	p+=vec3(1.35,1.54,1.23);
	p*=.3;
	for (int i=0; i<22; i++) {
		p.xyz=abs(p.xyz);
		p=p/dot(p,p);
		p=p*1.-vec3(.9*Seed*0.1);
	}
	return pow(length(p),1.3*Brightness)*.004*(Density+0.75);
}

float random(float p) {
  return fract(sin(p)*10000. );
}

float noise(vec2 p) {
  return random(p.x + p.y*10000.);
}

vec2 sw(vec2 p) {return vec2( floor(p.x) , floor(p.y) );}
vec2 se(vec2 p) {return vec2( ceil(p.x)  , floor(p.y) );}
vec2 nw(vec2 p) {return vec2( floor(p.x) , ceil(p.y)  );}
vec2 ne(vec2 p) {return vec2( ceil(p.x)  , ceil(p.y)  );}

float smoothNoise(vec2 p) {
  vec2 inter = smoothstep(0., 1., fract(p));
  float s = mix(noise(sw(p)), noise(se(p)), inter.x);
  float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
  return mix(s, n, inter.y);
  return noise(nw(p));
}

float movingNoise(vec2 p) {
  float total = 0.0;
  total += smoothNoise(p     - time);
  total += smoothNoise(p*2.  + time) / 2.;
  total += smoothNoise(p*4.  - time) / 4.;
  total /= 1. + 1./2. + 1./4.;
  return total;
}

void main(void)
{
	vec2 uv = texCoord;
	uv.y*=scenePos.y/scenePos.x;
	vec3 dir=normalize(vec3(uv*.5,1.));
	vec3 col=vec3(0.);
	col+=vec3(max(0.,.5*Stars(dir*10.)));
	
	float noise = movingNoise(uv* 500. *sin(65.0001));

	fragColor = vec4(col * noise,texture2D(texture,texCoord).a);
}
