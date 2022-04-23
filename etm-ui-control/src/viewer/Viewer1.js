import { useEffect } from 'react';
import * as THREE from 'three';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js';



let mixer, stats, renderer, scene, camera, controls, tracer ;
const clock = new THREE.Clock();

function Viewer1() {

    useEffect(() => {
        const container = document.getElementById('viewer');

        stats = new Stats();
		container.appendChild( stats.dom );

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setClearColor(0xFFFFFF);
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild( renderer.domElement );

        scene = new THREE.Scene();

        var axes = new THREE.AxisHelper(200);
        scene.add(axes);

        var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x1ec876
        });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.rotation.y = Math.PI * 45 / 180;

        scene.add(cube);

        camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 10000 );
        camera.position.y = 500;
        camera.position.z = 500;
        camera.lookAt(cube.position);

        var pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(0, 300, 200);
        scene.add(pointLight);

        var geometry = new THREE.CylinderGeometry(0, 20, 100, 3);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 50, 0));
        geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        tracer = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
        scene.add(tracer);        

        controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        window.addEventListener( 'resize', onWindowResize );
        container.addEventListener('mousemove', onMouseMove, false)

        animate();

    }, []);

    return (
        <div id="viewer" style={{ width: '100%', height: '100%', border: '1px solid blue' }} />
    );
}

function onMouseMove(event) {
//    var mouse = new THREE.Vector2();
    var vector = new THREE.Vector3();

//    mouse.x = ( (event.clientX - renderer.domElement.getBoundingClientRect().left ) / renderer.domElement.width ) * 2 - 1;
//    mouse.y = - ( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.height ) * 2 + 1;
    vector.set( ( (event.clientX - renderer.domElement.getBoundingClientRect().left ) / renderer.domElement.width ) * 2 - 1, - ( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.height ) * 2 + 1, 0.5 );
    vector.unproject( camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    tracer.position.copy( camera.position ).add( dir.multiplyScalar( distance ) );

    console.log('onMouseMove', tracer.position);
}

function onWindowResize() {
    const container = document.getElementById('viewer');

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight );
};

function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();

    //controls.update();
    stats.update();

    renderer.render( scene, camera );
};

export default Viewer1;

