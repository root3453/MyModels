// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // Ensures white background
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Parallax variables
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Model variables
let model;
const loader = new THREE.GLTFLoader();

// DRACO loader setup
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

// Load GLB model - replace with your own model URL
loader.load('models/hand14.glb', function (gltf) {

    model = gltf.scene;
    scene.add(model);

    // Center and scale model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); // recenters the model

    const size = box.getSize(new THREE.Vector3()).length();
    camera.position.z = size * 0.5;

    document.getElementById('loading').style.display = 'none';
  },
  undefined,
  function (error) {
    console.error('Error loading model:', error);
    document.getElementById('loading').textContent = 'Error loading model';
  }
);

// Mouse move event for parallax
document.addEventListener('mousemove', onDocumentMouseMove);

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

// Handle window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Apply parallax effect to camera
    if (model) {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }
    
    renderer.render(scene, camera);
}

animate();
