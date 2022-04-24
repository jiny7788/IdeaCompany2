import * as THREE from 'three';
import { Loader } from "./Loader";

function Content(viewer) {

    // init
    this.loader = new Loader(this);
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.mixer = new THREE.AnimationMixer( this.scene );
    this.loadedObject = [];    
    this.id = 1;


    this.addObject = function (object, parent, index) {

		if ( parent === undefined ) {
            console.log(object);
            // Array에 추가해 준다.
            this.loadedObject.push(object);

            // 그림자를 생성한다. 
            object.traverse( function ( object ) {
                if (object.isMesh) {
                    object.castShadow = true;
                }
            });

            // object에 userdata를 추가한다. 여기서 assetsId, assetsNam을 채워준다.
            object.userData.draggable = true;
            object.userData.assetsId = this.id ++;

            // 객체의 크기를 계산한다. (객체를 감싸는 Box를 구하고 대각선 사이의 거리를 구한다.)
            let bbox = new THREE.Box3().setFromObject(object);
            let distance = bbox.max.distanceTo(bbox.min);
            console.log('모델크기', distance);
            
            // 크기에 맞춰 확대/축소
            let scaleVal = 20.0 / distance;         // 무조건 20 크기가 되게 만든다. 
            console.log('비례값', scaleVal);
            object.scale.set(scaleVal, scaleVal, scaleVal);

            // 위치 이동 : 땅 밑으로 가 있는 객체의 경우 땅 바닥에 붙인다. 
            // 위치 이동을 위해 확대/축소된 객체의 좌표를 다시 구한 후 y 좌표를 0으로 맞춘다. 
            bbox = new THREE.Box3().setFromObject(object);
            if (bbox.min.y < 0) {  // 땅 밑으로 가 있는 객체만 위로 올린다.
                console.log('Groud로 이동', scaleVal);
                object.position.y -= bbox.min.y;
            }

            // scene에 추가해 준다.
            this.scene.add(object); 

            // 위치 이동 테스트
            //object.position.x = 61.98722088352751;
            //object.position.y = 5.4783316322420355;
            //object.position.z = -46.86617214438609;

            // 크기 변경 테스트
            //object.scale.x = 3.4606686643039932;
            //object.scale.y = 3.4606686643039932;
            //object.scale.z = 3.4606686643039932;

            // 회전 변경 테스트
            //object.rotation.x = 0.205751883458614;
            //object.rotation.y = -0.7107763378877161;
            //object.rotation.z = -0.05819872471980264;

		} else {

			parent.children.splice( index, 0, object );
			object.parent = parent;

		}

		// render() 호출 : animate로 되어 있지 않은 경우 다시 rendering 하도록 호출해 준다.
        viewer.render1();
    };

}

export { Content }; 