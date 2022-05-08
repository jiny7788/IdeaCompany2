import React from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { Content } from './Content';

import { connect  } from "react-redux";

let camera, scene, renderer, panel, orbit, control, axes;
let curObject = null;       // 현재 선택된 객체
let curMouseOver = null;    // 현재 mouse가 올라가 있는 객체
let editMode = false;       // 편집 모드 
let timer = null;
let alarmLight = false;
let alarmList = [];
let content = null;

class TDViewer extends React.Component {

    constructor(props) {
        super(props);

        this.onMouseOver = props.onMouseOver;
        this.onChange = props.onChange;
        this.onClick = props.onClick;
        this.emapInfo = props.emapInfo;
        editMode = props.editMode;
        
        //console.log(`EditMode : ${editMode}`);

        this.state = {
            viewerid: this.props.viewerid
        };
    }

    componentDidMount() {
        const container = document.getElementById(this.state.viewerid);        

        // timer 설정
        timer = setInterval(this.myTimer, 1000);
        
        //const content = new Content(this);
        content = new Content(this);
        scene = content.scene;
        renderer = content.renderer;

        camera = new THREE.PerspectiveCamera( 50, container.clientWidth / container.clientHeight, 0.1, 1500 );
        camera.position.set(0, 120, 120);
        //camera.rotation.set(-0.45, 0, 0, 'XYZ');
        //camera.lookAt(new THREE.Vector3(0, 0, 0));
        //console.log(camera);

        scene.background = new THREE.Color( 0xa0a0a0 );
		//scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        // ambient light
        let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
        scene.add(hemiLight);

        let blockPlane = this.createFloor();

        // Add Spot light
        let spotLight = new THREE.SpotLight(0xfcfcfc);
        spotLight.position.set(-200, 200, 200);
        spotLight.lookAt(blockPlane);
        spotLight.castShadow = false;
        scene.add(spotLight);

        let spotLight2 = new THREE.SpotLight(0xfcfcfc);
        spotLight2.position.set(200, 200, -200);
        spotLight2.lookAt(blockPlane);
        spotLight2.castShadow = false;
        scene.add(spotLight2);
        
        axes = new THREE.AxesHelper(100);
        scene.add(axes);
        axes.visible = editMode;

        //const helper = new THREE.CameraHelper( camera );
        //scene.add( helper );


        // 여기서 model을 load한다. 
        //content.loader.loadFile('models/fbx/Samba Dancing.fbx');
        //content.loader.loadFile('models/gltf/LittlestTokyo.glb');
        //content.loader.loadFile('models/gltf/LeePerrySmith/LeePerrySmith.glb');
        //content.loader.loadFile('models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf');
        //content.loader.loadFile('models/gltf/Soldier.glb');        
        //content.loader.loadFile('models/gltf/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf'); 
        //content.loader.loadFile('models/ifc/rac_advanced_sample_project.ifc');     
        //content.loader.loadFile('models/ifc/29101001_IFCR2_Geo_Beams_1.ifc');
        //content.loader.loadFile('models/gltf/sumits_cctv.glb');
        //content.loader.loadFile('samples/regidential/Residential Buildings 001.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 002.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 003.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 004.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 005.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 006.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 007.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 008.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 009.fbx');
        //content.loader.loadFile('samples/regidential/Residential Buildings 010.fbx');
        
        //content.loader.loadFile('samples/48/building.fbx');
        //content.loader.loadFile('samples/96/uploads_files_2720101_BusGameMap.obj');
        //content.loader.loadFile('samples/ResidentialBuildingSet/Residential Buildings 001.fbx');
        //content.loader.loadFile('samples/mnogohome/building.obj');
        
        //content.loader.loadFile('samples/cctv/camera1.obj');
        //content.loader.loadFile('samples/cctv/Security cameras v4.obj');
        //content.loader.loadFile('samples/cctv/Security cameras.obj');

        //content.loader.loadFile('models/fbx/dragon/Dragon_Baked_Actions_fbx_7.4_binary.fbx');
        //content.loader.loadFile('models/gltf/DamagedHelmet.zip');
        
        // 허진경책임 작성
        //content.loader.loadFile('samples/test/cctv_fbx.fbx');
        //content.loader.loadFile('samples/test/cctv_render_camera.gltf');     // 이게 가장 좋음
        //content.loader.loadFile('samples/test/cctv_render_camera.gltf');     // 이게 가장 좋음
        //content.loader.loadFile('samples/test/cctv_render_camera.gltf');     // 이게 가장 좋음
        //content.loader.loadFile('samples/test/cctv_render_camera.gltf');     // 이게 가장 좋음
        //content.loader.loadFile('samples/test/cctv_render_camera_척도.gltf');
        //content.loader.loadFile('samples/test/cctv_척도.gltf');
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( container.clientWidth, container.clientHeight );
        renderer.setPixelRatio( window.devicePixelRatio > 1 ? 2 : 1);       // !!!고해상도로 출력할 수 있게 한다. 
        //renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        //console.log(`container size (${container.clientWidth}, ${container.clientHeight})`);

        // Orbit Control 등록
        orbit = new OrbitControls( camera, renderer.domElement );
        // orbit.target.set( 0, 0, 0 );
        orbit.update();
        // orbit.enablePan = true;
        // orbit.enableDamping = true;
        orbit.addEventListener('change', this.render1);

        // Transfrom Control 등록
        control = new TransformControls( camera, renderer.domElement );
        control.addEventListener( 'change', this.render1 );
        control.addEventListener( 'dragging-changed', function ( event ) {
            orbit.enabled = ! event.value;
        });
        control.addEventListener( 'objectChange', this.onObjectChange);
        scene.add(control);        

        // Events 등록
        window.addEventListener( 'resize', this.onWindowResize );
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        container.addEventListener('pointerdown', this.onPointerDown);
        container.addEventListener('mousemove', this.onMoveMouse);      // Tooltip 표시를 위해서...
        container.addEventListener('click', this.onMouseClick);              // Click 이벤트 전달용

        // create ui panel
        //this.createPanel();

        // 초기에 한번 rendering 해 준다.
        this.render1();

        // 3D Map을 읽어서 표시한다. 
        content.LoadData();
    }

