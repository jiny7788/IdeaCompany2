import { useEffect } from 'react';
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {Content} from './Content';


let camera, scene, renderer, stats, controls, loadedObject, tube;
const clock = new THREE.Clock();
let mixer;

function Viewer() {

    useEffect(() => {
        const container = document.getElementById('viewer');

        const content = new Content();
        scene = content.scene;
        mixer = content.mixer;
        loadedObject = content.loadedObject;

        /*
        camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 0.25, 50 );
		camera.position.set(- 1.8, 0.6, 2.7);        

        scene.background = new THREE.Color( 0xa0a0a0 );
		scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        const light = new THREE.PointLight( 0xffffff, 1 );
        scene.add( camera );
        camera.add( light );
        */

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.set( 0, 0, 10 );
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        scene.background = new THREE.Color( 0xa0a0a0 );
		scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
		hemiLight.position.set( 0, 200, 0 );
		scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 200, 100 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = - 100;
        dirLight.shadow.camera.left = - 120;
        dirLight.shadow.camera.right = 120;
        scene.add( dirLight );

        var axes = new THREE.AxisHelper(20);
        scene.add(axes);

        // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        // mesh.rotation.x = - Math.PI / 2;
        // mesh.receiveShadow = true;
        // scene.add( mesh );

        // const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
        // grid.material.opacity = 0.2;
        // grid.material.transparent = true;
        // scene.add( grid );
        
        /*
        scene.background = new THREE.Color( 0x8cc7de );

        //Camera
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.z = - 70;
        camera.position.y = 25;
        camera.position.x = 90;

        //Initial cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        //Lights
        const directionalLight1 = new THREE.DirectionalLight( 0xffeeff, 0.8 );
        directionalLight1.position.set( 1, 1, 1 );
        scene.add( directionalLight1 );

        const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.8 );
        directionalLight2.position.set( - 1, 0.5, - 1 );
        scene.add( directionalLight2 );

        const ambientLight = new THREE.AmbientLight( 0xffffee, 0.25 );
        scene.add( ambientLight );
        */

        // 여기서 model을 load한다. 
        //content.loader.loadFile('models/fbx/Samba Dancing.fbx');
        //content.loader.loadFile('models/gltf/LittlestTokyo.glb');
        content.loader.loadFile('models/gltf/LeePerrySmith/LeePerrySmith.glb');
        //content.loader.loadFile('models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf');
        //content.loader.loadFile('models/gltf/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf'); 
        //content.loader.loadFile('models/ifc/rac_advanced_sample_project.ifc');     
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.shadowMap.enabled = true;
        container.appendChild( renderer.domElement );

        controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();
        controls.enablePan = true;
        controls.enableDamping = true;

        window.addEventListener( 'resize', onWindowResize );

        // mouse down, move로 객체를 선택한다.
        container.addEventListener('mousedown', onDocumentMouseDown, false);
        //container.addEventListener('mousemove', onDocumentMouseMove, false);
        //container.addEventListener('pointerdown', onPointerDown);


        stats = new Stats();
        container.appendChild( stats.dom );

        //console.log(scene.children);

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

function onDocumentMouseDown(event) {
    // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.
    let vector = new THREE.Vector3(( (event.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth ) * 2 - 1, -( (event.clientY-renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);

    let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    let intersects = raycaster.intersectObjects(loadedObject);

    if (intersects.length > 0) {

        console.log('onDocumentMouseDown', intersects[0]);

        if( intersects[0].object.visible  ) {
            // 이미 선택되었던 객체이면 원상 복귀(불투명)
            intersects[0].object.visible = false;
        } else {
            // 선택된 객체를 투명하게 한다. 
            intersects[0].object.visible  = true; 
        }                
 
    }
}

function onDocumentMouseMove(event) {
    // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.

    if ( true ) {
        let vector = new THREE.Vector3(( (event.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth ) * 2 - 1, -( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight ) * 2 + 1, 0.5);
        vector = vector.unproject(camera);
        //console.log(vector);

        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObjects(loadedObject);


        if (intersects.length > 0) {
            console.log(intersects[0]);

            let points = [];
            points.push(new THREE.Vector3(0, 0, 20));
            points.push(intersects[0].point);

            let mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
            let tubeGeometry = new THREE.TubeGeometry(new THREE.SplineCurve(points), 60, 0.001);

            if (tube) scene.remove(tube);

            if (true) {
                tube = new THREE.Mesh(tubeGeometry, mat);
                scene.add(tube);
            }
        }
    }
}

function onPointerDown(event) {
    // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.
    let vector = new THREE.Vector3(( (event.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth ) * 2 - 1, -( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);

    //console.log('onPointerDown', event.clientX, event.clientY, renderer.domElement.clientWidth, renderer.domElement.clientHeight, vector);

    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    const intersects = raycaster.intersectObjects( loadedObject );
    if ( intersects.length > 0 ) {
        const object = intersects[ 0 ].object;
        object.material.color.set(0xff4500);
/*
        if( bRed  ) {
            // 이미 선택되었던 객체이면 원상 복귀(불투명)
            object.visible = false;
        } else {
            // 선택된 객체를 투명하게 한다. 
            object.visible  = true; 
        }   
*/
    }
}


function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();

    if ( mixer ) mixer.update( delta );

    controls.update();
    stats.update();

    renderer.render( scene, camera );
};

export default Viewer;