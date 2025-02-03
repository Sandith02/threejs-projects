import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(6, 4, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Environment Map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
    "https://threejs.org/examples/textures/cube/Park2/posx.jpg",
    "https://threejs.org/examples/textures/cube/Park2/negx.jpg",
    "https://threejs.org/examples/textures/cube/Park2/posy.jpg",
    "https://threejs.org/examples/textures/cube/Park2/negy.jpg",
    "https://threejs.org/examples/textures/cube/Park2/posz.jpg",
    "https://threejs.org/examples/textures/cube/Park2/negz.jpg"
]);
scene.background = envMap;

// Main Structure Group
const structure = new THREE.Group();
scene.add(structure);

// Core Sphere (Glowing Effect)
const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const coreMaterial = new THREE.MeshPhysicalMaterial({
    emissive: 0x00ffcc,
    emissiveIntensity: 1,
    metalness: 0.8,
    roughness: 0.2,
    envMap: envMap
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
core.castShadow = true;
structure.add(core);

// Orbiting Rings
const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x5555ff,
    metalness: 0.9,
    roughness: 0.1,
    envMap: envMap
});

const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2, 0.1, 16, 100), ringMaterial);
ring1.rotation.x = Math.PI / 3;
const ring2 = ring1.clone();
ring2.rotation.x = -Math.PI / 3;
const ring3 = ring1.clone();
ring3.rotation.y = Math.PI / 2;

structure.add(ring1, ring2, ring3);

// Floating Cubes Around the Structure
const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff9900,
    emissive: 0xff7700,
    emissiveIntensity: 0.5,
    metalness: 0.7,
    roughness: 0.3,
    envMap: envMap
});

const floatingCubes = [];
for (let i = 0; i < 6; i++) {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), cubeMaterial);
    cube.position.set(
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5
    );
    floatingCubes.push(cube);
    scene.add(cube);
}

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(3, 5, 3);
pointLight.castShadow = true;
scene.add(pointLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Core
    core.rotation.y += 0.02;
    
    // Rotate Rings
    ring1.rotation.z += 0.01;
    ring2.rotation.z -= 0.01;
    ring3.rotation.x += 0.01;

    // Floating Cubes Movement
    floatingCubes.forEach((cube, index) => {
        cube.rotation.y += 0.02;
        cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle Window Resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