    componentWillUnmount() {
        // timer 종료
        clearInterval(timer);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(this.props.addAssetsId);
        // console.log(this.props.removeAssetsId);
        // console.log(this.props.changeObject);

        // 알람을 추가한다. 
        if (this.props.addAssetsId && this.props.addAssetsId !== '') {
            alarmList = alarmList.concat(this.props.addAssetsId);

            // 카메라를 알람자산을 바라 보도록 이동시킨다. 
            content.loadedObject.forEach((object) => {
                if (object.userData.assetsId === this.props.addAssetsId) {                    
                    camera.position.x = object.position.x + 50;
                    camera.position.y = object.position.y + 50;
                    if (camera.position.z > 0) 
                        camera.position.z = object.position.z + 100;
                    else 
                        camera.position.z = object.position.z - 100;
                    camera.lookAt(object.position);

                    this.render1();
                }
            });
        }
        
        // 알람을 제거한다. 
        if (this.props.removeAssetsId && this.props.removeAssetsId !== '') {
            // Light를 끈다.
            content.loadedObject.forEach((object) => {
                if (object.userData.assetsId === this.props.removeAssetsId)
                    this.Light(object, false);
            });

            // 알람자산 리스트에서 제거한다.
            alarmList = alarmList.filter((item) => (item !== this.props.removeAssetsId));
        }

        // Map을 추가한다. 
        if (!(this.props.addMap.constructor === Object && Object.keys(this.props.addMap).length === 0)) {
            content.addMap(this.props.addMap);
        }

        // Map을 삭제한다. 
        if (!(this.props.removeMap.constructor === Object && Object.keys(this.props.removeMap).length === 0)) {
            //현대 해당 Map이 선택상태라면 선택해제한다.
            if (curObject && curObject.userData && curObject.userData.assetsId === this.props.removeMap.assetsId)
                this.clearSelect();

            content.delMap(this.props.removeMap);
        }

        // POI(자산)을 추가한다. 
        if ( ! (this.props.addAsset.constructor === Object && Object.keys(this.props.addAsset).length === 0) ) {
            // 추가한다. 
            content.addAsset(this.props.addAsset);            
        }

        // POI(자산)을 제거한다. 
        if ( ! (this.props.removeAsset.constructor === Object && Object.keys(this.props.removeAsset).length === 0) ) {
            //현대 해당 자산이 선택상태라면 선택해제한다.
            if (curObject && curObject.userData && curObject.userData.assetsId === this.props.removeAsset.assetsId)
                this.clearSelect();
            
            content.delAsset(this.props.removeAsset);
        }

        // Map을 서버에 저장한다.
        if (this.props.saveMap) {
            content.StoreData();
        }
        
    }

