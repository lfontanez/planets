# 3D Solar System Visualization

A web-based 3D visualization of our solar system built with Three.js. This project was developed as a test case using Aider with Claude-3.5-Sonnet AI assistant. It features an interactive model of the solar system with planets, major moons, and various visualization controls.

## Features

- Interactive 3D visualization of the solar system
- All 8 planets with realistic relative:
  - Orbital periods (scaled)
  - Distances (logarithmically scaled)
  - Sizes (adjustable)
- Major moons including:
  - Earth's Moon (Luna)
  - Jupiter's largest moons (Ganymede, Callisto, Io, Europa)
  - Saturn's largest moon (Titan)
- Dynamic controls for:
  - Simulation speed
  - Planet sizes
  - Sun size (simulate red giant phase)
  - Moon visibility
  - Orbit path visibility
  - Planet/Moon labels
- Full camera controls:
  - Rotate view (left click + drag)
  - Pan view (right click + drag)
  - Zoom (scroll wheel)

## Technologies Used

- Three.js for 3D rendering
- CSS2DRenderer for planet labels
- OrbitControls for camera manipulation

## Usage

Simply open `index.html` in a modern web browser. The visualization will start automatically.

### Controls

#### Camera Controls
- Left click + drag: Rotate the view
- Right click + drag: Pan the view
- Scroll wheel: Zoom in/out

#### Simulation Controls
- Simulation Speed: Adjust the orbital motion speed
- Show Orbits: Toggle visibility of orbital paths
- Planet Scale: Adjust the size of all planets and moons
- Sun Scale: Adjust the sun's size (simulating different stellar phases)
- Show Labels: Toggle visibility of planet and moon names
- Show Moons: Toggle visibility of all moons

## Development

This project was developed as a test case for using Aider with Claude-3.5-Sonnet AI assistant. It demonstrates the capabilities of AI-assisted coding while creating an educational and interactive visualization tool.

## Author

Leamsi Fontánez  
[R1Software.com](https://R1Software.com)

## License

MIT License

Copyright (c) 2024 Leamsi Fontánez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
