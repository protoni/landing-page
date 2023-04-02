import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'

function togglePause(event) {
	console.log(event.target.id)
}

//document.getElementById("testBtn").addEventListener("click", console.log('testi'), false);

// Select the container for the scene
const container = document.getElementById('container');
const overlay = document.getElementById('some-overlay');
//var overlay = document.querySelector('.some-overlay');
//document.getElementById('testBtn').addEventListener('mousedown', togglePause);

// Create UI renderer
const uiRenderer = new CSS2DRenderer();
uiRenderer.setSize(window.innerWidth, window.innerHeight);
uiRenderer.domElement.style.position = 'absolute';
uiRenderer.domElement.style.top = '0px';
uiRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(uiRenderer.domElement);

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Load the panoramic image and create a texture
const loader = new THREE.TextureLoader();
const texture = loader.load('assets/landscape.jpg');

// Create a spherical geometry and map the texture to it
const geometry = new THREE.SphereGeometry(500, 60, 40);

// Create clickable ui box
function createBox(name, x, y, z) {
    const box = new THREE.BoxGeometry(0.1);
    const material = new THREE.MeshBasicMaterial({color: 0x0f0f0f});
    const mesh = new THREE.Mesh(box, material);
    mesh.position.set(x, y, z);
    mesh.name = name;
    return mesh;
}

const group = new THREE.Group();
const box1 = createBox('box1', 3, 0, 0);
const box2 = createBox('box2', 1.5, 0, 3);
const box3 = createBox('box3', -3, 0, 6);
box3.rotateY(30);
box2.rotateY(140);
group.add(box1);
group.add(box2);
group.add(box3);
scene.add(group);

// Flip the geometry inside out
geometry.scale(-1, 1, 1);

const material = new THREE.MeshBasicMaterial({
    map: texture
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Create label
const p = document.createElement('p');
p.className = 'tooltip';
//const cPointLabel = new CSS2DObject(p);
//scene.add(cPointLabel);
//cPointLabel.position.set(10, 10, 10);

const div = document.createElement('div');
div.appendChild(p);
const divContainer = new CSS2DObject(div);
scene.add(divContainer);

// Create a raycaster for mouse clicking items
const mousePos = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
window.addEventListener('mousemove', function(e) {
    mousePos.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePos.y = -(e.clientY / this.window.innerHeight) * 2 + 1;

    

    raycaster.setFromCamera(mousePos, camera);
    const intersects = raycaster.intersectObject(group);
    if(intersects.length > 0) {
        switch(intersects[0].object.name) {
            case 'box1':
                //console.log('tooltip');
                p.className = 'tooltip show';
                divContainer.position.set(20, 50, 20);
                p.textContent = 'Text content';
                divContainer.color = 0xff0000;
                //if (e.buttons) {
                //    console.log("box1 clicked!");
                //}
                break;

            default:
                break;
        }
    }
    else {
        p.className = 'tooltip hide';
        p.textContent = '';
    }
});

window.addEventListener('mousedown', function(e) {
    mousePos.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePos.y = -(e.clientY / this.window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePos, camera);
    const intersects = raycaster.intersectObject(group);
    if(intersects.length > 0) {
        switch(intersects[0].object.name) {
            case 'box1':
                console.log("box1 clicked!");
                break;

            default:
                break;
        }
    }
});

// Set up the camera and controls
camera.position.set(0, 0, 0.1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

controls.rotateSpeed = 0.3;

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    uiRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);


// Animation loop
let lastTime = 0;
const rotationSpeed = 0.00005;

function animate(time) {
    const delta = time - lastTime;
    lastTime = time;
    requestAnimationFrame(animate);

    sphere.rotation.y += rotationSpeed * delta;

    uiRenderer.render(scene, camera);

    controls.update();
    renderer.render(scene, camera);
}

animate(0);







