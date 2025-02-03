import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 7);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Post Processing (Bloom Effect)
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.2, // Bloom Intensity
    0.4, // Bloom Radius
    0.85 // Bloom Threshold
);
composer.addPass(bloomPass);

// Environment Map for Sci-Fi Reflections
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
    "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg"
]);
scene.background = envMap;

// Sci-Fi Energy Core (Glowing Sphere)
const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 3,
    metalness: 1,
    roughness: 0.2,
    envMap: envMap
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// Surrounding Rings
const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 1,
    roughness: 0.3,
    envMap: envMap
});

const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2, 0.08, 16, 100), ringMaterial);
ring1.rotation.x = Math.PI / 3;
const ring2 = ring1.clone();
ring2.rotation.x = -Math.PI / 3;
const ring3 = ring1.clone();
ring3.rotation.y = Math.PI / 2;

scene.add(ring1, ring2, ring3);

// Glowing Energy Rods (Surrounding the Core)
const rodGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 32);
const rodMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3300,
    emissive: 0xff3300,
    emissiveIntensity: 2,
    metalness: 1,
    roughness: 0.1
});

const rods = [];
for (let i = 0; i < 6; i++) {
    const rod = new THREE.Mesh(rodGeometry, rodMaterial);
    rod.position.set(Math.sin((i / 6) * Math.PI * 2) * 3, 0, Math.cos((i / 6) * Math.PI * 2) * 3);
    rods.push(rod);
    scene.add(rod);
}

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 2);
pointLight.position.set(0, 3, 5);
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
    ring1.rotation.z += 0.005;
    ring2.rotation.z -= 0.005;
    ring3.rotation.x += 0.005;

    // Glow Pulsing Effect
    core.material.emissiveIntensity = 2 + Math.sin(Date.now() * 0.002) * 1.5;
    
    // Floating Rods Movement
    rods.forEach((rod, index) => {
        rod.position.y = Math.sin(Date.now() * 0.002 + index) * 0.5;
    });

    controls.update();
    composer.render(); // Use post-processing renderer
}

animate();

// Handle Window Resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
