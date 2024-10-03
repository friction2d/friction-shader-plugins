/* Adapted from natron plugins 
Adapted to Natron by F.Fernandez
Original code : crok_pixelate Matchbox for Autodesk Flame
Adapted for enve/friction by axiomgraph
Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;

uniform float Detail;  
uniform int Aspect;  


void main(void)
{
	vec2 uv = texCoord;
	vec2 aspect = vec2(1.0);	
	if ( bool(Aspect) )
	    aspect = vec2(1.0, resolution.x/resolution.y);			
	vec2 size = vec2(aspect.x/Detail, aspect.y/Detail);
	vec2 pix_uv = uv - mod(uv - 0.5,size);
	vec4 color1 = vec4( texture(texture, pix_uv ).rgba);	
    	fragColor = vec4 (color1.rgb,color1.a);
}
