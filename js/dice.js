// John Gilbert - Wiz-Rad
// This code creates 3d dice. Used to roll for ability scores.

import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { OrbitControls } from '../js/OrbitControls.js';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

// initialize the html elements required for functionality. 
const canvasEl = document.querySelector('#canvas');
const scoreResult = document.querySelector('#score-result');
const rollBtn = document.querySelector('#roll-btn');

let renderer, scene, camera, diceMesh, physicsWorld, controls;

let divSize = document.getElementById('content');
let maxWidth = divSize.width
let divFitHeight = .5
const walls = [];
const scores = [];

// Edit this for tweaking.
const params = {
    numberOfDice: 4,
    segments: 40,
    edgeRadius: .07,
    notchRadius: .12,
    notchDepth: .1,
};

// All dice are accesses via this array.
const diceArray = [];

initPhysics();
initScene();

// If window is resized, update the size of the 3d playground
window.addEventListener('resize', updateSceneSize);

// Load rolling on click event
rollBtn.onclick = function() {
    if (localStorage.getItem('canThrow') == 'true') {
        throwDice()
        localStorage.setItem('canThrow','false')
    }
}


function initScene() {

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvasEl
    });
    renderer.shadowMap.enabled = true
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(10, window.innerWidth * .6 / (window.innerHeight * divFitHeight), .2, 300)
    camera.position.set(0, 8, 0).multiplyScalar(7);
    camera.lookAt(0, 0, 0)
    // camera.rotation.x=Math.PI*10

    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    updateSceneSize();

    const ambientLight = new THREE.AmbientLight(0xffffff, .5);
    scene.add(ambientLight);
    const topLight = new THREE.PointLight(0xffffff, .5);
    topLight.position.set(10, 15, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 400;
    scene.add(topLight);
    createFloor();
    createWalls(new THREE.Vector3(0, 0, -5.5), true)
    createWalls(new THREE.Vector3(0, 0, 16), false)
    // createWalls(new THREE.Vector3(0, 0, 0), false)
    // createWalls(new THREE.Vector3(0, 0, 5.5), true)
    diceMesh = createDiceMesh();
    for (let i = 0; i < params.numberOfDice; i++) {
        diceArray.push(createDice());
        addDiceEvents(diceArray[i]);
    }
    throwDice();

    render();
}

function initPhysics() {
    physicsWorld = new CANNON.World({
        allowSleep: true,
        gravity: new CANNON.Vec3(0, -50, 0),
    })
    physicsWorld.defaultContactMaterial.restitution = .3;
}

function createWalls(pos, horizontal = true) {
    const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(70, 3),
        new THREE.ShadowMaterial({
            opacity: 0
        })
        // new THREE.MeshBasicMaterial({ color: col, opacity: .01 })
    )
    wall.material.side = THREE.DoubleSide;

    wall.position.y = pos.y - 7
    wall.position.x = pos.z
    wall.position.z = pos.z
    if (!horizontal) {
        console.log("Vertical")
        wall.quaternion.setFromAxisAngle(new THREE.Vector3(0, -1, 0), Math.PI * .5);
    }
    else {
        wall.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 0), Math.PI * .5);
        console.log("Horiz")
    }
    scene.add(wall)
    // walls.push(wall)

    const wallBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane()
    });
    wallBody.position.copy(wall.position);
    wallBody.quaternion.copy(wall.quaternion);
    physicsWorld.addBody(wallBody);
}

function createFloor() {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.ShadowMaterial({
            opacity: .1
        })
        // new THREE.MeshBasicMaterial({ color: 0xfff00, opacity: .1 })
    )

    floor.receiveShadow = true;
    floor.position.y = -7;
    floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
    scene.add(floor);

    const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position);
    floorBody.quaternion.copy(floor.quaternion);
    physicsWorld.addBody(floorBody);

    // createWalls(new THREE.Vector3(0, 0, -5.5), true, 0xffff0f)
    // createWalls(new THREE.Vector3(0, 0, 16), false, 0xff332f)
    // createWalls(new THREE.Vector3(0, 0, 0), false, 0xff332f)
    // createWalls(new THREE.Vector3(0, 0, 5.5), true, 0xf0ff09)
}

