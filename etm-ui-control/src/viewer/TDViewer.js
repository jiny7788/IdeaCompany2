import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

import { tdCommon } from './TDCommon';
import { Content } from './Content';


class TDViewer  {

    constructor(props) {
        //console.log(props);

        this.canvas = props.canvas;
        this.emapInfo = props.emapInfo;
        this.editMode = props.editMode;
        this.onMouseOver = props.onMouseOver;
        this.onChange = props.onChange;
        this.onClick = props.onClick;

        this.alarmLight = false;        // 알람 깜빡이 상태
        this.alarmList = [];            // 알람이 발생한 자산 리스트
        this.curObject = null;          // 현재 선택된 객체
        this.curMouseOver = null;       // 현재 mouse가 올라가 있는 객체

        this.panel = null;              // control panel

        // Content 생성
        this.content = new Content(this);

        // Scene backgroud color 설정
        tdCommon.scene.background = new THREE.Color( 0xa0a0a0 );

        // Camera 생성
        this.camera = new THREE.PerspectiveCamera(50, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1500);
        this.camera.position.set(0, 120, 120);

        // 바닥면 생성
        const blockPlane = this.createFloor();

        // Light 생성
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.20);
        
        const spotLight = new THREE.SpotLight(0xfcfcfc, 0.7);
        spotLight.position.set(-200, 200, 200);
        spotLight.lookAt(blockPlane);
        spotLight.castShadow = false;

        const spotLight2 = new THREE.SpotLight(0xfcfcfc, 0.7);
        spotLight2.position.set(200, 200, -200);
        spotLight2.lookAt(blockPlane);
        spotLight2.castShadow = false;

        tdCommon.scene.add(ambientLight, spotLight, spotLight2);

        // Camera에도 Light를 하나 달아 준다.
        const cameraLight = new THREE.DirectionalLight('white', 1);
	    cameraLight.position.set(0, 120, 120);
        this.camera.add(cameraLight);

        // 안내축 생성
        this.axes = new THREE.AxesHelper(100);
        tdCommon.scene.add(this.axes);
        this.axes.visible = this.editMode;

