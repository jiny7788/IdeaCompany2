import { useEffect } from 'react';
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

import { Content } from './Content';

let camera, scene, renderer, stats, loadedObject, actions, orbit, control;
const clock = new THREE.Clock();
let mixer = null;

const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2();  // create once
const moveMouse = new THREE.Vector2();   // create once 
let draggable = null;
let curMouseOver = null;
const content = new Content();
let emoteFolder = null;


function Viewer() {

    useEffect(() => {
        const container = document.getElementById('viewer');

        //const content = new Content();
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

        camera = new THREE.PerspectiveCamera( 30, container.clientWidth / container.clientHeight, 0.1, 1500 );
		camera.position.set(-35, 70, 100);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        scene.background = new THREE.Color( 0xa0a0a0 );
		//scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        // ambient light
        let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
        scene.add(hemiLight);

        //Add directional light
        /*
        let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(-35, 70, 100);
        scene.add(dirLight);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.left = -70;
        dirLight.shadow.camera.right = 70;
        dirLight.shadow.camera.top = 70;
        dirLight.shadow.camera.bottom = -70;
        */
        
        let blockPlane = createFloor();
        //createBox();

        // Add Spot light
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-35, 120, 100);
        spotLight.lookAt(blockPlane);
        spotLight.castShadow = false;
        scene.add(spotLight);
        
        var axes = new THREE.AxisHelper(100);
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
        content.loader.loadFile('models/fbx/Samba Dancing.fbx');
        //content.loader.loadFile('models/gltf/LittlestTokyo.glb');
        //content.loader.loadFile('models/gltf/LeePerrySmith/LeePerrySmith.glb');
        content.loader.loadFile('models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf');
        //content.loader.loadFile('models/gltf/Soldier.glb');        
        content.loader.loadFile('models/gltf/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf'); 
        //content.loader.loadFile('models/ifc/rac_advanced_sample_project.ifc');     
        //content.loader.loadFile('models/ifc/29101001_IFCR2_Geo_Beams_1.ifc');
        //content.loader.loadFile('models/gltf/sumits_cctv.glb');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 001.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 002.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 003.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 004.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 005.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 006.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 007.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 008.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 009.fbx');
        //content.loader.loadFile('models/fbx/regidential/Residential Buildings 010.fbx');
        //content.loader.loadFile('models/fbx/building/building.fbx');
        //content.loader.loadFile('models/fbx/dragon/Dragon_Baked_Actions_fbx_7.4_binary.fbx');
        //content.loader.loadFile('models/gltf/DamagedHelmet.zip');
        
        // 허진경책임 작성
        //content.loader.loadFile('models/test/cctv_fbx.fbx');
        content.loader.loadFile('models/test/cctv_render_camera.gltf');     // 이게 가장 좋음
        //content.loader.loadFile('models/test/cctv_render_camera_척도.gltf');
        //content.loader.loadFile('models/test/cctv_척도.gltf');
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.shadowMap.enabled = true;
        container.appendChild( renderer.domElement );

        orbit = new OrbitControls( camera, renderer.domElement );
        // orbit.target.set( 0, 0, 0 );
        orbit.update();
        // orbit.enablePan = true;
        // orbit.enableDamping = true;

        // Events 등록
        window.addEventListener( 'resize', onWindowResize );
        //container.addEventListener('mousedown', onDocumentMouseDown, false);
        //container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('click', onClick);
        container.addEventListener('mousemove', onMoveMouse);
        container.addEventListener('dblclick', onDblClick);

        stats = new Stats();
        container.appendChild(stats.dom);
        
        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;     
        

        animate();

    }, []);

    return (
        <div id="viewer" style={{ width: '100%', height: '100%', border: '1px solid blue' }} />
    );
}


