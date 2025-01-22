// Moon data with relative orbital periods (scaled)
const MOON_DATA = [
    { name: 'Luna', parentPlanet: 'Earth', distance: 0.7, period: 0.074, size: 1.2, color: 0xDDDDDD },
    { name: 'Ganymede', parentPlanet: 'Jupiter', distance: 0.8, period: 0.008, size: 1.5, color: 0x888888 },
    { name: 'Titan', parentPlanet: 'Saturn', distance: 0.9, period: 0.016, size: 1.4, color: 0xFFA500 },
    { name: 'Callisto', parentPlanet: 'Jupiter', distance: 1.2, period: 0.017, size: 1.4, color: 0x666666 },
    { name: 'Io', parentPlanet: 'Jupiter', distance: 0.4, period: 0.004, size: 1.0, color: 0xFFFF00 },
    { name: 'Europa', parentPlanet: 'Jupiter', distance: 0.6, period: 0.006, size: 0.9, color: 0xFFFFCC }
];

// Planet data with real relative orbital periods (scaled)
const PLANET_DATA = [
    { name: 'Mercury', distance: 1, period: 0.24, size: 3, color: 0xC0C0C0 },
    { name: 'Venus', distance: 2, period: 0.615, size: 4, color: 0xFAD6A5 },
    { name: 'Earth', distance: 3, period: 1, size: 4, color: 0x6B93D6 },
    { name: 'Mars', distance: 4, period: 1.88, size: 3, color: 0xE27B58 },
    { name: 'Jupiter', distance: 6, period: 11.86, size: 8, color: 0xC88B3A },
    { name: 'Saturn', distance: 8, period: 29.46, size: 7, color: 0xEAD6B8 },
    { name: 'Uranus', distance: 10, period: 84.01, size: 5, color: 0xABCCE8 },
    { name: 'Neptune', distance: 12, period: 164.79, size: 5, color: 0x5B5DDF }
];

let scene, camera, renderer, labelRenderer, planets = [], moons = [], orbits = [], labels = [];
let simSpeed = .2, planetScale = 1, sunScale = 300;
const DISTANCE_SCALE = 100;

function getLogDistance(distance) {
    // Use natural log to compress the distances
    return Math.log(distance + 1) * DISTANCE_SCALE;
}

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Label renderer
    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    // Camera position
    camera.position.z = 400;
    camera.position.y = 200;
    camera.lookAt(0, 0, 0);

    // Controls
    const orbitControls = new THREE.OrbitControls(camera, labelRenderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xFFFFFF, 2, 0, 1);
    scene.add(pointLight);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFF00,
        emissive: 0xFFFF00,
        emissiveIntensity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.scale.set(sunScale/10, sunScale/10, sunScale/10);
    scene.add(sun);

    // Add planets and their orbits
    PLANET_DATA.forEach(data => {
        createPlanet(data);
        createOrbit(getLogDistance(data.distance));
    });

    // Add moons
    MOON_DATA.forEach(data => {
        createMoon(data);
    });

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    
    // Set up controls container
    const controlsOverlay = document.getElementById('controls-overlay');
    const controls = document.getElementById('controls');
    
    // Add event listeners with pointer-events handling
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
        simSpeed = e.target.value;
    });
    speedSlider.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        orbitControls.enabled = false;
    });
    speedSlider.addEventListener('mouseup', () => {
        orbitControls.enabled = true;
    });

    const scaleSlider = document.getElementById('scaleSlider');
    scaleSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
        planetScale = e.target.value / 100;
        updatePlanetScales();
    });
    scaleSlider.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        orbitControls.enabled = false;
    });
    scaleSlider.addEventListener('mouseup', () => {
        orbitControls.enabled = true;
    });

    const showOrbitsCheckbox = document.getElementById('showOrbits');
    showOrbitsCheckbox.addEventListener('change', (e) => {
        e.stopPropagation();
        orbits.forEach(orbit => {
            orbit.visible = e.target.checked;
        });
    });

    const sunScaleSlider = document.getElementById('sunScaleSlider');
    sunScaleSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
        sunScale = e.target.value;
        sun.scale.set(sunScale/10, sunScale/10, sunScale/10);
    });
    sunScaleSlider.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        orbitControls.enabled = false;
    });
    sunScaleSlider.addEventListener('mouseup', () => {
        orbitControls.enabled = true;
    });

    const showLabelsCheckbox = document.getElementById('showLabels');
    showLabelsCheckbox.addEventListener('change', (e) => {
        e.stopPropagation();
        labels.forEach(label => {
            label.visible = e.target.checked;
        });
    });

    const showMoonsCheckbox = document.getElementById('showMoons');
    showMoonsCheckbox.addEventListener('change', (e) => {
        e.stopPropagation();
        moons.forEach(moon => {
            moon.visible = e.target.checked;
        });
    });
}

function createPlanet(data) {
    const geometry = new THREE.SphereGeometry(data.size * planetScale, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    
    // Create label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = data.name;
    const label = new THREE.CSS2DObject(labelDiv);
    label.position.set(0, data.size * planetScale / 40, 0);
    planet.add(label);
    labels.push(label);
    
    planet.userData = {
        distance: getLogDistance(data.distance),
        period: data.period,
        angle: Math.random() * Math.PI * 2
    };
    
    scene.add(planet);
    planets.push(planet);
}

function createOrbit(radius) {
    const geometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 128);
    const material = new THREE.MeshBasicMaterial({
        color: 0x666666,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(geometry, material);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    orbits.push(orbit);
}

function updatePlanetScales() {
    planets.forEach((planet, index) => {
        const scale = PLANET_DATA[index].size * planetScale;
        planet.scale.set(scale, scale, scale);
    });
    
    moons.forEach((moon, index) => {
        const scale = MOON_DATA[index].size * planetScale;
        moon.scale.set(scale, scale, scale);
    });
}

function createMoon(data) {
    const geometry = new THREE.SphereGeometry(data.size * planetScale, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: data.color });
    const moon = new THREE.Mesh(geometry, material);
    
    // Create label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = data.name;
    const label = new THREE.CSS2DObject(labelDiv);
    label.position.set(0, data.size * planetScale / 40, 0);
    moon.add(label);
    labels.push(label);
    
    moon.userData = {
        parentPlanet: data.parentPlanet,
        distance: data.distance * 20, // Scale moon orbit radius
        period: data.period,
        angle: Math.random() * Math.PI * 2
    };
    
    scene.add(moon);
    moons.push(moon);
}

function updatePlanetPositions() {
    // Update planets
    planets.forEach((planet, index) => {
        planet.userData.angle += (0.01 * simSpeed) / PLANET_DATA[index].period;
        const distance = planet.userData.distance;
        planet.position.x = Math.cos(planet.userData.angle) * distance;
        planet.position.z = Math.sin(planet.userData.angle) * distance;
    });

    // Update moons
    moons.forEach(moon => {
        moon.userData.angle += (0.01 * simSpeed) / moon.userData.period;
        const parentPlanet = planets[PLANET_DATA.findIndex(p => p.name === moon.userData.parentPlanet)];
        const moonDistance = moon.userData.distance;
        
        // Calculate moon position relative to its parent planet
        const moonX = Math.cos(moon.userData.angle) * moonDistance;
        const moonZ = Math.sin(moon.userData.angle) * moonDistance;
        
        // Set moon position relative to parent planet
        moon.position.x = parentPlanet.position.x + moonX;
        moon.position.z = parentPlanet.position.z + moonZ;
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    updatePlanetPositions();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

init();
animate();
