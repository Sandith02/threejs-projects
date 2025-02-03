import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Environment Map (for reflections)
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
    "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg"
]);
scene.background = environmentMap;

// Glossy Cube
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({
    metalness: 0.9,
    roughness: 0.1,
    envMap: environmentMap
});
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

// Floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(2, 5, 3);
pointLight.castShadow = true;
scene.add(pointLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