function createFloor() {
    let pos = { x: 0, y: -1, z: 3 };
    let scale = { x: 200, y: 1, z: 200 };
  
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xf9c834 }));  //0xf9c834
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    //blockPlane.visible = false;
    blockPlane.castShadow = false;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);
  
    blockPlane.userData.ground = true

    // 객체 array에 추가해 준다. 그래야 intersect 가능하다.
    loadedObject.push(blockPlane);

    return blockPlane;
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

        //console.log('onDocumentMouseDown', intersects[0]);

        if( intersects[0].object.visible  ) {
            // 이미 선택되었던 객체이면 원상 복귀(불투명)
            intersects[0].object.visible = false;
        } else {
            // 선택된 객체를 투명하게 한다. 
            intersects[0].object.visible  = true; 
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
    if (intersects.length > 0) {
        if (!intersects[0].object.userData.ground) {
            const object = intersects[ 0 ].object;
            object.material.color.set(0xff4500);
        }
    }
}

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects( scene.children );
}

function onClick(event) {
    if (draggable != null) {
        //console.log(`dropping draggable ${draggable.userData.name}`)
        //console.log('new position:', draggable.position);

        // 원래의 색깔로 되돌린다.
        try {
            draggable.traverse( function ( object ) {
                if (object.isMesh && object.userData.oldColor) {
                    object.material.color.set(object.userData.oldColor);
                }
            });
        } catch (e) {
            //console.log(e);
        }        

        draggable = null
        return;
      }
    
    // THREE RAYCASTER
    clickMouse.x = ( (event.clientX - renderer.domElement.getBoundingClientRect().left ) / renderer.domElement.width) * 2 - 1;
    clickMouse.y = -( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.height) * 2 + 1;

    const found = intersect(clickMouse);
    if (found.length > 0) {
        if (!found[0].object.userData.ground && found[0].object.type !== 'AxesHelper')
        {
            draggable = found[0].object;
            //console.log(`found draggable ${draggable.userData.name} ${draggable.userData.draggable}`);
            //console.log(draggable);

            // 부모가 있으면 최대한 찾아간다. scene의 uuid가 parent인 것까지 찾아간다. 
            let parentObject = draggable;
            //console.log(scene.uuid);
            while (parentObject.parent) {
                if (parentObject.parent.uuid === scene.uuid) {
                    //console.log("parent founded ", parentObject.userData.name, parentObject.userData.draggable, parentObject.position);
                    
                    // 선택된 객체를 최상위 객체로 변경한다.
                    draggable = parentObject;
                    
                    break;
                } else {
                    parentObject = parentObject.parent;
                 }
            }

            // 선택된 객체의 색깔을 빨갛게 바꾼다. 
            try {
                draggable.traverse(function (object) {
                    if (object.isMesh) {
                        //console.log(object);
                        object.userData.oldColor = object.material.color.getHex();
                        object.material.color.set(0xff0000);
                    }
                });
            } catch (e) {
                //console.log(e);
            }
           

        }
    }
}

