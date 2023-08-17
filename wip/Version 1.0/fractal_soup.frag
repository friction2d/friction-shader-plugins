/* Adapted from natron plugins "
 (Adapted to Natron by F.Fernandez
 Original code :crok_fractal_soup Matchbox for Autodesk Flame"*/
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core
#ifdef GL_ES
precision mediump float; 
#endif

layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
uniform vec2 scenePos;
in vec2 texCoord;


uniform float iTime;

uniform int detail;

uniform float Speed;
uniform float gain;


float myGlobalTime = iTime*.02;




uniform float time;

uniform vec4 vBaseColour;

// Fractal Soup - @P_Malin

vec2 CircleInversion(vec2 vPos, vec2 vOrigin, float fRadius)
{	
	vec2 vOP = vPos - vOrigin;
	return vOrigin - vOP * fRadius * fRadius / dot(vOP, vOP);
}

float Parabola( float x, float n )
{
	return pow( gain*x*(1.0-x), n );
}

void main(void) 
{
	vec2 vPos = texCoord;
	vPos = vPos - 0.5;
	
	vPos.x *= scenePos.x / scenePos.y;
	
	vec2 vScale = vec2(1.2);
	vec2 vOffset = vec2( sin((myGlobalTime+time)*.123*Speed), sin((myGlobalTime+time)*.0567*Speed));

	float l = 0.0;
	float minl = 10000.0;
	
	for(int i=0; i<detail; i++)
	{
		vPos.x = abs(vPos.x);
		vPos = vPos * vScale + vOffset;	
		
		vPos = CircleInversion(vPos, vec2(0.5, 0.5), 1.0);
		
		l = length(vPos);
		minl = min(l, minl);
	}
	
	float t = 4.1 + time;

	float fBrightness = 15.0;
	
	vec3 vColour = vBaseColour.rgb * l * l * fBrightness;
	
	minl = Parabola(minl, 5.0);	
	
	vColour *= minl + 0.1;
	
	vColour = 1.0 - exp(-vColour);
	fragColor = vec4(vColour,texture2D(texture,texCoord).a);
}