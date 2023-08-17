// Ported from Natron Plugins 
// Rebuilt for enve by axiomgraph
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
in vec2 texCoord;


uniform float Exposure; 
uniform float amount;

uniform float Red;
uniform float Green; 
uniform float Blue; 

vec3 RGB_lum = vec3(Red, Green, Blue);
const vec3 lumcoeff = vec3(0.2126,0.7152,0.0722);

void main(void) 
{ 		
	
	vec4 tc = texture2D(texture, texCoord);

	vec4 tc_new = tc * (exp2(tc)*vec4(Exposure));
	vec4 RGB_lum = vec4(lumcoeff * RGB_lum, 0.0 );
	float lum = dot(tc_new,RGB_lum);
	vec4 luma = vec4(lum);
	vec4 result = mix(tc, luma, amount);
	fragColor = vec4(result.rgb, tc.a);
}

