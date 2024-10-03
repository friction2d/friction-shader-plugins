/*  Adapted from https://www.shadertoy.com/view/lssGDj Ascii Art
Rebuilt for enve by axiomgraph
 Bitmap to ASCII (not really) fragment shader by movAX13h, September 2013
 This is the original shader that is now used in PixiJs, FL Studio and various other products.

Here's a little tool for new characters: thrill-project.com/archiv/coding/bitmap/
update 2018-12-14: values for characters are integer now (were float)
since bit operations are available now, making use of them
instead of int(mod(n/exp2(p.x + 5.0*p.y), 2.0))
Opengl version 3.3*/
#version 330 core



layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform int grey;  
uniform float size;  


float character(int n, vec2 p)
{
	p = floor(p*vec2(4.0, -4.0) + 2.5);
    if (clamp(p.x, 0.0, 4.0) == p.x)
	{
        if (clamp(p.y, 0.0, 4.0) == p.y)	
		{
        	int a = int(round(p.x) + 5.0 * round(p.y));
			if (((n >> a) & 1) == 1) return 1.0;
		}	
    }
	return 0.0;
}

void main(void)
{
	vec2 pix = gl_FragCoord.xy;
	vec3 col = texture2D(texture, floor(pix/8.0)*8.0/resolution.xy).rgb;	
	
	float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
	
	int n =  4096;                // .
	if (gray > 0.2) n = 65600;    // :
	if (gray > 0.3) n = 332772;   // *
	if (gray > 0.4) n = 15255086; // o 
	if (gray > 0.5) n = 23385164; // &
	if (gray > 0.6) n = 15252014; // 8
	if (gray > 0.7) n = 13199452; // @
	if (gray > 0.8) n = 11512810; // #
	
	vec2 p = mod(pix/size, 2.0) - vec2(1.0);
    
	if (bool(grey))	col = gray*vec3(character(n, p));
	else col = col*character(n, p);
	
	fragColor = vec4(col, texture2D(texture,texCoord).a);
}