    // 기본 함수
    render() {
        return (
            <>
                <div id="info">
                "W" translate | "E" rotate | "R" scale | "+/-" adjust size<br />
                "Q" toggle world/local space |  "Shift" snap to grid<br />
                "X" toggle X | "Y" toggle Y | "Z" toggle Z <br />
                "Esc" unselect<br />
                </div>
                <div id={this.state.viewerid} style={{ width: '100%', height: '100%', border: '1px solid blue' }} />
            </>
        );
    }    

    // 초기화
    createFloor = () => {
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
    
        return blockPlane;
    };

    myTimer = () => {
        //console.log('timer callled...');
        // 여기서 깜빡임 처리 할 것임
        alarmLight = ! alarmLight;

        content.loadedObject.forEach( (alarmObject) => {
            if( alarmList.findIndex( (item) => item === alarmObject.userData.assetsId ) >= 0)  
            {   // 알람 자산을 찾으면...
                this.Light(alarmObject, alarmLight);
            }

        });

        this.render1();
    }

    Light = (selObject, onoff) => {        
        try {
            if(onoff) 
            {
                //console.log('Light On : ', selObject.userData.name);
                selObject.traverse( function ( object ) {
                    if (object.isMesh) {
                        if(!object.userData.oldColor)   // 기존에 저장된 값이 없으면 저장한다.
                            object.userData.oldColor = object.material.color.getHex();
                        object.material.color.set(0xff0000);
                    }
                });
                this.render1();
            } else {
                //console.log('Light Off');
                selObject.traverse( function ( object ) {
                    if (object.isMesh && object.userData.oldColor) {
                        object.material.color.set(object.userData.oldColor);
                    }
                });
                this.render1();
            }
            
        } catch (e) {
            //console.log(e);
        }
    }

    setSelect = (object) => {
        // 선택된 객체를 최상위 객체로 변경한다.
        if (curObject !== object) {
            // 기존꺼는 해제한다. 
            if (curObject) control.detach();

            control.attach(object);
            curObject = object;

            // 선택된 객체의 색깔을 녹색으로 바꾼다. 
            try {
                curObject.traverse(function (object) {
                    if (object.isMesh) {
                        if(!object.userData.oldColor)   // 기존에 저장된 값이 없으면 저장한다.
                            object.userData.oldColor = object.material.color.getHex();
                        object.material.color.set(0x00ff00);
                    }
                });
                this.render1();
            } catch (e) {
                //console.log(e);
            }

            this.render1();
        }
    }

    clearSelect = () => {
        if (curObject) {
            control.detach();

            // 원래의 색깔로 되돌린다.
            try {
                curObject.traverse(function (object) {
                    if (object.isMesh && object.userData.oldColor) {
                        object.material.color.set(object.userData.oldColor);
                    }
                });
                this.render1();
            } catch (e) {
                //console.log(e);
            }

            curObject = null;
            this.render1();
        }
    }

