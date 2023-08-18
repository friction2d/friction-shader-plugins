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

set(FX_GENERATORS "3dgrid;tunnel;flame;clouds;wavelines;blobs")
foreach(FX_GENERATOR ${FX_GENERATORS})
    install(
        FILES
        Generate/${FX_GENERATOR}/${FX_GENERATOR}.frag
        Generate/${FX_GENERATOR}/${FX_GENERATOR}.gre
        DESTINATION
        ${CMAKE_INSTALL_DATAROOTDIR}/friction/plugins/shaders/Generate/${FX_GENERATOR}
    )
endforeach()