function onMoveMouse(event) {
    moveMouse.x = ( (event.clientX - renderer.domElement.getBoundingClientRect().left ) / renderer.domElement.width) * 2 - 1;
    moveMouse.y = -((event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.height) * 2 + 1;
    
    // 마우스가 POI 객체 위로 올라가면 pointer로 변경된다.
    const found = intersect(moveMouse);
    const container = document.getElementById('viewer');        
    if (found.length > 0) {
        if (!found[0].object.userData.ground && found[0].object.type !== 'AxesHelper')
        {
            container.style.cursor = 'pointer';
            
            // 여기서 툴팁 띄우도록 호출해주면 됨
            let parentObject = found[0].object;
            while (parentObject.parent) {
                if (parentObject.parent.uuid === scene.uuid) {
                    // 선택된 객체를 최상위 객체로 변경한다.
                    parentObject = parentObject;
                    break;
                } else {
                    parentObject = parentObject.parent;
                 }
            }
            if (curMouseOver !== parentObject) {
                //? 여기서 mouseOver event 함수 호출해 주면 된다.
                console.log(`Mouse on AssetsId(${parentObject.userData.name})`);
                curMouseOver = parentObject;
            }
            
        }  
        else {
            container.style.cursor = 'default';
            curMouseOver = null;
        }
    } else {
        container.style.cursor = 'default';
        curMouseOver = null;
    }
}

function dragObject() {
    if (draggable != null) {
        const found = intersect(moveMouse);
        if (found.length > 0) {
          for (let i = 0; i < found.length; i++) {
            if (!found[i].object.userData.ground) continue;
            
              
            let target = found[i].point;  
            draggable.position.x = target.x;
            draggable.position.z = target.z;    
                    
            // console.log('dragObject:', draggable.position);            
          }
        }
    }

    // if (draggable != null) {
    //     var vector = new THREE.Vector3();
    //     vector.set(moveMouse.x, moveMouse.y, 0.5 );
    //     vector.unproject(camera);
    //     // var dir = moveMouse.sub( camera.position ).normalize();
    //     // var distance = - camera.position.z / dir.z;
    //     // var pos = new THREE.Vector3();
    //     // pos.copy( camera.position ).add( dir.multiplyScalar( distance ) );
        
    //     // draggable.position.x = pos.x;
    //     // draggable.position.z = pos.z;

    //     draggable.position.x = vector.x;
    //     draggable.position.y = vector.y;

    // }
}


function onDblClick(event) {
    // THREE RAYCASTER
    clickMouse.x = ( (event.clientX - renderer.domElement.getBoundingClientRect().left ) / renderer.domElement.width) * 2 - 1;
    clickMouse.y = -( (event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.height) * 2 + 1;

    const found = intersect(clickMouse);
    if (found.length > 0) {
        if (!found[0].object.userData.ground && found[0].object.type !== 'AxesHelper')
        {
            // 부모가 있으면 최대한 찾아간다. scene의 uuid가 parent인 것까지 찾아간다. 
            let parentObject = found[0].object;
            while (parentObject.parent) {
                if (parentObject.parent.uuid === scene.uuid) {
                    // 선택된 객체를 최상위 객체로 변경한다.
                    draggable = parentObject;
                    
                    break;
                } else {
                    parentObject = parentObject.parent;
                 }
            }

            // 더블 클릭한 객체의 정보를 GUI에 추가한다.
            console.log('Double Click', parentObject.userData.name);
            if (parentObject.animations.length > 0) {
                actions = {};

                for ( let i = 0; i < parentObject.animations.length; i ++ ) {

					const clip = parentObject.animations[ i ];
					const action = mixer.clipAction( clip );
					actions[ clip.name ] = action;

                    // 일단 한번만 움직이도록 한다
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                }

                if (emoteFolder) {
                    emoteFolder.destroy();
                    emoteFolder = null;
                }

                emoteFolder = content.panel.addFolder('Actions');

                const api = {  };
                
                function createEmoteCallback( name ) {
                    api[name] = function () {		
                        fadeToAction(name, 0.2);

                        // 애니메이션이 끝나면 뭔가 하려면 EventListener를 추가한다. 
						//mixer.addEventListener( 'finished', restoreState );
					};
                    emoteFolder.add(api, name);
                }
                
                // 애니메이션이 끝나면 호출되는 event 함수
                // function restoreState() {
                //     // 애니메이션이 끝나면 받는 EventListener를 삭제한다. 
                //     mixer.removeEventListener('finished', restoreState);
                // }
                
                // 버튼들을 추가해 준다.
                for ( let i = 0; i < parentObject.animations.length; i ++ ) {
					createEmoteCallback( parentObject.animations[i].name );
				}

                emoteFolder.open();
            }
            //content.panel

        }
    }
}

function fadeToAction(name, duration) {
    
    const activeAction = actions[name];
    
    activeAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();

}

function animate() {
    requestAnimationFrame(animate);
    
    // animation이 있으면 업데이트 한다. 
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta); 
    
    // 알람을 표시한다.
    if (draggable != null) {
        let divied = parseInt(clock.getElapsedTime()) % 2;  // 1초에 한번씩 깜빡.
        //console.log(divied);
        try {
            draggable.traverse(function (object) {
                if (object.isMesh) {
                    if (divied > 0 && !object.userData.oldColor) {
                        object.userData.oldColor = object.material.color.getHex();
                        object.material.color.set(0xff0000);
                    } else if(divied === 0) {
                        object.material.color.set(object.userData.oldColor);
                        object.userData.oldColor = null;
                    }                    
                }
            });
        } catch (e) {
            //console.log(e);
        }
    }    

    //orbit.update();
    stats.update();

    // Object drag 이동 (편집모드에서만 동작하게 하면 됨)
    dragObject()

    renderer.render( scene, camera );
};

function render1() {
    renderer.render( scene, camera );
}

export default Viewer;