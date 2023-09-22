/* Credit : https://www.shadertoy.com/view/MdfGzf 
 Rebuilt for enve by axiomgraph*/
#version 330 core

layout(location = 0) out vec4 fragColor;
layout(origin_upper_left) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;


uniform int Hours;// = 15 //min 0 max 24
uniform int Minutes;// =0; // min 0 max 60
uniform int Seconds;// =0; // min 0 max 60

uniform int AMPM;// =1;// default 24 Hours
uniform int redgreen;//=0; // default color red
uniform int microwavestyle;//=1; // default 0
uniform int showOffLed;//=0;// default 0

bool showMatrix = false;
bool showOff = false;
float iTime=0.0;

float segment(vec2 uv, bool On)
{
	if (!On && !bool(showOffLed))
		return 0.0;
	
	float seg = (1.0-smoothstep(0.08,0.09+float(On)*0.02,abs(uv.x)))*
			    (1.0-smoothstep(0.46,0.47+float(On)*0.02,abs(uv.y)+abs(uv.x)));
	
    //Fiddle with lights and matrix
	//uv.x += sin(iTime*60.0*6.26)/14.0;
	//uv.y += cos(iTime*60.0*6.26)/14.0;
	
	//led like brightness
	if (On)
		seg *= (1.0-length(uv*vec2(3.8,0.9)));//-sin(iTime*25.0*6.26)*0.04;
	else
		seg *= -(0.05+length(uv*vec2(0.2,0.1)));
	
	return seg;
}

float sevenSegment(vec2 uv,int num)
{
	float seg= 0.0;
    seg += segment(uv.yx+vec2(-1.0, 0.0),num!=-1 && num!=1 && num!=4                    );
	seg += segment(uv.xy+vec2(-0.5,-0.5),num!=-1 && num!=1 && num!=2 && num!=3 && num!=7);
	seg += segment(uv.xy+vec2( 0.5,-0.5),num!=-1 && num!=5 && num!=6                    );
   	seg += segment(uv.yx+vec2( 0.0, 0.0),num!=-1 && num!=0 && num!=1 && num!=7          );
	seg += segment(uv.xy+vec2(-0.5, 0.5),num==0 || num==2 || num==6 || num==8           );
	seg += segment(uv.xy+vec2( 0.5, 0.5),num!=-1 && num!=2                              );
    seg += segment(uv.yx+vec2( 1.0, 0.0),num!=-1 && num!=1 && num!=4 && num!=7          );
	
	return seg;
}

float showNum(vec2 uv,int nr, bool zeroTrim)
{
	//Speed optimization, leave if pixel is not in segment
	if (abs(uv.x)>1.5 || abs(uv.y)>1.2)
		return 0.0;
	
	float seg= 0.0;
	if (uv.x>0.0)
	{
		nr /= 10;
		if (nr==0 && zeroTrim)
			nr = -1;
		seg += sevenSegment(uv+vec2(-0.75,0.0),nr);
	}
	else
		seg += sevenSegment(uv+vec2( 0.75,0.0),int(mod(float(nr),10.0)));
	
	return seg;
}

float dots(vec2 uv)
{
	float seg = 0.0;
	uv.y -= 0.5;
	seg += (1.0-smoothstep(0.11,0.13,length(uv))) * (1.0-length(uv)*2.0);
	uv.y += 1.0;
	seg += (1.0-smoothstep(0.11,0.13,length(uv))) * (1.0-length(uv)*2.0);
	return seg;
}


void main(void)
{
	
     
	  
	vec2 uv = (gl_FragCoord.xy-0.5*resolution.xy) /
 		       min(resolution.x,resolution.y);
	
	float timeOffset = 0.0;
	if (resolution.x>resolution.y)
	{
		uv *= 6.0;
	}
 	else
	{
		//uv *= 12.0;
		// Many clocks with different time + zoom in on the right one
		uv *= 70.0+sin(iTime*0.0628)*58.0;
		
		uv += vec2(5.5,2.5);
		vec2 offset = vec2(floor(uv.x/11.0),
						   floor(uv.y/5.0 ));
		if (length(offset)>0.0)
			timeOffset = (offset.y*163.13+offset.x*13.23)+mod(iTime,1.0);
		else
			timeOffset = 0.0;
								
		uv.x = mod(uv.x,11.0)-5.5;
		uv.y = mod(uv.y, 5.0)-2.5;
	}  
	
	uv.x *= -1.0;
	uv.x += uv.y/12.0;
	//wobble
	//uv.x += sin(uv.y*3.0+iTime*14.0)/25.0; // wobble clock
	//uv.y += cos(uv.x*3.0+iTime*14.0)/25.0;
    uv.x += 3.5;
	float seg = 0.0;


    float secon = float(Seconds); //time
    float minut = float(Minutes*60);
    float hour = float(Hours*3600);
    
	float timeSecs = hour+minut+secon+timeOffset;
	
	seg += showNum(uv,int(mod(timeSecs,60.0)),false);
	
	timeSecs = floor(timeSecs/60.0);
	
    uv.x -= 1.75;

	seg += dots(uv);
	
    uv.x -= 1.75;
	
	seg += showNum(uv,int(mod(timeSecs,60.0)),false);
	
	timeSecs = floor(timeSecs/60.0);
	if (bool(AMPM))
	{
		if (timeSecs>12.0)
		  timeSecs = mod(timeSecs,12.0);
	}
	
    uv.x -= 1.75;
	
	seg += dots(uv);
	
    uv.x -= 1.75;
	seg += showNum(uv,int(mod(timeSecs,60.0)),true);
	
	// matrix over segment
	if (bool(microwavestyle))
	{
		seg *= 0.8+0.2*smoothstep(0.02,0.04,mod(uv.y+uv.x,0.06025));
		//seg *= 0.8+0.2*smoothstep(0.02,0.04,mod(uv.y-uv.x,0.06025));
	}
	
	if (seg<0.0)
	{
		seg = -seg;;
		fragColor = vec4(seg,seg,seg,texture2D(texture,texCoord).a*seg);
	}
	else
		if (bool(microwavestyle))
			if (bool(redgreen))
				fragColor = vec4(0.0,seg,seg*0.5,texture2D(texture,texCoord).a*seg);
			else
				fragColor = vec4(0.0,seg*0.8,seg,texture2D(texture,texCoord).a*seg);
		else
			if (bool(redgreen))
				fragColor = vec4(0.0,seg,0.0,texture2D(texture,texCoord).a*seg);
			else
				fragColor = vec4(seg,0.0,0.0,texture2D(texture,texCoord).a*seg);
	
}


