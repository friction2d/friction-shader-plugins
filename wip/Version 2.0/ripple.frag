/*Adapted from Olive video editor project
Adapted for enve/friction by axiomgraph
Opengl version 3.3*/

#version 330 core
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;


uniform float evolution_in ;
uniform float intensity_in ;
uniform float frequency_in;
uniform vec2 position_in;


void main(void) {
 
  
	vec2 adj_texcoord = texCoord*2.0-1.0;
  
	adj_texcoord.x*= resolution.x / resolution.y;
	vec2 mouse = position_in/resolution.xy;
	mouse.x *= resolution.x / resolution.y;
 
 
	adj_texcoord -= mouse;

	float len = length(adj_texcoord);
	vec2 uv = texCoord + (adj_texcoord/len)*cos((frequency_in)*(len*12.0-evolution_in))*(intensity_in*0.0005);
  
  
	fragColor = texture(texture, uv);
}






