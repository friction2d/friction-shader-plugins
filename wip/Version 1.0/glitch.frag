// Adapted from natronplugins
// Rebuild for enve by axiomgraph
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
in vec2 texCoord;

uniform bool horizontal_slice = true;

uniform float time_frq; // Speed : , min=0.0, max=25.0
uniform float line_offset_threshold; // Bias : ,min=0.0, max=1.0
uniform float max_ofs_size; // Horizontal offset : ,min=0.0, max=10.0
uniform float itime;

const float min_change_frq = 4.0;


float sat( float t ) {
	return clamp( t, 0.0, 1.0 );
}
vec2 sat( vec2 t ) {
	return clamp( t, 0.0, 1.0 );
}

float remap( float t, float a, float b ) {
	return sat( (t - a) / (b - a) );
}

float linterp( float t ) {
	return sat( 1.0 - abs( 2.0*t - 1.0 ) );
}

float rand2(vec2 co) 
{
	return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

float srand( vec2 n ) {
	return rand2(n) * 2.0 - 1.0;
}

float truncn( float x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}
vec2 truncn( vec2 x, vec2 num_levels )
{
	return floor(x*num_levels) / num_levels;
}

  
void main(void )

{

float time = itime *.05;
float THRESHOLD = line_offset_threshold * 1000. / 500; // resolution
float time_s = mod( time, 32.0 );
float glitch_threshold = 1.0 - THRESHOLD;
	vec2 uv = texCoord;
	vec4 col = texture2D(texture,uv);
	
	
	if ( horizontal_slice )
	{
		float ct = truncn( time_s, min_change_frq );
		float change_rnd = rand2( truncn(uv.yy,vec2(16)) + 150.0 * ct );
		float tf = time_frq*change_rnd;
		float t = 5.0 * truncn( time_s, tf );
		float vt_rnd = 0.5*rand2( truncn(uv.yy + t, vec2(11)) );
		vt_rnd += 0.5 * rand2(truncn(uv.yy + t, vec2(7)));
		vt_rnd = vt_rnd*2.0 - 1.0;
		vt_rnd = sign(vt_rnd) * sat( ( abs(vt_rnd) - glitch_threshold) / (1.0-glitch_threshold) );
		vec2 uv_nm = uv;
		uv_nm = sat( uv_nm + vec2(max_ofs_size*vt_rnd, 0) );
		float rnd = rand2( vec2( truncn( time_s, 8.0 )) );
		uv_nm.y = (rnd>mix(1.0, 0.975, sat(THRESHOLD))) ? 1.0-uv_nm.y : uv_nm.y;
		vec4 sample1 = texture2D(texture,uv_nm); 
		col = sample1;	
	}

	fragColor = col;
}