        // Renderer 생성
        this.renderer = new THREE.WebGLRenderer({
//            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight );
        this.renderer.setPixelRatio( window.devicePixelRatio > 1 ? 2 : 1);       // !!!고해상도로 출력할 수 있게 한다. 
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.canvas.appendChild(this.renderer.domElement);
        
        // Orbit Control 생성
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.update();
        this.orbitControls.addEventListener('change', this.draw);

        // Transfrom Control 생성
        this.transfromControls = new TransformControls( this.camera, this.renderer.domElement );
        this.transfromControls.addEventListener( 'change', this.draw );
        this.transfromControls.addEventListener('dragging-changed', event => {
            // 객체 드래그 중에는 orbit control 동작하지 않도록 설정
            this.orbitControls.enabled = ! event.value;
        });
        this.transfromControls.addEventListener( 'objectChange', this.onObjectChange);
        tdCommon.scene.add(this.transfromControls);    

        // Events 등록
        window.addEventListener( 'resize', this.onWindowResize );
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        this.canvas.addEventListener('pointerdown', this.onPointerDown);
        this.canvas.addEventListener('mousemove', this.onMoveMouse);            // Tooltip 표시를 위해서...
        this.canvas.addEventListener('click', this.onMouseClick);                 // Click 이벤트 전달용

        // 초기 rending 수행
        this.draw();

        // 알람 자산 깜빡임 처리를 위한 timer 설정
        this.timer = setInterval(this.myTimer, 1000);        

        // 3D Map Load - emapInfo가 있을 경우에만 Load한다.
        if (!(this.emapInfo.constructor === Object && Object.keys(this.emapInfo).length === 0))
            this.content.LoadData();
    }

    // rendering 수행
    draw = () => {
        //console.log('draw!!!');
        this.renderer.render(tdCommon.scene, this.camera);
    };

    createFloor = () => {
        const pos = { x: 0, y: -1, z: 3 };
        const scale = { x: 200, y: 1, z: 200 };
      
        const blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xf9c834 }));  //0xf9c834
        blockPlane.position.set(pos.x, pos.y, pos.z);
        blockPlane.scale.set(scale.x, scale.y, scale.z);
        //blockPlane.visible = false;
        blockPlane.castShadow = false;
        blockPlane.receiveShadow = true;
        tdCommon.scene.add(blockPlane);
        blockPlane.userData.ground = true
    
        return blockPlane;
    };

    myTimer = () => {
        //console.log('timer callled...');
        // 여기서 깜빡임 처리 할 것임
        this.alarmLight = ! this.alarmLight;

        this.content.loadedObject.forEach( (alarmObject) => {
            if( this.alarmList.findIndex( (item) => item === alarmObject.userData.assetsId ) >= 0)  
            {   // 알람 자산을 찾으면...
                this.Light(alarmObject, this.alarmLight);
            }

        });

        this.draw();
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
                this.draw();
            } else {
                //console.log('Light Off');
                selObject.traverse( function ( object ) {
                    if (object.isMesh && object.userData.oldColor) {
                        object.material.color.set(object.userData.oldColor);
                    }
                });
                this.draw();
            }
            
        } catch (e) {
            //console.log(e);
        }
    }

    setSelect = (object) => {
        // 선택된 객체를 최상위 객체로 변경한다.
        if (this.curObject !== object) {
            // 기존꺼는 해제한다. 
            if (this.curObject) this.transfromControls.detach();

            this.transfromControls.attach(object);
            this.curObject = object;

            // 선택된 객체의 색깔을 녹색으로 바꾼다. 
            try {
                this.curObject.traverse(function (object) {
                    if (object.isMesh) {
                        if(!object.userData.oldColor)   // 기존에 저장된 값이 없으면 저장한다.
                            object.userData.oldColor = object.material.color.getHex();
                        object.material.color.set(0x00ff00);
                    }
                });
                this.draw();
            } catch (e) {
                //console.log(e);
            }

            this.draw();
        }
    }

    clearSelect = () => {
        if (this.curObject) {
            this.transfromControls.detach();

            // 원래의 색깔로 되돌린다.
            try {
                this.curObject.traverse(function (object) {
                    if (object.isMesh && object.userData.oldColor) {
                        object.material.color.set(object.userData.oldColor);
                    }
                });
                this.draw();
            } catch (e) {
                //console.log(e);
            }

            this.curObject = null;
            this.draw();
        }
    }

    // Events 함수들 ===================================================================
    // 객체에 변화가 생겼을 때 발생하는 이벤트 => 등록된 이벤트 함수를 수행한다. 
    onObjectChange= (event) => {
        this.onChange({
            assetsId: event.target.object.userData.assetsId,
            assetsName: event.target.object.userData.assetsName,
            position: event.target.object.position,
            scale: event.target.object.scale,
            rotation: event.target.object.rotation
        });
    };

    onWindowResize = () => {

        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();    
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.draw();
    };
   
    onKeyDown = (event) => {
        //console.log('onKeyDown', event.keyCode);

        switch (event.keyCode) {

            case 81: // Q
            this.transfromControls.setSpace(this.transfromControls.space === 'local' ? 'world' : 'local');
                break;
            
            case 85: // U
                this.editMode = !this.editMode;

                if (!this.editMode) {    // 에디터 모드가 끝나면 선택된 객체를 해제한다.
                    this.clearSelect();
                    this.axes.visible = false;
                    this.draw();

                } else {
                    this.axes.visible = true;
                    this.draw();
                }
                break;                

            case 16: // Shift
                this.transfromControls.setTranslationSnap(100);
                this.transfromControls.setRotationSnap(THREE.MathUtils.degToRad(15));
                this.transfromControls.setScaleSnap(0.25);
                break;

            case 87: // W
                this.transfromControls.setMode('translate');
                break;

            case 69: // E
                this.transfromControls.setMode('rotate');
                break;

            case 82: // R
                this.transfromControls.setMode('scale');
                break;
            
            case 83: // S   // 테스트용으로 저장 데이터 가져온다.
                this.content.StoreData();                
                break;
            
            case 76: // L  // 데이터를 Loading 한다.
                this.content.LoadData();
                break;

            case 187:
            case 107: // +, =, num+
                this.transfromControls.setSize(this.transfromControls.size + 0.1);
                break;

            case 189:
            case 109: // -, _, num-
                this.transfromControls.setSize(Math.max(this.transfromControls.size - 0.1, 0.1));
                break;

            case 88: // X
                this.transfromControls.showX = !this.transfromControls.showX;
                break;

            case 89: // Y
                this.transfromControls.showY = !this.transfromControls.showY;
                break;

            case 90: // Z
                this.transfromControls.showZ = !this.transfromControls.showZ;
                break;

            case 27: // Esc
                this.clearSelect();
                break;
        }
    };

    onKeyUp = (event) => {
        switch ( event.keyCode ) {
            case 16: // Shift
                this.transfromControls.setTranslationSnap( null );
                this.transfromControls.setRotationSnap( null );
                this.transfromControls.setScaleSnap( null );
                break;
        }
    }

    onPointerDown = (event) => {
        // 편집모드가 아니면 return
        if (!this.editMode) return;

        // 이미 선택된 객체가 있으면 넘긴다.
        if(this.curObject) return;
            
        // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.
        let vector = new THREE.Vector3(
            ((event.clientX - this.renderer.domElement.getBoundingClientRect().left) / this.renderer.domElement.clientWidth) * 2 - 1,
            -((event.clientY - this.renderer.domElement.getBoundingClientRect().top) / this.renderer.domElement.clientHeight) * 2 + 1,
            0.5);
        vector = vector.unproject(this.camera);
    
        const raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        const intersects = raycaster.intersectObjects(this.content.loadedObject);
        if (intersects.length > 0) {
            if (!intersects[0].object.userData.ground) {
                let object = intersects[0].object;
    
                // 부모가 있으면 최대한 찾아간다. scene의 uuid가 parent인 것까지 찾아간다. 
                let parentObject = object;
                //console.log(scene.uuid);
                while (parentObject.parent) {
                    if (parentObject.parent.uuid === tdCommon.scene.uuid) {
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
        let vector = new THREE.Vector3(
            ((event.clientX - this.renderer.domElement.getBoundingClientRect().left) / this.renderer.domElement.clientWidth) * 2 - 1,
            -((event.clientY - this.renderer.domElement.getBoundingClientRect().top) / this.renderer.domElement.clientHeight) * 2 + 1,
            0.5);
        vector = vector.unproject(this.camera);
    
        const raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        const intersects = raycaster.intersectObjects(this.content.loadedObject);
        if (intersects.length > 0) {
            if (!intersects[0].object.userData.ground) {
                if (this.editMode)      // Edit 모드인 경우에는 Map 객체에 마우스가 가도 pointer로 변경한다. 
                    this.canvas.style.cursor = 'pointer';

                // 여기서 툴팁 띄우도록 호출해주면 됨
                let parentObject = intersects[0].object;
                while (parentObject.parent) {
                    if (parentObject.parent.uuid === tdCommon.scene.uuid) {
                        // 선택된 객체를 최상위 객체로 변경한다.
                        //parentObject = parentObject;
                        break;
                    } else {
                        parentObject = parentObject.parent;
                    }
                }
                if (this.curMouseOver !== parentObject && parentObject.userData.type === 'Asset') {     // Asset인 경우만 tooltip 뜨도록 수정
                    this.canvas.style.cursor = 'pointer';

                    // 새로운 객체를 선택한다.
                    this.curMouseOver = parentObject;

                    // mouseOver event 함수 호출
                    this.onMouseOver(event, this.curMouseOver.userData);                    
                }
                
            }
            else {
                this.canvas.style.cursor = 'default';
                this.curMouseOver = null;
            }
        } else {
            this.canvas.style.cursor = 'default';
            this.curMouseOver = null;
        }
    };

    onMouseClick = (event) => {
        // !!!! 중요 !!!! 실제 그려지는 박스의 최상단 좌측의 좌표를 기준으로 계산해야 한다.
        let vector = new THREE.Vector3(
            ((event.clientX - this.renderer.domElement.getBoundingClientRect().left) / this.renderer.domElement.clientWidth) * 2 - 1,
            -((event.clientY - this.renderer.domElement.getBoundingClientRect().top) / this.renderer.domElement.clientHeight) * 2 + 1,
            0.5);
        vector = vector.unproject(this.camera);
    
        const raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        const intersects = raycaster.intersectObjects(this.content.loadedObject);

        if (intersects.length > 0) {
            if (!intersects[0].object.userData.ground) {

                // 여기서 툴팁 띄우도록 호출해주면 됨
                let parentObject = intersects[0].object;
                while (parentObject.parent) {
                    if (parentObject.parent.uuid === tdCommon.scene.uuid) {
                        // 선택된 객체를 최상위 객체로 변경한다.
                        //parentObject = parentObject;
                        break;
                    } else {
                        parentObject = parentObject.parent;
                    }
                }

                // onClick event 함수 호출
                if (parentObject.userData.type === 'Asset')         // Asset인 경우만 click event 발생 시킨다.
                    this.onClick(event, parentObject.userData);                
            }
        } 
    };

    // 외부 제공 API들
    addAlarm = (assetsId) => {  // 알람 자산을 등록한다. 
        if (!assetsId && assetsId === '') return;

        this.alarmList = this.alarmList.concat(assetsId);

        // 카메라를 알람자산을 바라 보도록 이동시킨다. 
        this.content.loadedObject.forEach((object) => {
            if (object.userData.assetsId === assetsId) {       
                
                let pos = this.detectBlocked(object);       // 카메라의 위치를 잡는다.
                //console.log(`retPos:${pos.x},${pos.y},${pos.z}`);

                this.camera.position.x = pos.x;
                this.camera.position.y = pos.y;
                this.camera.position.z = pos.z;
                this.camera.lookAt(object.position); 

                this.orbitControls.update();        // 알람 자산으로 카메라 이동후 컨트롤 업데이트

                this.draw();
            }
        });
    };

    detectBlocked = (object) => {
        let retPos = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);     // 카메라 위치
        let vector = new THREE.Vector3(object.position.x, object.position.y, object.position.z);

        // 위치 이동
        retPos.x = vector.x;
        retPos.y = vector.y + 50;
        retPos.z = vector.z + 100;

        // const material = new THREE.LineBasicMaterial({ color: 0x00ffff });
        // const points = [];
        // points.push( retPos );
        // points.push( vector );                
        // const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // const line = new THREE.Line(geometry, material);
        // tdCommon.scene.add(line);        
    
        const raycaster = new THREE.Raycaster(retPos, vector.sub(retPos).normalize());
        const intersects = raycaster.intersectObjects(this.content.loadedObject);

        if (intersects.length > 0)  {
            if (!intersects[0].object.userData.ground) {
                let parentObject = intersects[0].object;
                while (parentObject.parent) {
                    if (parentObject.parent.uuid === tdCommon.scene.uuid) {
                        // 선택된 객체를 최상위 객체로 변경한다.
                        //parentObject = parentObject;
                        break;
                    } else {
                        parentObject = parentObject.parent;
                    }
                }

                // console.log(parentObject.userData);   
                if (parentObject.userData.assetsId !== object.userData.assetsId) {
                    // console.log('앞이 막혀 있어 뒤집는다....');
                    // 일단은 단순하게 막혀 있으면 뒤집기만 한다. 뒤집었는데도 막힌 경우 처리 등 고급 처리는 좀 더 고민 필요....
                    retPos.z = vector.z - 100;
                }                         
            }
        }

        return retPos;
    };

    removeAlarm = (assetsId) => {   // 알람 자산을 삭제한다. 
        if (!assetsId && assetsId === '') return;

        this.content.loadedObject.forEach((object) => {
            if (object.userData.assetsId === assetsId)
                this.Light(object, false);
        });

        // 알람자산 리스트에서 제거한다.
        this.alarmList = this.alarmList.filter((item) => (item !== assetsId));
    };

    changeObject = ( objectInfo ) => {  // 자산을 이동, 확대, 회전시킬때 호출한다. 

    };

    addMap = (mapInfo) => {    // Map 파일을 추가한다.
        if (!(mapInfo.constructor === Object && Object.keys(mapInfo).length === 0)) {
            this.content.addMap(mapInfo);
        }
    };

    removeMap = (mapInfo) => { // Map 파일을 삭제한다.
        if (!(mapInfo.constructor === Object && Object.keys(mapInfo).length === 0)) {
            //현대 해당 Map이 선택상태라면 선택해제한다.
            if (this.curObject && this.curObject.userData && this.curObject.userData.assetsId === mapInfo.assetsId)
                this.clearSelect();

                this.content.delMap(mapInfo);
        }
    };

    addAsset = (assetsInfo) => {  // Asset을 추가한다.
        if ( ! (assetsInfo.constructor === Object && Object.keys(assetsInfo).length === 0) ) {
            // 추가한다. 
            this.content.addAsset(assetsInfo);            
        }
    };

    removeAsset = ( assetsInfo ) => {   // Asset을 삭제한다. 
        if ( ! (assetsInfo.constructor === Object && Object.keys(assetsInfo).length === 0) ) {
            // 현재 해당 자산이 선택상태라면 선택해제한다.
            if (this.curObject && this.curObject.userData && this.curObject.userData.assetsId === assetsInfo.assetsId)
                this.clearSelect();
            
            this.content.delAsset(assetsInfo);
        }
    };

    saveMap = () => {   // Map을 저장한다. 서버에 업로드.
        this.content.StoreData();
    };

    removeAll = () => { // Load된 모든 객체를 삭제한다. 
        // 선택 해제 한다. 
        this.clearSelect();
        this.content.removeAll();
    }

    loadMap = (emapInfo) => {   // Map을 Load 한다. 
        this.removeAll();
        this.emapInfo = emapInfo;
        this.content.LoadData();
    };
   
}

export default TDViewer;