    createPanel = () => {
                
        panel = new GUI({ width: 200 });

        const actions = ['translate(W)', 'rotate(E)', 'scale(R)'];
        const api = { action: 'translate(W)' };
        const actionFolder = panel.addFolder( 'Actions' );
        const clipCtrl = actionFolder.add( api, 'action' ).options( actions );
        clipCtrl.onChange( function () {
            //console.log(api.action);
            switch (api.action) {
                case 'translate(W)': // W
                    control.setMode('translate');
                break;

                case 'rotate(E)': // E
                    control.setMode('rotate');
                    break;

                case 'scale(R)': // R
                    control.setMode('scale');
                    break;
            }
        } );
        actionFolder.open();

        const stateFolder = panel.addFolder('Toggles'); 
        const propsStates = {
            get 'Editable'() {
                return editMode;
            },
            set 'Editable'( v ) {
                editMode = v;

                if (!editMode) {    // 에디터 모드가 끝나면 선택된 객체를 해제한다.
                    this.clearSelect();
                    
                    axes.visible = false;
                    renderer.render(scene, camera);

                } else {
                    axes.visible = true;
                    renderer.render(scene, camera);
                }

            },
            get 'toggleX'() {
                return control.showX;
            },
            set 'toggleX'( v ) {
                control.showX = v;
            },
            get 'toggleY'() {
                return control.showY;
            },
            set 'toggleY'( v ) {
                control.showY = v;
            },
            get 'toggleZ'() {
                return control.showZ;
            },
            set 'toggleZ'( v ) {
                control.showZ = v;
            },
            get 'toogleSpace'() {
                return control.space === 'world';
            },
            set 'toogleSpace'(v) {
                control.setSpace(control.space = v ? 'world': 'local' );
            }
        };
        stateFolder.add(propsStates, 'Editable');
        stateFolder.add(propsStates, 'toggleX');
        stateFolder.add(propsStates, 'toggleY');
        stateFolder.add(propsStates, 'toggleZ');
        stateFolder.add(propsStates, 'toogleSpace');
        stateFolder.open();

        const cameraPosition = panel.addFolder('Camera Position'); 
        cameraPosition.add(camera.position, 'x', -200, 200, 1);
        cameraPosition.add(camera.position, 'y', -200, 200, 1);
        cameraPosition.add(camera.position, 'z', -200, 200, 1);
        
        const cameraRotation = panel.addFolder('Camera Rotation'); 
        cameraRotation.add(camera.rotation, 'x', -10, 10, 0.01);
        cameraRotation.add(camera.rotation, 'y', -10, 10, 0.01);
        cameraRotation.add(camera.rotation, 'z', -10, 10, 0.01);
    }

    // rendering 함수
    render1 = () => {
        renderer.render(scene, camera);
    };

    // Event 함수
    onWindowResize = () => {
        const container = document.getElementById(this.state.viewerid);            
    
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();    
        renderer.setSize(container.clientWidth, container.clientHeight);

        //console.log(`Resize (${container.clientWidth}, ${container.clientHeight})`);
        
        this.render1();
    };
    
    onKeyDown = (event) => {
        //console.log('onKeyDown', event.keyCode);

        switch (event.keyCode) {

            case 81: // Q
                control.setSpace(control.space === 'local' ? 'world' : 'local');
                break;
            
            case 85: // U
                editMode = !editMode;

                if (!editMode) {    // 에디터 모드가 끝나면 선택된 객체를 해제한다.
                    this.clearSelect();
                    axes.visible = false;
                    renderer.render(scene, camera);

                } else {
                    axes.visible = true;
                    renderer.render(scene, camera);
                }
                break;                

            case 16: // Shift
                control.setTranslationSnap(100);
                control.setRotationSnap(THREE.MathUtils.degToRad(15));
                control.setScaleSnap(0.25);
                break;

            case 87: // W
                control.setMode('translate');
                break;

            case 69: // E
                control.setMode('rotate');
                break;

            case 82: // R
                control.setMode('scale');
                break;
            
            case 83: // S   // 테스트용으로 저장 데이터 가져온다.
                content.StoreData();
                break;
            
            case 76: // L  // 데이터를 Loading 한다.
                content.LoadData();
                break;

            case 187:
            case 107: // +, =, num+
                control.setSize(control.size + 0.1);
                break;

            case 189:
            case 109: // -, _, num-
                control.setSize(Math.max(control.size - 0.1, 0.1));
                break;

            case 88: // X
                control.showX = !control.showX;
                break;

            case 89: // Y
                control.showY = !control.showY;
                break;

            case 90: // Z
                control.showZ = !control.showZ;
                break;

            case 27: // Esc
                //console.log('keydown ESC');
                this.clearSelect();
                break;
        }
    };

    onKeyUp = (event) => {
        switch ( event.keyCode ) {
            case 16: // Shift
                control.setTranslationSnap( null );
                control.setRotationSnap( null );
                control.setScaleSnap( null );
                break;
        }
    }

