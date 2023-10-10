/* Adapted from https://godotshaders.com/shader/loading-effect-color-over-grayscale/ Author : mreliptik
 Adapted for enve/friction by axiomgraph
 Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;
in vec2 texCoord;


uniform float progress;

void main(void) {
	vec4 main_tx = texture(texture, texCoord);
        float avg = (main_tx.r + main_tx.g + main_tx.b) / 3.0;
	fragColor.a = main_tx.a;
	fragColor.rgb = main_tx.rgb * step(texCoord.x, progress) + (vec3(avg) * step(progress, texCoord.x));
}
