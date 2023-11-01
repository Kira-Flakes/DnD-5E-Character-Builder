import * as THREE from 'three';


const scene = new THREE.Scene();

// create object
const gemoetry = new THREE.IcosahedronGeometry(1, 0);
const material = new THREE.MeshStandardMaterial({
    color: '#732418',
});
const mesh = new THREE.Mesh(gemoetry, material);
scene.add(mesh);

//sizes
const sizes = {
    width: 66,
    height: 66,
}

// light
const light = new THREE.PointLight(0xffffff, 1, 100, 1);
light.position.set(10,20,10);
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height);
camera.position.z = 5;
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearAlpha()
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene, camera);

// resize 

/*window.addEventListener('resize', () => {
    sizes.width = 1920
    sizes.height = 1080
    // update camera
    camera.updateProjectionMatrix();
    camera.aspect = sizes.width/sizes.height;
    renderer.setSize(sizes.width,sizes.height);
});*/

const loop = () => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render(scene,camera);
    window.requestAnimationFrame(loop)
}

loop();