function createDiceMesh() {
    const boxMaterialOuter = new THREE.MeshStandardMaterial({
        color: 0xd66770,
    })
    const boxMaterialInner = new THREE.MeshStandardMaterial({
        color: 0x590c15,
        roughness: 1,
        metalness: 1,
        side: THREE.DoubleSide
    })

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
    const outerMesh = new THREE.Mesh(createBoxGeometry(), boxMaterialOuter);
    outerMesh.castShadow = true;
    diceMesh.add(innerMesh, outerMesh);

    return diceMesh;
}

function createDice() {
    const mesh = diceMesh.clone();
    scene.add(mesh);

    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)),
        sleepTimeLimit: .1
    });
    physicsWorld.addBody(body);

    return { mesh, body };
}

function createBoxGeometry() {

    let boxGeometry = new THREE.BoxGeometry(1, 1, 1, params.segments, params.segments, params.segments);

    const positionAttr = boxGeometry.attributes.position;
    const subCubeHalfSize = .5 - params.edgeRadius;


    for (let i = 0; i < positionAttr.count; i++) {

        let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

        const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
        const addition = new THREE.Vector3().subVectors(position, subCube);


        //something to do with the physics
        if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.normalize().multiplyScalar(params.edgeRadius);
            position = subCube.add(addition);
        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) {
            addition.z = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.y = subCube.y + addition.y;
        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.y = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.z = subCube.z + addition.z;
        } else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.x = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.y = subCube.y + addition.y;
            position.z = subCube.z + addition.z;
        }

        const notchWave = (v) => {
            v = (1 / params.notchRadius) * v;
            v = Math.PI * Math.max(-1, Math.min(1, v));
            return params.notchDepth * (Math.cos(v) + 1.);
        }
        const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);

        const offset = .23;

        // Sets the numbers on the face
        if (position.y === .5) {
            position.y -= notch([position.x, position.z]);
        } else if (position.x === .5) {
            position.x -= notch([position.y + offset, position.z + offset]);
            position.x -= notch([position.y - offset, position.z - offset]);
        } else if (position.z === .5) {
            position.z -= notch([position.x - offset, position.y + offset]);
            position.z -= notch([position.x, position.y]);
            position.z -= notch([position.x + offset, position.y - offset]);
        } else if (position.z === -.5) {
            position.z += notch([position.x + offset, position.y + offset]);
            position.z += notch([position.x + offset, position.y - offset]);
            position.z += notch([position.x - offset, position.y + offset]);
            position.z += notch([position.x - offset, position.y - offset]);
        } else if (position.x === -.5) {
            position.x += notch([position.y + offset, position.z + offset]);
            position.x += notch([position.y + offset, position.z - offset]);
            position.x += notch([position.y, position.z]);
            position.x += notch([position.y - offset, position.z + offset]);
            position.x += notch([position.y - offset, position.z - offset]);
        } else if (position.y === -.5) {
            position.y += notch([position.x + offset, position.z + offset]);
            position.y += notch([position.x + offset, position.z]);
            position.y += notch([position.x + offset, position.z - offset]);
            position.y += notch([position.x - offset, position.z + offset]);
            position.y += notch([position.x - offset, position.z]);
            position.y += notch([position.x - offset, position.z - offset]);
        }

        positionAttr.setXYZ(i, position.x, position.y, position.z);
    }


    boxGeometry.deleteAttribute('normal');
    boxGeometry.deleteAttribute('uv');
    boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

    boxGeometry.computeVertexNormals();

    return boxGeometry;
}

// fills in the divots in the die faces
function createInnerGeometry() {
    const baseGeometry = new THREE.PlaneGeometry(1 - 2 * params.edgeRadius, 1 - 2 * params.edgeRadius);
    const offset = .48;
    return BufferGeometryUtils.mergeBufferGeometries([
        baseGeometry.clone().translate(0, 0, offset),
        baseGeometry.clone().translate(0, 0, -offset),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, offset, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(-offset, 0, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0),
    ], false);
}

