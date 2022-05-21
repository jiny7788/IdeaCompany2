import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader.js';
//import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { REST_GW_URL } from '../config/api-config';


function Loader( content ) {

    this.loadFile = function (loadObject, bSelect = false) {
        //console.log(`loadFiel : bSelect(${bSelect})`);

        let filePath = loadObject.fileName;
        let position = loadObject.position;
        let scale = loadObject.scale;
        let rotation = loadObject.rotation;
        let downPath = REST_GW_URL + "/fileserver/api/v2/download/files/" + loadObject.fileSeq;

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
            // if (url.length > 100) 
            //     console.log('setURLModifier: Binary Atached!!!');
            // else 
            //     console.log('setURLModifier:', url);
                
            return url;
        });
        
        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            //console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onLoad = function ( ) {
            //console.log( 'Loading complete!');
        };

        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onError = function ( url ) {
            console.log('There was an error loading ' + url);
        };

        // 인증(쿠키) 정보를 포함하여 파일서버로 파일 요청
        fetch(downPath,
            {
                method: 'GET',
                credentials: 'include'
            }
        )
        .then(response => response.blob())
        .then(blob => {        
            let downUrl = URL.createObjectURL(blob);
            switch (extension) {
                case 'fbx': {                
                    const loader = new FBXLoader(manager);
                    loader.load(downUrl, function (object) {   
                        
                        // object에 userdata를 추가한다. 
                        object.userData = loadObject;                 
                        
                        content.addObject(object, position, scale, rotation, bSelect); 
    
                    });
    
                    break;
                }
                    
                case 'glb': 
                case 'gltf': {
                    const dracoLoader = new DRACOLoader();
                    dracoLoader.setDecoderPath( 'examples/js/libs/draco/gltf/' );
    
                    const loader = new GLTFLoader(manager);
                    loader.setDRACOLoader( dracoLoader );
    
                    // // 압축이 틀린 경우 처리 필요 : ktx2///
                    // const ktx2Loader = new KTX2Loader()
                    // 	.setTranscoderPath( 'three/examples/js/libs/basis/' );
                    // loader.setKTX2Loader( ktx2Loader );
                    // loader.setMeshoptDecoder( MeshoptDecoder );
    
                    loader.load(downUrl, function (result) {
                        // object에 userdata를 추가한다. 
                        result.scene.userData = loadObject;
    
                        content.addObject(result.scene, position, scale, rotation, bSelect);
    
                    });
    
                    break;
                }
                    
                case 'ifc': {
                    const loader = new IFCLoader(manager);
                     loader.ifcManager.setWasmPath( 'examples/jsm/loaders/ifc' );
                    loader.load(downUrl, function (ifcModel) {    
                        // object에 userdata를 추가한다. 
                        ifcModel.userData = loadObject;
    
                        content.addObject( ifcModel, position, scale, rotation, bSelect );
                    });
    
                    break;
                }
    
                case 'obj': {
                    const loader = new OBJLoader(manager);
                    loader.load(downUrl, function (object) {    
                        // object에 userdata를 추가한다. 
                        object.userData = loadObject;
    
                        content.addObject( object, position, scale, rotation, bSelect );
                    });
    
                    break;
                }
                    
                case 'zip': {
                    loadXHR(downUrl)
                        .then(resultBlob => {
                            //const url = URL.createObjectURL(resultBlob);
                            //return url;
                            const reader = new FileReader();
                            reader.addEventListener( 'load', function ( event ) {
    
                                handleZIP( event.target.result, content, loadObject, bSelect);
    
                            }, false );
                            reader.readAsArrayBuffer(resultBlob);
    
                        })
                        .then(url => {
                            // URL.revokeObjectURL(url);
                        });                        
                    
                    break;
                }
                    
                case 'jpg': 
                case 'gif': 
                case 'png': {
                    const loader = new THREE.TextureLoader();
                    const texture = loader.load(downUrl, () => {    
                        content.viewer.draw();                    
                    });
    
                    // texture를 가지고 Group을 만들어 추가한다.
                    const cylinder1 = new THREE.Mesh(
                        new THREE.CylinderGeometry(5.2, 5.2, 0.4, 32),
                        new THREE.MeshStandardMaterial({ color: 0x0fff0f })
                    );
                    cylinder1.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
    
                    const cylinder2 = new THREE.Mesh(
                        new THREE.CylinderGeometry(5, 5, 0.5, 32),
                        new THREE.MeshStandardMaterial({ map: texture })
                    );
                    cylinder2.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
    
                    const group = new THREE.Group();
                    group.add(cylinder1, cylinder2);                
                    
                    // group에 userdata를 추가한다. 
                    group.userData = loadObject;
    
                    content.addObject( group, position, scale, rotation, bSelect );
    
                    break;
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
    }; 

}

function handleZIP(contents, content, loadObject, bSelect) {
    const zip = unzipSync(new Uint8Array(contents));    

    let position = loadObject.position;
    let scale = loadObject.scale;
    let rotation = loadObject.rotation;

    // console.log(zip);

    for ( const path in zip ) {

        const file = zip[ path ];

        const manager = new THREE.LoadingManager();
        manager.setURLModifier( function ( url ) {

            const file = zip[ url ];

            if ( file ) {

                //console.log( 'Loading', url );
                const blob = new Blob( [ file.buffer ], { type: 'application/octet-stream' } );
                return URL.createObjectURL( blob );

            }

            return url;

        } );

        const extension = path.split( '.' ).pop().toLowerCase();

        switch ( extension ) {

            case 'fbx':
            {
                const loader = new FBXLoader( manager );
                const object = loader.parse(file.buffer);
                    
                // object에 userdata를 추가한다. 
                object.userData = loadObject;

                content.addObject(object, position, scale, rotation, bSelect); 
                
                break;
            }

            case 'glb':
            case 'gltf':
            {
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/gltf/' );

                const loader = new GLTFLoader(manager);
                loader.setDRACOLoader( dracoLoader );

                loader.parse(file.buffer, '', function (result) {
                    
                    // object에 userdata를 추가한다. 
                    result.scene.userData = loadObject;

                    content.addObject(result.scene, position, scale, rotation, bSelect);

                } );

                break;
            }

            case 'ifc': 
            {
                const loader = new IFCLoader(manager);
                loader.ifcManager.setWasmPath('three/examples/jsm/loaders/ifc');
                loader.parse(file.buffer, function (ifcModel) {
                    // object에 userdata를 추가한다. 
                    ifcModel.userData = loadObject;

                    content.addObject( ifcModel, position, scale, rotation, bSelect );
                });  
                
                break;
            }
            
            case 'obj':
            {
                const loader = new OBJLoader(manager);
                loader.parse(file.buffer, function (object) {    
                    // object에 userdata를 추가한다. 
                    object.userData = loadObject;

                    content.addObject( object, position, scale, rotation, bSelect );
                });

                break;
            }

        }

    }

}

// http로 가져와서 blob으로 만든다
function loadXHR(url) {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onerror = event => {
          reject(`Network error: ${event}`);
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(`XHR load error: ${xhr.statusText}`);
          }
        };
        xhr.send();
      } catch (err) {
        reject(err.message);
      }
    });
  }

export {Loader};