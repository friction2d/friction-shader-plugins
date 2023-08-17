// credit axiomgraph
// Opengl version 3.3
#version 330 core


layout(location = 0) out vec4 fragColor;

in vec2 texCoord;


uniform sampler2D texture;

uniform vec2 redchannel;
uniform vec2 greenchannel;
uniform vec2 bluechannel;

uniform int redOnOff;
uniform int greenOnOff;
uniform int blueOnOff;

void main( void )
{
	vec2 uv = texCoord;
	
 	
    	 float rdx = redchannel.x; //controls red channel on x axis
    	 float rdy = redchannel.y; //control red channel on y axis
    	 
    	 float gdx = greenchannel.x; //controls green channel on x axis
    	 float gdy = greenchannel.y; //controls green channel on y axis
    	 
    	 float bdx = bluechannel.x; //controls green channel on x axis
    	 float bdy = bluechannel.y; //controls green channel on y axis
    	 
	 int redoff; 
    	 int greenoff;
    	 int blueoff;
    	 if( redOnOff < 1){ // switch off red channel 
		 redoff = 1;
		} else{
		redoff = 0;
		}
		if( greenOnOff < 1){ // switch off green channel 
		 greenoff = 1;
		} else{
		greenoff = 0;
		}

		if( blueOnOff < 1)  // switch off blue channel
		{ 
	 	blueoff = 1;
		} else{
		blueoff = 0;
		}

    	 vec4 tex = vec4(texture(texture, vec2(uv.x-rdx,uv.y-rdy)).r,
                    texture(texture,vec2(uv.x-gdx,uv.y-gdy)).g,
                    texture(texture, vec2(uv.x-bdx,uv.y-bdy)).b,
                    texture(texture, texCoord.xy).a
                   );	

    	
    fragColor = vec4(tex.r-redoff,tex.g-greenoff,tex.b-blueoff,tex.a);


}
