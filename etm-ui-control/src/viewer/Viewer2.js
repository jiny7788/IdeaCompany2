import { useEffect } from 'react';
import * as THREE from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, renderer, scene, controls;
const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2();  // create once
const moveMouse = new THREE.Vector2();   // create once 
let draggable = null;

function Viewer2() {

    useEffect(() => {
        const container = document.getElementById('viewer');

        // CAMERA
        camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 1, 1500);
        camera.position.set(-35, 70, 100);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Event
        window.addEventListener('resize', onWindowResize);
        container.addEventListener('click', onClick);
        container.addEventListener('mousemove', onMoveMouse);
        
        // SCENE
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0xbfd1e5);

        // CONTROLS
        controls = new OrbitControls(camera, renderer.domElement);

        // ambient light
        let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
        scene.add(hemiLight);

        //Add directional light
        let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(-30, 50, -30);
        scene.add(dirLight);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.left = -70;
        dirLight.shadow.camera.right = 70;
        dirLight.shadow.camera.top = 70;
        dirLight.shadow.camera.bottom = -70;

        // Create Objects
        createFloor();
        createCastle();
        createBox();
        createSphere();
        createCylinder();


        // animate
        animate();
    }, []);

    return (
        <div id="viewer" style={{ width: '100%', height: '100%', border: '1px solid blue' }} />
    );
}

function onWindowResize() {
    const container = document.getElementById('viewer');

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight );
};

function animate() {
    dragObject();
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
}

function onClick(event) {
    if (draggable != null) {
        console.log(`dropping draggable ${draggable.userData.name}`)
        draggable = null
        return;
      }
    
    // THREE RAYCASTER
    clickMouse.x = ( (event.clientX - renderer.domElement.getBoundingClientRect().left ) / renderer.domElement.width) * 2 - 1;
    clickMouse.y = -( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.height) * 2 + 1;

    const found = intersect(clickMouse);
    if (found.length > 0) {
        if (found[0].object.userData.draggable) {
            draggable = found[0].object
            console.log(`found draggable ${draggable.userData.name}`)
        }
    }
}

function onMoveMouse(event) {
    moveMouse.x = ( (event.clientX - renderer.domElement.getBoundingClientRect().left ) / renderer.domElement.width) * 2 - 1;
    moveMouse.y = -( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.height) * 2 + 1;
}

function dragObject() {
    if (draggable != null) {
      const found = intersect(moveMouse);
      if (found.length > 0) {
        for (let i = 0; i < found.length; i++) {
          if (!found[i].object.userData.ground)
            continue
          
          let target = found[i].point;
          draggable.position.x = target.x
          draggable.position.z = target.z
        }
      }
    }
  }


function createFloor() {
    let pos = { x: 0, y: -1, z: 3 };
    let scale = { x: 100, y: 2, z: 100 };
  
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xf9c834 }));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);
  
    blockPlane.userData.ground = true
}

function createBox() {
    let scale = { x: 6, y: 6, z: 6 }
    let pos = { x: 15, y: scale.y / 2, z: 15 }
  
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(), 
        new THREE.MeshPhongMaterial({ color: 0xDC143C }));
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box)
  
    box.userData.draggable = true
    box.userData.name = 'BOX'
}
  
function createSphere() {
    let radius = 4;
    let pos = { x: 15, y: radius, z: -15 };

    let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32), 
        new THREE.MeshPhongMaterial({ color: 0x43a1f4 }))
    sphere.position.set(pos.x, pos.y, pos.z)
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)

    sphere.userData.draggable = true
    sphere.userData.name = 'SPHERE'
}

function createCylinder() {
    let radius = 4;
    let height = 6
    let pos = { x: -15, y: height / 2, z: 15 };

    // threejs
    let cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 32), new THREE.MeshPhongMaterial({ color: 0x90ee90 }))
    cylinder.position.set(pos.x, pos.y, pos.z)
    cylinder.castShadow = true
    cylinder.receiveShadow = true
    scene.add(cylinder)

    cylinder.userData.draggable = true
    cylinder.userData.name = 'CYLINDER'
}
  
function createCastle() {
    const objLoader = new OBJLoader();
  
    objLoader.loadAsync('models/obj/castle/castle.obj').then((group) => {
      const castle = group.children[0];
  
      castle.position.x = -15
      castle.position.z = -15
  
      castle.scale.x = 5;
      castle.scale.y = 5;
      castle.scale.z = 5;
  
      castle.castShadow = true
      castle.receiveShadow = true
  
      castle.userData.draggable = true
      castle.userData.name = 'CASTLE'
  
      scene.add(castle)
    })
  }


export default Viewer2;



// https://github.com/tamani-coding/threejs-raycasting
// https://www.youtube.com/watch?v=a0qSHBnqORU