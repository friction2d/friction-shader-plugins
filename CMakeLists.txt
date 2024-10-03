#
# Friction - https://friction.graphics
#
# Copyright (c) Friction contributors
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

cmake_minimum_required(VERSION 3.0)
project(friction-shader-plugins)
include(GNUInstallDirs)

set(FXS "2dgrid;3dgrid;8bit;analogclock;anamorphic;anmorpic_Ghost_multiLayer;anmorpic_Ghost_SingleLayer;anmorpic_Scaled;anmorpic_Spot;asciiart;barreldistortion;bilateralfilter;blackandwhite;blobs;bloom;BookFlip;Bubbles;bulge;butterflyWaveScrawler;Caustic_Ghosts;cellular;circlecrop;circlepixel;circularblur;clockofclocks;clouds;colorcorrection;colorfullsignal;Crok_2color;crok_fractal;crok_pixelate;Crok_plasnoid_enve;Crok_turbulence;crop;crosshatch;crossstitch;crosswarp;crttv;digitalclock;directionalblur;DoomScreenTransition;dotconnect;edgedetect2;edgedetect;electroniclock;emboss;engrave;fastblur;filmgrain;firespark;fisheye;flame;flip;fractal_soup;glimmer;glimmer_Multilayer;glitch2;glitch;Glow;godrays;hexagontransition;hexmarching;hoop;hoop_multilayer;HorizontalClose;InkDrop2;interference;invert;kaleidoscope;LeftRight;lensblur;loadingeffect;lumakey;mulitiIris_multi_layer;mulitiIris_single_layer;noiseanimelectric;noiseanimlava;noiseblur;Noise;octagrams;oilpaint;pagecurl;parallax;perlintransition;polarfunction;PolkaDotsCurtain;posterize;prismring;pseudopixelsort;radialblur;radialwipe;randomsqaurestransition;rgbsplit;ring;ring_multilayer;ripple;rolling_fire;seascape;sharpen;simpleinkdrop;simplergbwaveform;skyatnight;slices;sparks;star;starnest;stars;startrails;sun;swirl;synthwave;tesla;toonify;tubeclock;tunnel;undulatingBurnOut;VHS;vignette;waveforms;wave;wavelines;wavingparticle;windowslice;windtransition")
foreach(FX ${FXS})
    install(
        FILES
        src/${FX}.frag
        src/${FX}.gre
        DESTINATION
        ${CMAKE_INSTALL_DATAROOTDIR}/friction/plugins/shaders/
    )
endforeach()
