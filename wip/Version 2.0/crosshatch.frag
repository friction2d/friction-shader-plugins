// Ported from Natron Plugins 
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core

layout(location = 0) out vec4 fragColor;

in vec2 texCoord;
uniform sampler2D texture;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform float pDensity; // Density : (density), min=1, max=30
uniform float pWidth; // Width : (width), min=0.3, max=10


// The brightnesses at which different hatch lines appear
float hatch_1 = 0.8;
float hatch_2 = 0.6;
float hatch_3 = 0.3;
float hatch_4 = 0.15;

// How close together hatch lines should be placed
// float pDensity = 10.0;

// How wide hatch lines are drawn.
// float pWidth = 1.0;

// enable GREY_HATCHES for greyscale hatch lines
#define GREY_HATCHES

#ifdef GREY_HATCHES
float hatch_1_brightness = 0.8;
float hatch_2_brightness = 0.6;
float hatch_3_brightness = 0.3;
float hatch_4_brightness = 0.0;
#else
float hatch_1_brightness = 0.0;
float hatch_2_brightness = 0.0;
float hatch_3_brightness = 0.0;
float hatch_4_brightness = 0.0;
#endif

float d = 1.0; // kernel offset

float lookup(vec2 p, float dx, float dy)
{
    vec2 uv = (p.xy + vec2(dx * d, dy * d));
    vec4 c = texture(texture, uv.xy);
	
	// return as luma
    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
}


void main(void)
{
	//
	// Inspired by the technique illustrated at
	// http://www.geeks3d.com/20110219/shader-library-crosshatching-glsl-filter/
	//
	
	float coordX = texCoord.x;
	float coordY = texCoord.y;
	vec2 dstCoord = vec2(coordX, coordY);
	vec2 srcCoord = vec2(coordX, coordY);	
	vec2 uv = srcCoord.xy;

	vec3 res = vec3(1.0, 1.0, 1.0);
    vec4 tex = texture(texture, uv);
    float brightness = (0.2126*tex.x) + (0.7152*tex.y) + (0.0722*tex.z);
  
    if (brightness < hatch_1) 
    {
      if (mod(gl_FragCoord.x +gl_FragCoord.y, pDensity) <= pWidth)
		  res = vec3(hatch_1_brightness);
    }
  
    if (brightness < hatch_2) 
    {
		if (mod(gl_FragCoord.x - gl_FragCoord.y, pDensity) <= pWidth)
			res = vec3(hatch_2_brightness);
    }
  
    if (brightness < hatch_3) 
    {
		if (mod(gl_FragCoord.x + gl_FragCoord.y - (pDensity*0.5), pDensity) <= pWidth)
			res = vec3(hatch_3_brightness);
    }
  
    if (brightness < hatch_4) 
    {
		if (mod(gl_FragCoord.x - gl_FragCoord.y - (pDensity*0.5), pDensity) <= pWidth)
			res = vec3(hatch_4_brightness);
    }
	
	vec2 p = gl_FragCoord.xy;
    
	// simple sobel edge detection,
	// borrowed and tweaked from jmk's "edge glow" filter, here:
	// https://www.shadertoy.com/view/Mdf3zr
    float gx = 0.0;
    gx += -1.0 * lookup(p, -1.0, -1.0);
    gx += -2.0 * lookup(p, -1.0,  0.0);
    gx += -1.0 * lookup(p, -1.0,  1.0);
    gx +=  1.0 * lookup(p,  1.0, -1.0);
    gx +=  2.0 * lookup(p,  1.0,  0.0);
    gx +=  1.0 * lookup(p,  1.0,  1.0);
    
    float gy = 0.0;
    gy += -1.0 * lookup(p, -1.0, -1.0);
    gy += -2.0 * lookup(p,  0.0, -1.0);
    gy += -1.0 * lookup(p,  1.0, -1.0);
    gy +=  1.0 * lookup(p, -1.0,  1.0);
    gy +=  2.0 * lookup(p,  0.0,  1.0);
    gy +=  1.0 * lookup(p,  1.0,  1.0);
    
	// hack: use g^2 to conceal noise in the video
    float g = gx*gx + gy*gy;
	res *= (1.0-g);
	
	fragColor = vec4(res, 1.0);
}



