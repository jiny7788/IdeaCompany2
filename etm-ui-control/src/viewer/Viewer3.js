import { useEffect } from 'react';
import * as THREE from 'three';

import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, renderer, scene, controls;
const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2();  // create once
const moveMouse = new THREE.Vector2();   // create once 
let draggable = null;

function Viewer3() {

    useEffect(() => {
        const container = document.getElementById('viewer');

        // SCENE
        scene = new THREE.Scene()
        scene.background = new THREE.Color(0x8cc7de);

        // CAMERA
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(90, 25, -70);
        //camera.lookAt(new THREE.Vector3(0, 0, 0));

        //Initial cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        //Lights
        const directionalLight1 = new THREE.DirectionalLight( 0xffeeff, 0.8 );
        directionalLight1.position.set( 1, 1, 1 );
        scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.8 );
        directionalLight2.position.set( - 1, 0.5, - 1 );
        scene.add( directionalLight2 );

        const ambientLight = new THREE.AmbientLight( 0xffffee, 0.25 );
        scene.add( ambientLight );

        //Setup IFC Loader
        const ifcLoader = new IFCLoader();
        ifcLoader.ifcManager.setWasmPath( 'three/examples/jsm/loaders/ifc/' );
        ifcLoader.load( 'models/ifc/rac_advanced_sample_project.ifc', function ( model ) {
            console.log('TTTTT');
            scene.add( model.mesh );
            render1();

        } );


        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Event
        window.addEventListener('resize', onWindowResize);
        

        // CONTROLS
        controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener( 'change', render1 );

        // render
        render1();
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

function render1() {
    renderer.render( scene, camera );
};

export default Viewer3;
