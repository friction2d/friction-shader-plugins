/* Adapted from  https://www.shadertoy.com/view/ldVBDD
Rebuilt for enve/friction by axiomgraph
 Opengl version 3.3*/
#version 330 core
#define PI 3.14159

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;

uniform vec2 resolution;
in vec2 texCoord;

uniform   float hours; 
uniform   float minutes;
uniform   float seconds; 
uniform vec4 color;

float d_seg(vec2 position, vec2 start_p, vec2 end_p, float R)
{	 
	vec2 AP = position - start_p;
	vec2 AB = end_p - start_p;
	float h = clamp(dot(AP, AB) / dot(AB, AB), 0.0, 1.0);
	float seg = abs(length(AP - AB * h) - R);
	return max(1.0 / seg - 1.0, 0.0);
}

mat2 rot(float a)
{
    vec2 r = vec2(cos(a), sin(a));
    return mat2(r.x, r.y, -r.y, r.x);
}

float get_ch_0(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 0.0), vec2(0.0, 2.0), R);
	line += d_seg(pos, vec2(0.0, 2.0), vec2(0.0, 4.0), R);
	line += d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 4.0), vec2(2.0, 2.0), R);
	line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
	return line += d_seg(pos, vec2(2.0, 0.0), vec2(0.0, 0.0), R);
}

float get_ch_1(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(2.0, 0.0), vec2(2.0, 2.0), R);
	return line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 4.0), R);
}

float get_ch_2(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 4.0), vec2(2.0, 2.0), R);
	line += d_seg(pos, vec2(2.0, 0.0), vec2(0.0, 0.0), R);
	line += d_seg(pos, vec2(0.0, 0.0), vec2(0.0, 2.0), R);
	return line += d_seg(pos, vec2(0.0, 2.0), vec2(2.0, 2.0), R);
}

float get_ch_3(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 4.0), vec2(2.0, 2.0), R);
	line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
	line += d_seg(pos, vec2(2.0, 0.0), vec2(0.0, 0.0), R);
	return line += d_seg(pos, vec2(0.0, 2.0), vec2(2.0, 2.0), R);
}

float get_ch_4(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(2.0, 4.0), vec2(2.0, 2.0), R);
	line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
	line += d_seg(pos, vec2(0.0, 2.0), vec2(0.0, 4.0), R);
	return line += d_seg(pos, vec2(0.0, 2.0), vec2(2.0, 2.0), R);
}

float get_ch_5(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
	line += d_seg(pos, vec2(2.0, 0.0), vec2(0.0, 0.0), R);
	line += d_seg(pos, vec2(0.0, 2.0), vec2(0.0, 4.0), R);
	return line += d_seg(pos, vec2(0.0, 2.0), vec2(2.0, 2.0), R);
}

float get_ch_6(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
	line += d_seg(pos, vec2(2.0, 0.0), vec2(0.0, 0.0), R);
	line += d_seg(pos, vec2(0.0, 0.0), vec2(0.0, 2.0), R);
	line += d_seg(pos, vec2(0.0, 2.0), vec2(0.0, 4.0), R);
	return line += d_seg(pos, vec2(0.0, 2.0), vec2(2.0, 2.0), R);
}

float get_ch_7(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 4.0), vec2(2.0, 2.0), R);
	return line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
}

float get_ch_8(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 4.0), vec2(2.0, 2.0), R);
	line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
	line += d_seg(pos, vec2(2.0, 0.0), vec2(0.0, 0.0), R);
	line += d_seg(pos, vec2(0.0, 0.0), vec2(0.0, 2.0), R);
	line += d_seg(pos, vec2(0.0, 2.0), vec2(0.0, 4.0), R);
	return line += d_seg(pos, vec2(0.0, 2.0), vec2(2.0, 2.0), R);
}

float get_ch_9(vec2 pos, float R)
{
	float line = d_seg(pos, vec2(0.0, 4.0), vec2(2.0, 4.0), R);
	line += d_seg(pos, vec2(2.0, 4.0), vec2(2.0, 2.0), R);
	line += d_seg(pos, vec2(2.0, 2.0), vec2(2.0, 0.0), R);
	line += d_seg(pos, vec2(2.0, 0.0), vec2(0.0, 0.0), R);
	line += d_seg(pos, vec2(0.0, 2.0), vec2(0.0, 4.0), R);
	return line += d_seg(pos, vec2(0.0, 2.0), vec2(2.0, 2.0), R);
}

float draw_num(vec2 pos, float R, int ch)
{
	float line = 0.0;
    ch -= int(10.0 * floor(0.1 * float(ch)));
	if (ch < 8)
		if (ch < 4)
			if (ch < 2)
				if (ch < 1)	line = get_ch_0(pos, R);
				else	line = get_ch_1(pos, R);
			else
				if (ch < 3)	line = get_ch_2(pos, R);
				else	line = get_ch_3(pos, R);
		else
			if (ch < 6)
				if (ch < 5)	line = get_ch_4(pos, R);
				else	line = get_ch_5(pos, R);
			else
				if (ch < 7)	line = get_ch_6(pos, R);
				else	line = get_ch_7(pos, R);
	else
		if (ch < 9)	line = get_ch_8(pos, R);
		else	line = get_ch_9(pos, R);
	return line;
}

void main(void)
{
    //font size:
    const float k = 0.1;
    //font weight:
    const float R = 0.03;
    //shaking center:
    const vec2 O = vec2(1.0, 2.0);
    vec2 pos = (2.0 * gl_FragCoord.xy - resolution.xy ) / resolution.y;
    float num[6], point[4], T[6], t[6], light = 0.0;
    T[0] = 1.0; T[1] = 10.0; T[2] = 60.0; T[3] = 600.0; T[4] = 3600.0; T[5] = 36000.0;
    t[0] = 10.0; t[1] = 6.0; t[2] = 10.0; t[3] = 6.0; t[4] = 24.0; t[5] = 2.4;
    vec2 P[6];
    vec3 col = color.rgb * 0.1; // color 
    
    float date = hours*3600.0+minutes*60.0+seconds; // time
    
    for(int i = 0; i < 6; i++)
    {
        P[i] = (pos - vec2(1.0 - 5.0*k * float(i), 0.0) - k*O) * rot(0.1 * sin(0.05 / (pow(0.5, float(i)) * T[i] * fract(date / T[i])) )) + k*O;
    	num[i] = draw_num(P[i] / k, R / k, int(mod(date / T[i], t[i])));
    	light += num[i];
    }
    for(int i = 0; i < 2; i++)
    {
        point[2*i] = max(1.0 / abs(length(pos - vec2(1.0 - (6.25 + 10.0 * float(i)) * k, 1.0 * k)) - R) - 1.0 / k, 0.0);
        point[2*i+1] = max(1.0 / abs(length(pos - vec2(1.0 - (6.25 + 10.0 * float(i)) * k, 3.0 * k)) - R) - 1.0 / k, 0.0);
    	light += k * (point[2*i] + point[2*i+1]) * mod(floor(date), 2.0);
    }
    col *= light;
    fragColor = vec4(col,col*texture2D(texture,texCoord).a);
}
