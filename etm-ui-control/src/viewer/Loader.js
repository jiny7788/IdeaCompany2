import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader.js';
// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

function Loader( content ) {

    this.loadFile = function (filePath) {

        const extension = filePath.split('.').pop().toLowerCase();
     
        // create LoadingManager
        const manager = new THREE.LoadingManager();
        
        // a LoadingManager can be used to override resource URLs during loading.
        // This may be helpful for assets coming from drag - and - drop events, WebSockets, WebRTC, or other APIs.
        // An example showing how to load an in -memory model using Blob URLs is below
        // 파일을 서버에서 id로 파일을 읽어와서 맵핑하는 처리가 필요함
        // 이런 처리를 안하려면 단일 파일로만 만들어야 함
        /*
        // Blob or File objects created when dragging files into the webpage.
        const blobs = { 'fish.gltf': blob1, 'diffuse.png': blob2, 'normal.png': blob3 };
        // Initialize loading manager with URL callback.
        const objectURLs = [];
        manager.setURLModifier( ( url ) => {
            url = URL.createObjectURL( blobs[ url ] );
            objectURLs.push( url );
            return url;
        });
*/
        // 일단 아무것도 안하는 빈껍데기 함수를 설정한다.
        manager.setURLModifier((url) => {
            console.log('setURLModifier:', url);
            return url;
        });
        
        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onLoad = function ( ) {
            console.log( 'Loading complete!');
        };

        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };

        switch (extension) {
            case 'fbx': {                
                const loader = new FBXLoader(manager);
                loader.load(filePath, function (object) {                    
                    content.addObject(object); 
                });
            }
                
            case 'glb': 
            case 'gltf': {
                const dracoLoader = new DRACOLoader();
				dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/gltf/' );

				const loader = new GLTFLoader(manager);
				loader.setDRACOLoader( dracoLoader );

                // // 압축이 틀린 경우 처리 필요 : ktx2///
                // const ktx2Loader = new KTX2Loader()
				// 	.setTranscoderPath( 'three/examples/js/libs/basis/' );
                // loader.setKTX2Loader( ktx2Loader );
                // loader.setMeshoptDecoder( MeshoptDecoder );

                loader.load(filePath, function (result) {
                    content.addObject(result.scene);
                });
            }
                
            case 'ifc': {
                const loader = new IFCLoader(manager);
			 	loader.ifcManager.setWasmPath( 'three/examples/jsm/loaders/ifc/' );
                loader.load(filePath, function(model) {
                    model.mesh.name = filePath;
                    content.addObject(model.mesh);
                });
            }
        }

    }; 

}

export {Loader};