function addDiceEvents(dice) {
    dice.body.addEventListener('sleep', (e) => {

        dice.body.allowSleep = false;

        const euler = new CANNON.Vec3();
        e.target.quaternion.toEuler(euler);

        const eps = .1;
        let isZero = (angle) => Math.abs(angle) < eps;
        let isHalfPi = (angle) => Math.abs(angle - .5 * Math.PI) < eps;
        let isMinusHalfPi = (angle) => Math.abs(.5 * Math.PI + angle) < eps;
        let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);


        if (isZero(euler.z)) {
            if (isZero(euler.x)) {
                showRollResults(1);
            } else if (isHalfPi(euler.x)) {
                showRollResults(4);
            } else if (isMinusHalfPi(euler.x)) {
                showRollResults(3);
            } else if (isPiOrMinusPi(euler.x)) {
                showRollResults(6);
            } else {
                // landed on edge => wait to fall on side and fire the event again
                dice.body.allowSleep = true;
            }
        } else if (isHalfPi(euler.z)) {
            showRollResults(2);
        } else if (isMinusHalfPi(euler.z)) {
            showRollResults(5);
        } else {
            // landed on edge => wait to fall on side and fire the event again
            dice.body.allowSleep = true;
        }
    });
}


var summation = ''

function showRollResults(score) {
    if (scoreResult.innerHTML === '') {
        scores.push(score)
        // scoreResult.innerHTML += score;
    } else {
        scores.push(score)
        // scoreResult.innerHTML += ('+' + score);
    }
    if (scores.length >= 4) {
        summation = sumOfThreeLargest(scores)
        scoreResult.innerHTML = summation
        // while (scores.length > 0) {
        //     scores.pop();
        //   }
        if (summation != '') {
            localStorage.setItem(localStorage.getItem('currentRoll'), summation.toString())
            localStorage.setItem('canThrow','false')
            document.getElementById('nextButton').style.display = 'block';
        } else {
            localStorage.setItem('canThrow','true')
        }
    }
}

function sumOfThreeLargest(arr) {
    // Sort the array in descending order
    console.log("Score:" + scores)
    arr.sort((a, b) => b - a);

    // Check if the first two numbers are the same (tied for the lowest)
    if (arr[0] === arr[1]) {
        // Remove one of the tied lowest numbers
        arr.splice(2, 1);
    }
    console.log("sumaation: " + (arr[0] + arr[1] + arr[2]))
    // Calculate and return the sum of the three largest numbers
    return arr[0] + arr[1] + arr[2];
}




function render() {
    physicsWorld.fixedStep();


    for (const dice of diceArray) {
        dice.mesh.position.copy(dice.body.position)
        dice.mesh.quaternion.copy(dice.body.quaternion)
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function updateSceneSize() {
    camera.aspect = window.innerWidth * .6 / (window.innerHeight * divFitHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * .6, (window.innerHeight * divFitHeight));
}

function mulligan() {
    if (summation == '')
    localStorage.setItem('canThrow','true')
    
}

function throwDice() {
    summation = ''
    setTimeout(mulligan, 3*1000)
    scoreResult.innerHTML = '';
    while (scores.length > 0) {
        scores.pop();
    }


    diceArray.forEach((d, dIdx) => {

        d.body.velocity.setZero();
        d.body.angularVelocity.setZero();

        d.body.position = new CANNON.Vec3(-14, dIdx * 1.5, 5);
        d.mesh.position.copy(d.body.position);

        d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random())
        d.body.quaternion.copy(d.mesh.quaternion);

        const force = 3 + 5 * Math.random();
        d.body.applyImpulse(
            new CANNON.Vec3(force * 2, force * 1.7, -6),
            new CANNON.Vec3(0, 0, .15)
        );

        d.body.allowSleep = true;
    });
}
