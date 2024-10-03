// Adapted from Olive-Editor Community plugins
// Rebuild for enve by axiomgraph
#version 330 core
layout(location = 0) out vec4 fragColor;
uniform sampler2D texture;
in vec2 texCoord;

uniform float time;
const vec2 renderScale = vec2(1.,1.);
uniform float max_distort_px;
uniform float min_distort_factor;
uniform int clmpBool;


float remap( float t, float a, float b ) {
	return clamp( (t - a) / (b - a), 0.0, 1.0 );
}
vec2 remap( vec2 t, vec2 a, vec2 b ) {
	return clamp( (t - a) / (b - a), 0.0, 1.0 );
}


vec4 spectrum_offset_rgb( float t )
{

    float t0 = 3.0 * t - 1.5;
	vec4 ret = clamp( vec4( -t0, 1.0-abs(t0), t0,t0), 0.0, 1.0);
    return ret;

}


vec4 yCgCo2rgb(vec4 ycc)
{
    float R = ycc.x - ycc.y + ycc.z;
	float G = ycc.x + ycc.y;
	float B = ycc.x - ycc.y - ycc.z;
    float A = ycc.x - ycc.y - ycc.z; // float A = ycc.x - ycc.y - ycc.z;
    return vec4(R,G,B,A);
}

vec4 spectrum_offset_ycgco( float t )
{
    vec4 ygo = vec4( 1.0, 0.0, -1.25*t,0.0 );
    return yCgCo2rgb( ygo );
}

vec4 yuv2rgb( vec4 yuv )
{
    vec4 rgb;
    rgb.r = yuv.x + yuv.z * 1.13983;
    rgb.g = yuv.x + dot( vec2(-0.39465, -0.58060), yuv.yz );
    rgb.b = yuv.x + yuv.y * 2.03211;
    rgb.a = yuv.w;
    return rgb;
}


vec2 radialdistort(vec2 coord, vec2 amt)
{
	vec2 cc = coord - 0.5;
	return coord + 2.0 * cc * amt;
}

vec2 barrelDistortion( vec2 p, vec2 amt )
{
    p = 2.0 * p - 1.0;

    float maxBarrelPower = sqrt(5.0);
    float radius = dot(p,p);
    p *= pow(vec2(radius), maxBarrelPower * amt);
	/* */

    return p * 0.5 + 0.5;
}

vec2 brownConradyDistortion(vec2 uv, float dist)
{
    uv = uv * 2.0 - 1.0;
    float barrelDistortion1 = 0.1 * dist;
    float barrelDistortion2 = -0.025 * dist;

    float r2 = dot(uv,uv);
    uv *= 1.0 + barrelDistortion1 * r2 + barrelDistortion2 * r2 * r2;

    return uv * 0.5 + 0.5;
}

vec2 distort( vec2 uv, float t, vec2 min_distort, vec2 max_distort )
{
    vec2 dist = mix( min_distort, max_distort, t );
    return brownConradyDistortion( uv, 75.0 * dist.x );
}


vec4 spectrum_offset_yuv( float t )
{
    vec4 yuv = vec4( 1.0, 0.0, -1.0*t, 1.0 ); // marked for editing in future
    return yuv2rgb( yuv );
}

vec4 spectrum_offset( float t )
{
  	return spectrum_offset_rgb( t );
}


float nrand( vec2 n )
{
	return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

vec4 render( vec2 uv )
{
    #if defined( DEBUG )
    if ( uv.x > 0.7 && uv.y > 0.7 )
    {
        float d = length( vec2(0.77)- uv );
        d = min( d, length( vec2(0.82)- uv ) );
        d = min( d, length( vec2(0.875)- uv ) );      
        return vec4( step( d, 0.025) );
    }
    #endif
    
    if(clmpBool == 0)
    {return texture2D( texture, uv );}
    else {return texture2D( texture, clamp(uv,0.0,1.0) );}
}

void main()
{	
	vec2 uv = texCoord;

    
	vec2 max_distort = vec2(max_distort_px/100) ;
    vec2 min_distort = (1.+min_distort_factor) * max_distort;

    vec2 oversiz = distort( vec2(1.0), 1.0, min_distort, max_distort );
    uv = remap( uv, 1.0-oversiz, oversiz );
    
    
    const int num_iter = 7;
    const float stepsiz = 1.0 / (float(num_iter)-1.0);
    float rnd = nrand( uv + fract(time) );
    float t = rnd * stepsiz;
    
    vec4 sumcol = vec4(0.0);
	vec4 sumw = vec4(0.0);
	for ( int i=0; i<num_iter; ++i )
	{
		vec4 w = spectrum_offset( t );
		sumw += w;
        vec2 uvd = distort(uv, t, min_distort, max_distort ); 
		sumcol += w * render( uvd );
        t += stepsiz;
	}
    sumcol /= sumw;
    
    vec4 outcol = sumcol;
	
    outcol += rnd/255.0;
    
    if(clmpBool == 0)
	{fragColor = vec4( outcol);}
    else {fragColor = vec4( outcol);}
}

