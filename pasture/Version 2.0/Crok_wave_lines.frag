/*Ported from Natron Plugins ( Adapted to Natron by F.Fernandez
 Original code : crok_wave_lines Matchbox for Autodesk Flame
 based on http://glsl.heroku.com/e#13475.0) */

// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
in vec2 texCoord;

uniform sampler2D texture;
uniform vec2 scenePos;
uniform float iTime;

uniform float Lines;// = 29.0; // Lines : (lines), min=1.0, max=500.0
uniform float Brightness;// = 2.0; // Brightness : (brightness), min=0.0, max=100.0
uniform float Speed;// = 5.0; // Speed : (speed), min=-1000.0, max=1000.0
uniform float Offset;// = 37.0; // Offset : (offset), min=-1000.0, max=1000.0
uniform float Glow;// = 1; // Glow : (glow), min=0.0, max=10.0

uniform vec4 Colour1;// = vec3(1.4, 0.8, 0.4); // Colour 1 : (colour1)
uniform vec4 Colour2; //= vec3(0.5, 0.9, 1.3); // Colour 2 : (colour2)
uniform vec4 Colour3;// = vec3(0.9, 1.4, 0.4); // Colour 3 : (colour3)
uniform vec4 Colour4;// = vec3(1.8, 0.4, 0.3); // Colour 4 : (colour4)

float time = iTime * 0.01 * Speed + Offset;

void main(void)
{
    float x, y, xpos, ypos;
	float t = time * 10.0;
    vec3 c = vec3(0.0);
    
    xpos = (gl_FragCoord.x / scenePos.x);
    ypos = (gl_FragCoord.y / scenePos.y);
    
    x = xpos;
    for (float i = 0.0; i < Lines; i += 1.0) {
        for(float j = 0.0; j < 2.0; j += 1.0){
            y = ypos
            + (0.30 * sin(x * 2.000 +( i * 1.5 + j) * 0.2 + t * 0.050)
               + 0.300 * cos(x * 6.350 + (i  + j) * 0.2 + t * 0.050 * j)
               + 0.024 * sin(x * 12.35 + ( i + j * 4.0 ) * 0.8 + t * 0.034 * (8.0 *  j))
               + 0.5);
            
            c += vec3(1.0 - pow(clamp(abs(1.0 - y) * 1. / Glow * 10., 0.0,1.0), 0.25));
        }
    }
    
    c *= mix(
             mix(Colour1.rgb, Colour2.rgb, xpos)
             , mix(Colour3.rgb, Colour4.rgb, xpos)
             ,(sin(t * 0.02) + 1.0) * 0.45
             ) * Brightness * .1;
    
    fragColor = vec4(c, texture(texture,texCoord).a);
}

