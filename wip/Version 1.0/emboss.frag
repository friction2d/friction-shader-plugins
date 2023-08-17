// Adapted from olive video editor
// Rebuilt for enve by axiomgraph
// Opengl version 3.3

#version 330


layout(location = 0) out vec4 fragColor;
layout( origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;


in vec2 texCoord;
uniform float iTime;

/* Original source code: https://www.youtube.com/watch?v=I23zT7iu_Y4
Adapted */

uniform float contrast100;
uniform float level;
uniform int invert;
uniform int hslmode; // luminance is 2*V

bool boolint(int value){ //int to bool caster
  bool value1 = true;
  bool value2 = false;
  if( value == 1){
	return value1;
	}
  else
  {
	return value2;
	}
}



void main() {
    
    float contrast = contrast100 / 100.0;
    
	vec2 onePixel = vec2(floor(level) /  resolution.x, floor(level) /  resolution.y); // calculating the size of one pixel on the screen for the current resolution

	vec3 color = vec3(.5); // initialize color with half value on all channels
    if (bool(invert)) {
        color += texture2D(texture, texCoord - onePixel).rgb * contrast; 
	    color -= texture2D(texture, texCoord + onePixel).rgb * contrast;
    } else {
	    color -= texture2D(texture, texCoord - onePixel).rgb * contrast; 
	    color += texture2D(texture, texCoord + onePixel).rgb * contrast;
	}
	
	// original color
	vec4 color0 = texture2D(texture,texCoord);
	
	bool hslmod = bool(hslmode);


	// grayscale
    float gray = (color.r + color.g + color.b) / (hslmod ? 3.0 : 1.5);
    
    //self-multiply
    color = color0.rgb * gray;
    
	fragColor = vec4(color * color0.a, color0.a);
}
