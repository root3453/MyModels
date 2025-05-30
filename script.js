// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // Ensures white background
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Model variables
let model;
const loader = new THREE.GLTFLoader();

// DRACO loader setup
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

// Load GLB model
loader.load('models/hand14.glb', 
  function (gltf) {
    model = gltf.scene;
    scene.add(model);

    // Center and scale model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); // recenters the model

    const size = box.getSize(new THREE.Vector3()).length();
    const scale = 2 / size; // Adjust this value to change model size
    model.scale.setScalar(scale);

    camera.position.z = 2;
    controls.update();

    // Show controls info and hide loading message
    document.getElementById('loading').style.display = 'none';
    document.getElementById('info').style.display = 'block';
  },
  function (progress) {
    const percentComplete = (progress.loaded / progress.total) * 100;
    document.getElementById('loading').textContent = `Loading: ${Math.round(percentComplete)}%`;
  },
  function (error) {
    console.error('Error loading model:', error);
    document.getElementById('loading').textContent = 'Error loading model. Please check console for details.';
    document.getElementById('loading').style.color = 'red';
  }
);

// Handle window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();