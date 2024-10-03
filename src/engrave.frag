// Ported from Ported from " Money filter by Giacomo Preciado
// Based on: "Free Engraved Illustration Effect Action for Photoshop" - http://snip.ly/j0gq
// e-mail: giacomo@kyrie.pe
// website: http://kyrie.pe
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
/* 
                  ..::::::::...         
             .:------------------:.     
          .:-------:::-------------:.   
        :------:.       .:-----------:  
      :------:            .-----------. 
    .-------:               ----------: 
   .--------.               :---------. 
  .---------.               :---------  
  :----------              .-------=:   
 .------------.           :-----==:     
 :--------------:.    ..:-----=-:       
 :-------------------------=-:.         
 .---------------------::..             
  --------:.......                 ..   
  .--------.                  .:--====- 
   .---------:.           .:-=========- 
    .----------==-------============-:  
      .------=====================:.    
        .:-==================-::.       
            ..::------:::..             
*/
#version 330 core



layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;
in vec2 texCoord;
uniform vec2 scenePos;

uniform sampler2D texture;

uniform float amplitude;
uniform float frequency;

uniform float divider;

uniform float Opacity; 


void main(void)
{
    vec2 xy = gl_FragCoord.xy / scenePos.yy;
    vec2 uv = texCoord;

   
    float divide = divider / scenePos.y;
    float thickness = divide * 0.2;
    float grey = 1.0;
    const int kNumPatrones = 6;
    
    // x: seno del ángulo, y: coseno del ángulo, z: factor de suavizado
	vec3 datosPatron[kNumPatrones];
    datosPatron[0] = vec3(-0.7071, 0.7071, 3.0); // -45
    datosPatron[1] = vec3(0.0, 1.0, 0.6); // 0
    datosPatron[2] = vec3(0.0, 1.0, 0.5); // 0
    datosPatron[3] = vec3(1.0, 0.0, 0.4); // 90
    datosPatron[4] = vec3(1.0, 0.0, 0.3); // 90
    datosPatron[5] = vec3(0.0, 1.0, 0.2); // 0

    vec4 color = texture2D(texture, vec2(gl_FragCoord.x / scenePos.x, xy.y));

    
    for(int i = 0; i < kNumPatrones; i++)
    {
        float coseno = datosPatron[i].x;
        float seno = datosPatron[i].y;
        
        // Rotación del patrón
        vec2 punto = vec2(
            xy.x * coseno - xy.y * seno,
            xy.x * seno + xy.y * coseno
        );

        float grosor = thickness * float(i + 1);
        float dist = mod(punto.y + grosor * 0.5 - sin(punto.x * frequency) * amplitude, divide);
        float brillo = 0.3 * color.r + 0.4 * color.g + 0.3 * color.b;

        if(dist < grosor && brillo < 0.75 - 0.12 * float(i))
        {
            // Suavizado
            float k = datosPatron[i].z;
            float x = (grosor - dist) / grosor;
            float fx = abs((x - 0.5) / k) - (0.5 - k) / k; 
            grey = min(fx, grey);
        }
    }
  vec4 color1 = vec4(grey, grey, grey, 1.0);  
  vec4  color2 = texture2D(texture,uv); 
  fragColor =  mix(color2,color1,Opacity); 
}