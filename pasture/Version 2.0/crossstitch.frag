/* Adapted from https://www.shadertoy.com/view/MlKSWm  noise functions.
//			Author : Ian McEwan, Ashima Arts.
//	Maintainer : ijm
//		 Lastmod : 20110822 (ijm)
//		 License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//							 Distributed under the MIT License. See LICENSE file.
//							 https://github.com/ashima/webgl-noise
Rebuilt for enve by axiomgraph 
// Opengl version 3.3*/
#version 330 core

#define PI 3.1415926535897932384626433832795

layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform float iTime;//


uniform float stitching_size;

uniform int invert;



vec4 PostFX(sampler2D tex, vec2 uv, float iTime) {
	vec4 c = vec4(0.0);
	float size = stitching_size;
	vec2 cPos = uv * resolution;
	vec2 tlPos = floor(cPos / vec2(size, size));
	tlPos *= size;
	int remX = int(mod(cPos.x, size));
	int remY = int(mod(cPos.y, size));
	if (remX == 0 && remY == 0)
		tlPos = cPos;
	vec2 blPos = tlPos;
	blPos.y += (size - 1.0);
	if ((remX == remY) || 
		 (((int(cPos.x) - int(blPos.x)) == (int(blPos.y) - int(cPos.y)))))
	{
		if (!bool(invert))
			c = vec4(0.2, 0.15, 0.05, 1.0);
		else
			c = texture(texture, tlPos * vec2(1.0/resolution.x, 1.0/resolution.y)) * 1.4;
	}
	else
	{
		if (!bool(invert))
			c = texture(texture, tlPos * vec2(1.0/resolution.x, 1.0/resolution.y)) * 1.4;
		else
			c = vec4(0.0, 0.0, 0.0, 1.0);
	}
	return c;
}

void main(void) {
	vec2 uv = texCoord;
	fragColor = PostFX(texture, uv, iTime);
}