    onPointerDown = (event) => {
        // 편집모드가 아니면 return
        if (!editMode) return;

        // 이미 선택된 객체가 있으면 넘긴다.
        if(curObject) return;
            
        // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.
        let vector = new THREE.Vector3(((event.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth) * 2 - 1, -((event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);
    
        //console.log('onPointerDown', event.clientX, event.clientY, renderer.domElement.clientWidth, renderer.domElement.clientHeight, vector);
    
        const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        const intersects = raycaster.intersectObjects(content.loadedObject);
        if (intersects.length > 0) {
            if (!intersects[0].object.userData.ground) {
                let object = intersects[0].object;
    
                // 부모가 있으면 최대한 찾아간다. scene의 uuid가 parent인 것까지 찾아간다. 
                let parentObject = object;
                //console.log(scene.uuid);
                while (parentObject.parent) {
                    if (parentObject.parent.uuid === scene.uuid) {
                        //console.log("parent founded ", parentObject.userData.name, parentObject.userData.draggable, parentObject.position);
                        
                        // 선택된 객체를 최상위 객체로 변경한다.
                        this.setSelect(parentObject);
                        
                        break;
                    } else {
                        parentObject = parentObject.parent;
                    }
                }
            }
        }
    };

    onMoveMouse = (event) => {
        // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.
        let vector = new THREE.Vector3(((event.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth) * 2 - 1, -((event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);
    
        //console.log('onPointerDown', event.clientX, event.clientY, renderer.domElement.clientWidth, renderer.domElement.clientHeight, vector);
    
        const container = document.getElementById(this.state.viewerid); 
        const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        const intersects = raycaster.intersectObjects(content.loadedObject);
        if (intersects.length > 0) {
            if (!intersects[0].object.userData.ground) {
                container.style.cursor = 'pointer';
                
                // 여기서 툴팁 띄우도록 호출해주면 됨
                let parentObject = intersects[0].object;
                while (parentObject.parent) {
                    if (parentObject.parent.uuid === scene.uuid) {
                        // 선택된 객체를 최상위 객체로 변경한다.
                        //parentObject = parentObject;
                        break;
                    } else {
                        parentObject = parentObject.parent;
                    }
                }
                if (curMouseOver !== parentObject) {
                    // 새로운 객체를 선택한다.
                    curMouseOver = parentObject;

                    // mouseOver event 함수 호출
                    this.onMouseOver(event, curMouseOver.userData);
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
    };

    onMouseClick = (event) => {
        // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.
        let vector = new THREE.Vector3(((event.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth) * 2 - 1, -((event.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);
    
        const container = document.getElementById(this.state.viewerid);       
        const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        const intersects = raycaster.intersectObjects(content.loadedObject);

        if (intersects.length > 0) {
            if (!intersects[0].object.userData.ground) {

                // 여기서 툴팁 띄우도록 호출해주면 됨
                let parentObject = intersects[0].object;
                while (parentObject.parent) {
                    if (parentObject.parent.uuid === scene.uuid) {
                        // 선택된 객체를 최상위 객체로 변경한다.
                        //parentObject = parentObject;
                        break;
                    } else {
                        parentObject = parentObject.parent;
                    }
                }

                // onClick event 함수 호출
                this.onClick(event, parentObject.userData);                
            }
        } 
    };

    // 객체에 변화가 생겼을 때 발생하는 이벤트
    onObjectChange = (event) => {
        this.onChange({
            assetsId: event.target.object.userData.assetsId,
            position: event.target.object.position,
            scale: event.target.object.scale,
            rotation: event.target.object.rotation
        });
    };
    
}

const mapStateToProps = (state) => ({
    addAssetsId: state.mapchanger.addAssetsId,
    removeAssetsId: state.mapchanger.removeAssetsId,
    changeObject: state.mapchanger.changeObject,
    addMap: state.mapchanger.addMap,
    removeMap: state.mapchanger.removeMap,
    addAsset: state.mapchanger.addAsset,
    removeAsset: state.mapchanger.removeAsset,
    saveMap: state.mapchanger.saveMap
});

export default connect(
    mapStateToProps
)(TDViewer);  
