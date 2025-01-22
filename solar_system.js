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

let scene, camera, renderer, labelRenderer, planets = [], orbits = [], labels = [];
let simSpeed = 1, planetScale = 50;
const DISTANCE_SCALE = 80;

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
    const controls = new THREE.OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xFFFFFF, 2, 0, 1);
    scene.add(pointLight);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFF00,
        emissive: 0xFFFF00,
        emissiveIntensity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add planets
    PLANET_DATA.forEach(data => {
        createPlanet(data);
        createOrbit(getLogDistance(data.distance));
    });

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    
    // Move controls to labelRenderer's DOM element
    const controls = document.getElementById('controls');
    labelRenderer.domElement.appendChild(controls);
    
    document.getElementById('speedSlider').addEventListener('input', (e) => {
        e.stopPropagation();  // Prevent OrbitControls from catching the event
        simSpeed = e.target.value / 100;
    });
    document.getElementById('scaleSlider').addEventListener('input', (e) => {
        e.stopPropagation();  // Prevent OrbitControls from catching the event
        planetScale = e.target.value;
        updatePlanetScales();
    });
    document.getElementById('showOrbits').addEventListener('change', (e) => {
        e.stopPropagation();  // Prevent OrbitControls from catching the event
        orbits.forEach(orbit => {
            orbit.visible = e.target.checked;
        });
    });
}

function createPlanet(data) {
    const geometry = new THREE.SphereGeometry(data.size * planetScale / 50, 32, 32);
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
        const scale = PLANET_DATA[index].size * planetScale / 50;
        planet.scale.set(scale, scale, scale);
    });
}

function updatePlanetPositions() {
    planets.forEach((planet, index) => {
        planet.userData.angle += (0.01 * simSpeed) / PLANET_DATA[index].period;
        const distance = planet.userData.distance;
        planet.position.x = Math.cos(planet.userData.angle) * distance;
        planet.position.z = Math.sin(planet.userData.angle) * distance;
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
