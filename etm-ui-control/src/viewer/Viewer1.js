import { useEffect } from 'react';
import * as THREE from 'three';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js';



let mixer, stats, renderer, scene, camera, controls ;
const clock = new THREE.Clock();

function Viewer1() {

    useEffect(() => {
        const container = document.getElementById('viewer');

        stats = new Stats();
		container.appendChild( stats.dom );

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 40, container.clientWidth / container.clientHeight, 0.1, 1000 );
		camera.position.set( 5, 2, 8 );

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0x000, 1.0));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.Enabled = true;

        camera.position.x = 10;
        camera.position.y = 10;
        camera.position.z = 10;
        camera.lookAt(new THREE.Vector3(0, -2, 0));

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(20, 20, 20);
        scene.add(spotLight);

        container.appendChild( renderer.domElement );
        

        controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        const manager = new THREE.LoadingManager();
        manager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };

        const loader = new PLYLoader();
        var group = new THREE.Object3D();
        loader.load( 'assets/models/test.ply', function ( geometry ) {

            var material = new THREE.PointCloudMaterial({
                color: 0xffffff,
                size: 0.4,
                opacity: 0.6,
                transparent: true,
                blending: THREE.AdditiveBlending,
                map: generateSprite()
            });

            group = new THREE.PointCloud(geometry, material);
            group.sortParticles = true;

            scene.add(group);

            animate();
         });

        window.addEventListener( 'resize', onWindowResize );

    }, []);

    return (
        <div id="viewer" style={{ width: '100%', height: '100%', border: '1px solid blue' }} />
    );
}

function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;

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

    controls.update();
    stats.update();

    renderer.render( scene, camera );
};

export default Viewer1;