// Adapted from natronplugins
// Rebuild for enve by axiomgraph
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
in vec2 texCoord;

uniform float Size; 
uniform float Offset; 
uniform float Strength; 
void main(void)
{
   vec4 sum = vec4(0);
   int j;
   int i;

   for( i= -4 ;i < 4; i++)
   {
        for (j = -3; j < 3; j++)
        {
            sum += texture(texture, texCoord + vec2(j, i)*Offset*0.01) * Strength;
        }
   }
        {
            fragColor = sum*sum*0.0075*Size + texture(texture, texCoord);
        }
}