import {Box3, Vector3} from 'three';
import { Loader } from "./Loader";
import TDLocationApi from "../apis/AlarmApi";

import { tdCommon } from './TDCommon';

function Content(viewer) {

    // init
    this.loader = new Loader(this);
    this.loadedObject = [];    
    this.defaultMap = null;
    this.viewer = viewer;
    
    this.addObject = function (object, position, scale, rotation, bSelect) {

        //? console.log(object);
        // Array에 추가해 준다.
        this.loadedObject.push(object);

        // 그림자를 생성한다. 
        object.traverse( function ( object ) {
            if (object.isMesh) {
                object.castShadow = true;
            }
        });

        // 객체의 크기를 계산한다. (객체를 감싸는 Box를 구하고 대각선 사이의 거리를 구한다.)
        let bbox = new Box3().setFromObject(object);
        let distance = bbox.max.distanceTo(bbox.min);
        //console.log(`모델 크기: (${bbox.min.x}, ${bbox.min.y}, ${bbox.min.z})-(${bbox.max.x}, ${bbox.max.x}, ${bbox.max.x}) : ${distance}`);
        
        // 크기에 맞춰 확대/축소
        let scaleVal = 20.0 / distance;             // 무조건 20 크기가 되게 만든다. 너무 크게 나오거나 작게 나오면 편집할 수가 없다.
        //console.log('비례값', scaleVal);
        object.scale.set(scaleVal, scaleVal, scaleVal);

        // 위치 이동 : 땅 밑으로 가 있는 객체의 경우 땅 바닥에 붙인다. 
        // 위치 이동을 위해 확대/축소된 객체의 좌표를 다시 구한 후 y 좌표를 0으로 맞춘다. 
        bbox = new Box3().setFromObject(object);
        if (bbox.min.y < 0) {  // 땅 밑으로 가 있는 객체만 위로 올린다.
            //console.log('Groud로 이동', scaleVal);
            object.position.y -= bbox.min.y;
        }

        // 위치 이동
        if (position) {
            object.position.x = position.x;
            object.position.y = position.y;
            object.position.z = position.z;
        } else {    // 신규 추가 시 위치는 맵사이즈를 구해와서 적절한데 넣는 로직이 있어야 할 듯...
            object.position.y = 50;
            object.position.z = 100;
        }            

        // 크기 변경
        if (scale) {
            object.scale.x = scale.x;
            object.scale.y = scale.y;
            object.scale.z = scale.z;
        }

        // 회전 변경
        if (rotation) {
            object.rotation.x = rotation._x;
            object.rotation.y = rotation._y;
            object.rotation.z = rotation._z;
            object.rotation.order = rotation._order;
        }

        // bbox = new Box3().setFromObject(object);
        // distance = bbox.max.distanceTo(bbox.min);
        // console.log(`모델 표시 크기: (${bbox.min.x}, ${bbox.min.y}, ${bbox.min.z})-(${bbox.max.x}, ${bbox.max.x}, ${bbox.max.x}) : ${distance}`);

        // scene에 추가해 준다.
        tdCommon.scene.add(object); 

        // 전체 사이즈 계산 & 카메라 이동 (Edit 모드가 아닌 경우만 카메라 이동 시킨다.)
        if (! viewer.editMode)
            this.moveCamera();

		// draw() 호출 : animate로 되어 있지 않은 경우 다시 rendering 하도록 호출해 준다.
        viewer.draw();

        // 신규 추가인 경우 select 상태로 추가해 준다.
        if (bSelect) {
            viewer.clearSelect();
            viewer.setSelect(object);
        }
    };

    this.moveCamera = function () {
        let min = new Vector3();
        let max = new Vector3();
        let bbox = null;

        this.loadedObject.forEach(item => {
            bbox = new Box3().setFromObject(item);
            //console.log(item);

            if (min.x > bbox.min.x || min.x === 0) min.x = bbox.min.x;
            if (min.y > bbox.min.y || min.y === 0) min.y = bbox.min.y;
            if (min.z > bbox.min.z || min.z === 0) min.z = bbox.min.z;

            if (max.x < bbox.max.x) max.x = bbox.max.x;
            if (max.y < bbox.max.y) max.y = bbox.max.y;
            if (max.z < bbox.max.z) max.z = bbox.max.z;            
        });

        let resultBox = new Box3(min, max);
        //console.log(`전체사이즈 : (${min.x}, ${min.y}, ${min.z})-(${max.x}, ${max.y}, ${max.z}) : ${max.distanceTo(min)}`);

        let cameraPos = new Vector3();
        cameraPos.x = Math.round((max.x - min.x) / 2);                                                                               // x위치는 가운데로 잡는다. 
        cameraPos.y = max.y + Math.round(((max.z - min.z) * Math.tan((90 - 25) * Math.PI / 180)) / 2);                               // 카메라의 시야각을 기준으로 tangent로 계산함
        //cameraPos.z = max.z + Math.round(((max.x - min.x) * Math.tan((90 - 25) * Math.PI / 180)) / 2);
        cameraPos.z = Math.round((max.z - min.z) / 2) + Math.round(((max.x - min.x) * Math.tan((90 - 25) * Math.PI / 180)) / 2);     // 카메라의 시야각을 기준으로 tangent로 계산함   
        //console.log(`카메라 위치 계산 : (${cameraPos.x}, ${cameraPos.y}, ${cameraPos.z})`);
       
        // Camera Position 이동
        viewer.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        viewer.camera.lookAt(new Vector3(0,0,0)); 
    };

    this.StoreData = function () {

        const objArrary = [];
        let maps = null;

        // Load된 객체들을 Json String으로 뽑아 낸다. 
        this.loadedObject.forEach((object) => {
            if (object.userData.type === 'Map') {  // Map 데이터 저장
                maps = object;
                //console.log(maps);
            } else {
                const item = {
                    emapMppgSeq: object.userData.emapMppgSeq,
                    typeCode: object.userData.typeCode,
                    assetsId: object.userData.assetsId,
                    assetsName: object.userData.assetsName,
                    mppgEmapId: object.userData.mppgEmapId,
                    iconId: object.userData.iconId,
                    fileSeq: object.userData.fileSeq,
                    fileName: object.userData.fileName,
                    metaData: JSON.stringify({
                        assetsId: object.userData.assetsId,
                        position: object.position,
                        scale: object.scale,
                        rotation: object.rotation
                    })
                };
                
                objArrary.push(item);
            }            
        });

        let userNo = 1;
        const memberInfo = localStorage.getItem('memberInfo');
        if (memberInfo) {
            userNo = JSON.parse(memberInfo).user_no;
            if (userNo == null || userNo == '') {
                userNo = 1;
            }
        }        

        // 3D Map 정보를 설정한다. 
        const mapData = {
             emapId: maps ? maps.userData.emapId : this.defaultMap.emapId,
	         emapVer: maps ? maps.userData.emapVer : this.defaultMap.emapVer,
             fileSeq: maps ? maps.userData.fileSeq : null,                         // maps가 없으면 Map이 로드가 안된 것임
	         userNo: userNo,
             metaData: JSON.stringify({
                assetsId: maps ? maps.userData.emapId : this.defaultMap.emapId,         // Map의 경우 assetsId에 emapId를 가진다.
                position: maps ? maps.position : null,
                scale: maps ? maps.scale : null,
                rotation: maps ? maps.rotation : null
            }),
             mappingList: objArrary
        };

        TDLocationApi.setTDMapMapping(mapData).then(response => {
            //console.log(response);
        });

        console.log('저장 완료!!!');
        //return JSON.stringify(mapData);
    };

    this.LoadData = function () {       // 3D Map Load...

        TDLocationApi.getTDMapDetail(viewer.emapInfo.emapId).then(response => {
            if (response.success) { 
                let objs = JSON.parse(response.result);
                //console.log(objs);

                // 표시할 Map정보를 구해서 Load한다. 
                this.defaultMap = JSON.parse(objs.Map.metaData);
                this.defaultMap.type = 'Map';
                //console.log('Map loaded...');
                //console.log(this.defaultMap);
                if (this.defaultMap.fileSeq && this.defaultMap.fileSeq > 0) 
                    this.loader.loadFile(this.defaultMap);

                // 표시될 자산(POI) 리스트를 구해서 Load한다. 
                const items = objs.AssetsList.map(item => {
                    const obj = JSON.parse(item.metaData);
                    obj.type = 'Asset';
                    return obj;
                });
                //console.log('Assets loaded...');
                //console.log(items);
                items.forEach((object) => {
                    this.loader.loadFile(object);                    
                });
            }
        });

    };

    this.addAsset = function (asset) {
        
        asset.type = 'Asset';

        // 자산을 추가하고 select상태로 변경한다.
        this.loader.loadFile(asset, true);

    }

    this.delAsset = function (asset) {

        // loadedObject 에서 제거
        this.loadedObject = this.loadedObject.filter((item) => {
            //console.log('loadObject 제거 : ' + item.userData.assetsId + ',' + asset.assetsId + ':' + item.userData.assetsId !== asset.assetsId);
            return (item.userData.assetsId !== asset.assetsId);
        });

        let findObj = null;
        tdCommon.scene.traverse((obj) => {
            if (obj.userData.assetsId && obj.userData.assetsId === asset.assetsId) {
                findObj = obj;
            }
        });
        if (findObj) tdCommon.scene.remove(findObj);

        viewer.draw();
    }

    this.addMap = function (map) {
        
        map.type = 'Map';

        // 먼저 기존 Map이 있으면 지운다.
        this.delMap(map);
        
        // Map을 추가한다. 
        this.loader.loadFile(map);
    }

    this.delMap = function (map) {

        // loadedObject 에서 제거
        this.loadedObject = this.loadedObject.filter((item) => {
            return (item.userData.assetsId !== map.assetsId);
        });

        let findObj = null;
        tdCommon.scene.traverse((obj) => {
            //console.log(obj);
            if (obj.userData.assetsId && obj.userData.assetsId === map.assetsId) {
                findObj = obj;
            }
        });
        if (findObj) tdCommon.scene.remove(findObj);

        viewer.draw();
    }

    this.removeAll = function () {
        
        this.loadedObject.forEach(item => {

            let findObj = null;
            tdCommon.scene.traverse((obj) => {
                //console.log(obj);
                if (obj.userData.assetsId && obj.userData.assetsId === item.userData.assetsId) {
                    findObj = obj;
                }
            });
            if (findObj) tdCommon.scene.remove(findObj);

        });

        this.loadedObject = [];

        viewer.draw();
    }
    
}

export { Content }; 