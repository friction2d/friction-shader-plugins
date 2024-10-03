/* Adapted from https://godotshaders.com/shader/colorful-signal-effect/
Rebuilt for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
#define PI 3.14159265359
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
in vec2 texCoord;
uniform vec2 resolution; 
 
uniform vec4 color_signal; 
uniform float time;
uniform float size; 
uniform float zoom; 
uniform float speed; 
uniform int RainBow;

void main(void){
	
	vec2 UV= texCoord*2.0-1.0;
	UV.x*= resolution.x/resolution.y;
	float d = length(UV);
	float t = pow(smoothstep(0.9,0.2,d),0.35);
	
	// For rainbow effect, keep this line :
	vec3 rainbow = 0.5 + 0.5*cos(time+UV.xyx+vec3(0,2,4));
              vec4 color= vec4(rainbow.rgb,1.0);
	  	
	if (!bool(RainBow))
	{
	color = vec4(color_signal.rgb,texture(texture,texCoord).a);
        }

	d = sin(zoom*d - speed*time);
	d = abs(d);
	d = size/d;		
	color *= d*t;	
	fragColor = vec4(color.rgb,texture(texture,texCoord).a);
	
}

