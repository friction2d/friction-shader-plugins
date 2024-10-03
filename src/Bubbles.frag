// Adapted from natron project (// https://www.shadertoy.com/view/4dl3zn
// Happy Bubbles ^_^
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.)
// Rebuilt for enve by axiomgraph
// Opengl version 3.3

#version 330


layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;


in vec2 texCoord;

uniform float iTime;
uniform vec4 Color1;
uniform vec4 Color2;

void main(void)
{
	vec2 uv = -1.0 + 2.0*gl_FragCoord.xy / resolution.xy;
	uv.x *=  resolution.x / resolution.y;

    // background	 
	vec3 color = vec3(0.8 + 0.2*uv.y);

    // bubbles	
	for( int i=0; i<40; i++ )
	{
        // bubble seeds
		float pha =      sin(float(i)*546.13+1.0)*0.5 + 0.5;
		float siz = pow( sin(float(i)*651.74+5.0)*0.5 + 0.5, 4.0 );
		float pox =      sin(float(i)*321.55+4.1) * resolution.x / resolution.y;

        // buble size, position and color
		float rad = 0.1 + 0.5*siz;
		vec2  pos = vec2( pox, -1.0-rad + (2.0+2.0*rad)*mod(pha+0.1*iTime*(0.2+0.8*siz),1.0));
		float dis = length( uv - pos );
		vec3  col = mix( Color1.rgb, Color2.rgb, 0.5+0.5*sin(float(i)*1.2+1.9));
		//    col+= 8.0*smoothstep( rad*0.95, rad, dis );
		
        // render
		float f = length(uv-pos)/rad;
		f = sqrt(clamp(1.0-f*f,0.0,1.0));
		color -= col.zyx *(1.0-smoothstep( rad*0.95, rad, dis )) * f;
	}

    // vigneting	
	color *= sqrt(1.5-0.5*length(uv));

	fragColor = vec4(color,texture2D(texture,texCoord).a);
}