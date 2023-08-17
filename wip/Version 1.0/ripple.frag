// Adapted from Olive video editor project
// Rebuilt for enve by axiomgraph
// Opengl version 3.3
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;

in vec2 texCoord;


uniform float evolution_in ;
uniform float intensity_in ;
uniform float frequency_in;
uniform vec2 position_in;


void main(void) {
  vec2 center =  position_in/100.0;

  vec2 adj_texcoord = texCoord;

  adj_texcoord -= 0.5;
  
  adj_texcoord += 0.5;
  center += 0.5;

  adj_texcoord -= center;

  float len = length(adj_texcoord);
  vec2 uv = texCoord + (adj_texcoord/len)*cos((frequency_in)*(len*12.0-evolution_in))*(intensity_in*0.0005);
  fragColor = texture2D(texture, uv);
}






