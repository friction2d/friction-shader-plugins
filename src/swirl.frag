// Adapted from olivevideoeditor project
// Rebuild for enve by axiomgraph
// Opengl version 3.3
#version 330 core


layout(location = 0) out vec4 fragColor;

in vec2 texCoord;

uniform sampler2D texture;

// Swirl effect parameters
uniform float Radius;
uniform float Angle;
uniform vec2 Position;


void main(void) {
  vec2 center = Position ;; // needs improvement 

  vec2 uv = texCoord;

  vec2 tc = uv  ; //
  tc -= center;
  float dist = length(tc);
  if (dist < Radius) {
    float percent = (Radius - dist) / Radius;
    float theta = percent * percent * -Angle;
    float s = sin(theta);
    float c = cos(theta);
    tc = vec2(dot(tc, vec2(c, -s)), dot(tc, vec2(s, c)));
  }
  tc += center;
  fragColor = texture2D(texture, tc );
}
