import React, { useEffect } from 'react';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let container;
let camera, scene, renderer;
let controls, group, orbitControls;
let enableSelection = false;
const objects = [];
const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let INTERSECTED;
let canvasWidth, canvasHeight;
            
function TestViewer() {

    useEffect(() => {
        canvasWidth = document.getElementById('viewer').clientWidth;
        canvasHeight = document.getElementById('viewer').clientHeight;
        console.log("Width:" + canvasWidth + ", Height:" +canvasHeight);

        camera = new THREE.PerspectiveCamera( 70, canvasWidth / canvasHeight, 1, 5000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );

        scene.add( new THREE.AmbientLight( 0x505050 ) );

        const light = new THREE.SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 500, 2000 );
        light.angle = Math.PI / 9;

        light.castShadow = true;
        light.shadow.camera.near = 1000;
        light.shadow.camera.far = 4000;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        scene.add( light );

        group = new THREE.Group();
        scene.add( group );

        const geometry = new THREE.BoxGeometry( 40, 40, 40 );

        for ( let i = 0; i < 200; i ++ ) {

            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = Math.random() * 1000 - 500;
            object.position.y = Math.random() * 600 - 300;
            object.position.z = Math.random() * 800 - 400;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() * 2 + 1;
            object.scale.y = Math.random() * 2 + 1;
            object.scale.z = Math.random() * 2 + 1;

            object.castShadow = true;
            object.receiveShadow = true;

            scene.add( object );

            objects.push( object );

        }

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( canvasWidth, canvasHeight );

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        container = document.getElementById('viewer');
        container.appendChild( renderer.domElement );

        controls = new DragControls( [ ... objects ], camera, renderer.domElement );
        controls.addEventListener( 'drag', render1 );

        //
        // orbitControls = new OrbitControls(camera, renderer.domElement); 
        // orbitControls.addEventListener('change', render1);
        // orbitControls.minDistance = 0.2;
        // orbitControls.maxDistance = 1000;
        // orbitControls.target.set(0, 0, - 0.2);
        // orbitControls.update();

        window.addEventListener( 'resize', onWindowResize );

        document.addEventListener( 'click', onClick );
        window.addEventListener( 'keydown', onKeyDown );
        window.addEventListener( 'keyup', onKeyUp );

        //document.addEventListener('pointermove', onPointerMove);

        render1();

    }, []);

    return (
        <div id='viewer' style={{width: '100%', height: '100%', border: '1px solid blue'}}></div>
    );
}

function onWindowResize() {
    canvasWidth = document.getElementById('viewer').clientWidth;
    canvasHeight = document.getElementById('viewer').clientHeight;

    //console.log("Width:" + canvasWidth + ", Height:" +canvasHeight);

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( canvasWidth, canvasHeight );

    render1();

}

function onPointerMove( event ) {
    canvasWidth = document.getElementById('viewer').clientWidth;
    canvasHeight = document.getElementById('viewer').clientHeight;

    pointer.x = ( event.clientX / canvasWidth ) * 2 - 1;
    pointer.y = - (event.clientY / canvasHeight) * 2 + 1;
    
    console.log("Point:" + pointer.x + "," + pointer.y);

}

function onKeyDown( event ) {

    enableSelection = ( event.keyCode === 16 ) ? true : false;

}

function onKeyUp() {

    enableSelection = false;

}

function onClick( event ) {

    event.preventDefault();

    if ( enableSelection === true ) {

        canvasWidth = document.getElementById('viewer').clientWidth;
        canvasHeight = document.getElementById('viewer').clientHeight;
        
        const draggableObjects = controls.getObjects();
        draggableObjects.length = 0;

        mouse.x = ( event.clientX / canvasWidth) * 2 - 1;
        mouse.y = - ( event.clientY / canvasHeight  ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        const intersections = raycaster.intersectObjects( objects, true );

        if ( intersections.length > 0 ) {

            const object = intersections[ 0 ].object;

            if ( group.children.includes( object ) === true ) {

                object.material.emissive.set( 0x000000 );
                scene.attach( object );

            } else {

                object.material.emissive.set( 0xaaaaaa );
                group.attach( object );

            }

            controls.transformGroup = true;
            draggableObjects.push( group );

        }

        if ( group.children.length === 0 ) {

            controls.transformGroup = false;
            draggableObjects.push( ...objects );

        }

    }

    render1();

}

function render1() {
    raycaster.setFromCamera( pointer, camera );

	const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }
    

    renderer.render( scene, camera );
}


export default TestViewer;