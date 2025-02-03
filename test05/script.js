import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Post Processing (Bloom Effect)
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// Background (Space Environment)
const cubeTextureLoader = new THREE.CubeTextureLoader();
const spaceTexture = cubeTextureLoader.load([
    "https://threejs.org/examples/textures/cube/space/posx.jpg",
    "https://threejs.org/examples/textures/cube/space/negx.jpg",
    "https://threejs.org/examples/textures/cube/space/posy.jpg",
    "https://threejs.org/examples/textures/cube/space/negy.jpg",
    "https://threejs.org/examples/textures/cube/space/posz.jpg",
    "https://threejs.org/examples/textures/cube/space/negz.jpg"
]);
scene.background = spaceTexture;

// Floating Island (Rocky Platform)
const islandGeometry = new THREE.DodecahedronGeometry(4, 1);
const islandMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
const island = new THREE.Mesh(islandGeometry, islandMaterial);
island.position.y = -2;
scene.add(island);

// Sci-Fi Shop Base
const shopGeometry = new THREE.BoxGeometry(4, 2, 4);
const shopMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, metalness: 0.7, roughness: 0.3 });
const shop = new THREE.Mesh(shopGeometry, shopMaterial);
shop.position.y = 1;
scene.add(shop);

// Neon Sign (Hologram)
const signGeometry = new THREE.PlaneGeometry(3, 1);
const signMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8
});
const shopSign = new THREE.Mesh(signGeometry, signMaterial);
shopSign.position.set(0, 2.5, 2.2);
scene.add(shopSign);

// Hovering Energy Crystals
const crystalGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0xff33cc, emissive: 0xff33cc, emissiveIntensity: 2 });

const crystals = [];
for (let i = 0; i < 4; i++) {
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.set(Math.sin(i * Math.PI / 2) * 3, Math.random() * 1 + 1, Math.cos(i * Math.PI / 2) * 3);
    scene.add(crystal);
    crystals.push(crystal);
}

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 2, 10);
pointLight.position.set(2, 5, 3);
scene.add(pointLight);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Floating Animation for the Island
    island.position.y = -2 + Math.sin(Date.now() * 0.002) * 0.3;
    
    // Rotate Shop Sign
    shopSign.material.opacity = 0.5 + Math.sin(Date.now() * 0.004) * 0.5;

    // Hovering Crystals
    crystals.forEach((crystal, index) => {
        crystal.position.y = 2 + Math.sin(Date.now() * 0.003 + index) * 0.5;
    });

    controls.update();
    composer.render();
}

animate();

// Resize Handler
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
