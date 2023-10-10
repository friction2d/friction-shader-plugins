//////////////////////////////////////////////////////////////////////////////////////////
//          )                                                   (                       //
//       ( /(   (  (               )    (       (  (  (         )\ )    (  (            //
//       )\()) ))\ )(   (         (     )\ )    )\))( )\  (    (()/( (  )\))(  (        //
//      ((_)\ /((_|()\  )\ )      )\  '(()/(   ((_)()((_) )\ )  ((_)))\((_)()\ )\       //
//      | |(_|_))( ((_)_(_/(    _((_))  )(_))  _(()((_|_)_(_/(  _| |((_)(()((_|(_)      //
//      | '_ \ || | '_| ' \))  | '  \()| || |  \ V  V / | ' \)) _` / _ \ V  V (_-<      //
//      |_.__/\_,_|_| |_||_|   |_|_|_|  \_, |   \_/\_/|_|_||_|\__,_\___/\_/\_//__/      //
//                                 |__/                                                 //
//////////////////////////////////////////////////////////////////////////////////////////

// SPDX-FileCopyrightText: Simon Schneegans <code@simonschneegans.de>
// SPDX-License-Identifier: GPL-3.0-or-later
/* Adapted from burnmywindows
 Adapted for enve/friction by axiomgraph
 Opengl version 3.3*/
#version 330 core
layout(location = 0) out vec4 fragColor;
layout(pixel_center_integer) in vec4 gl_FragCoord;

uniform sampler2D texture;
uniform vec2 resolution;
in vec2 texCoord;


uniform int uAdditiveBlending;// boolean value
uniform vec2 uSeed; 
uniform float uScale; 
uniform float uLineWidth;
uniform vec4 uGlowColor;
uniform vec4 uLineColor;
uniform float uProgress;
uniform int uForOpening;
  

// This method generates a procedural hexagonal pattern. It returns four values:
// result.xy: This contains cell-relative coordinates for the given point.
//            [0, 0] is in the center of a cell, [0, 1] at the upper edge,
//            [sqrt(4.0 / 3.0), 0] at the right tip and so on.
// result.z:  This is the distance to the closest edge. This is used for shrinking
//            of the tiles and the sharp overlay lines.
// result.w:  This is the distance to the closest cell center. This is used for
//            the glow effect.
vec4 getHexagons(vec2 p) {

  // Length of a cell's edge.
  float edgeLength = sqrt(4.0 / 3.0);

  // The hexgrid repeats after this distance.
  vec2 scale = vec2(3.0 * edgeLength, 2.0);

  // This is a repeating grid of scale-sized cells. Y-values are in the
  // interval [-1...1], X-value in [-1.5*edgeLength...1.5*edgeLength].
  vec2 a    = mod(p, scale) - scale * 0.5;
  vec2 aAbs = abs(a);

  // This is the same as above, but offset by half scale.
  vec2 b    = mod(p + scale * 0.5, scale) - scale * 0.5;
  vec2 bAbs = abs(b);

  // Distance to closer edge, diagonally or horizontally.
  // Once for cell set A and once for cell set B.
  float distA = max(aAbs.x / edgeLength + aAbs.y * 0.5, aAbs.y);
  float distB = max(bAbs.x / edgeLength + bAbs.y * 0.5, bAbs.y);

  // Minimum of both is distance to closest edge.
  float dist = 1.0 - min(distA, distB);

  // We use the radial distance to the center for glow.
  float glow = min(dot(a, a), dot(b, b)) / 1.5;

  // Take cell-relative coordinates from the closer cell.
  vec2 cellCoords = distA < distB ? a : b;

  return vec4(cellCoords, dist, glow);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float simplex2D(vec2 p) {
  const float K1 = 0.366025404;  // (sqrt(3)-1)/2;
  const float K2 = 0.211324865;  // (3-sqrt(3))/6;

  vec2 i  = floor(p + (p.x + p.y) * K1);
  vec2 a  = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o  = vec2(m, 1.0 - m);
  vec2 b  = a - o + K2;
  vec2 c  = a - 1.0 + 2.0 * K2;
  vec3 h  = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n  = h * h * h * h *
           vec3(dot(a, -1.0 + 2.0 * hash22(i + 0.0)), dot(b, -1.0 + 2.0 * hash22(i + o)),
                dot(c, -1.0 + 2.0 * hash22(i + 1.0)));
  return 0.5 + 0.5 * dot(n, vec3(70.0));
}



void main(void) {

vec2 iTexCoord = texCoord;
  // We simply inverse the progress for opening windows.
  float progress = bool(uForOpening) ? 1.0 - uProgress : uProgress;

  // Add some smooth noise to the progress so that not every tile behaves the
  // same.
  float noise = simplex2D(iTexCoord.st + uSeed);
  progress    = clamp(mix(noise - 1.0, noise + 1.0, progress), 0.0, 1.0);

  // glowProgress fades in in the first half of the animation, tileProgress fades
  // in in the second half.
  float glowProgress = smoothstep(0.0, 1.0, clamp(progress / 0.5, 0.0, 1.0));
  float tileProgress = smoothstep(0.0, 1.0, clamp((progress - 0.5) / 0.5, 0.0, 1.0));

  vec2 texScale = 0.1 * resolution.xy / uScale;
  vec4 hex      = getHexagons(iTexCoord.st * texScale);

  vec4 oColor = vec4(0.0);

  // Crop outer parts of the shrinking tiles.
  if (tileProgress < hex.z) {

    // Make the tiles shrink by offsetting the texture lookup towards the edge
    // of the cell.
    vec2 lookupOffset = tileProgress * hex.xy / texScale / (1.0 - tileProgress);
    oColor            =  texture(texture, iTexCoord.st + lookupOffset);

    vec4 glow = uGlowColor;
    vec4 line = uLineColor;

    // For the glow, we accumulate a few exponentially scaled versions of hex.w.
    glow.a *= pow(hex.w, 20.0) * 10.0 + pow(hex.w, 10.0) * 5.0 + pow(hex.w, 2.0) * 0.5;

    // Using step(uLineWidth, hex.z) would be simpler, but the below creates some
    // fake antialiasing.
    line.a *= 1.0 - smoothstep(uLineWidth * 0.02 * 0.5, uLineWidth * 0.02, hex.z);

    // Fade in the glowing lines.
    glow.a *= glowProgress;
    line.a *= glowProgress;

    // Do not add the hexagon lines onto transparent parts of the window.
    glow *= oColor.a;
    line *= oColor.a;

    if (bool(uAdditiveBlending)) {
      oColor.rgb += glow.rgb * glow.a;
      oColor.rgb += line.rgb * line.a;
    } else {
      oColor.rgb = mix(oColor.rgb, glow.rgb, glow.a);
      oColor.rgb = mix(oColor.rgb, line.rgb, line.a);
    }
  }

  fragColor = oColor;
}
