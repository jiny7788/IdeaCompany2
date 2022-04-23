import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { unzipSync } from 'three/examples/jsm/libs/fflate.module.js';


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

        switch (extension) {
            case 'fbx': {                
                const loader = new FBXLoader(manager);
                loader.load(filePath, function (object) {   
                    
                    // object에 userdata를 추가한다. 
                    object.userData.name = filePath;
                    
                    content.addObject(object); 

                    // animaton을 scene에 추가 해준다. 
                    //content.scene.animations.push(...object.animations);

                    // animation이 있으면 플레이 시켜준다.  
                    if (object.animations.length > 0) {
                        //console.log(object.animations);
                        //content.mixer.clipAction(object.animations[0]).play();
                    }
                });

                break;
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
                    // object에 userdata를 추가한다. 
                    result.scene.userData.name = filePath;

                    content.addObject(result.scene);

                     // animaton을 scene에 추가 해준다. 
                     //content.scene.animations.push(...result.animations);

                    // animation이 있으면 플레이 시켜준다.  
                    if (result.animations.length > 0) {
                        //console.log(result.animations);
                        //content.mixer.clipAction(result.animations[0]).play();

                        // 객체 쪽으로 animation을 복사해 준다. 
                        //(gltf는 하부에 animations를 가지고 있음)
                        result.scene.animations.push(...result.animations);
                    }
                });

                break;
            }
                
            case 'ifc': {
                const loader = new IFCLoader(manager);
			 	loader.ifcManager.setWasmPath( 'three/examples/jsm/loaders/ifc' );
                loader.load(filePath, function (ifcModel) {    
                    // object에 userdata를 추가한다. 
                    ifcModel.userData.name = filePath;

                    content.addObject( ifcModel );
                });

                break;
            }

            case 'obj': {
                //const mtlloader = new MTLLoader();
                //mtlloader.load('samples/Independent.mtl', function (materials ) {
                //    const loader = new OBJLoader(manager);
                //    loader
                //        .setMaterials( materials )
                //        .load(filePath, function (object) {    
                //        // object에 userdata를 추가한다. 
                //        object.userData.name = filePath;
                //
                //        content.addObject( object );
                //    });
                //});

                const loader = new OBJLoader(manager);
                loader.load(filePath, function (object) {    
                    // object에 userdata를 추가한다. 
                    object.userData.name = filePath;

                    content.addObject( object );
                });

                break;
            }
                
            case 'zip': {
                loadXHR(filePath)
                    .then(resultBlob => {
                        //const url = URL.createObjectURL(resultBlob);
                        //return url;
                        const reader = new FileReader();
                        reader.addEventListener( 'load', function ( event ) {

                            handleZIP( event.target.result, content, filePath );

                        }, false );
                        reader.readAsArrayBuffer(resultBlob);

                    })
                    .then(url => {
                        // URL.revokeObjectURL(url);
                    });                        
                
                break;
            }
        }

    }; 

}

function handleZIP(contents, content, filePath) {
    const zip = unzipSync(new Uint8Array(contents));    

    // console.log(zip);

    for ( const path in zip ) {

        const file = zip[ path ];

        const manager = new THREE.LoadingManager();
        manager.setURLModifier( function ( url ) {

            const file = zip[ url ];

            if ( file ) {

                console.log( 'Loading', url );
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
                object.userData.name = filePath;

                content.addObject(object); 
                
                // animaton을 scene에 추가 해준다. 
                //content.scene.animations.push(...object.animations);

                // animation이 있으면 플레이 시켜준다.  
                if (object.animations.length > 0) {
                    //console.log(object.animations);
                    //content.mixer.clipAction(object.animations[0]).play();
                }
                    
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
                    result.scene.userData.name = filePath;

                    content.addObject(result.scene);

                     // animaton을 scene에 추가 해준다. 
                     //content.scene.animations.push(...result.animations);

                    // animation이 있으면 플레이 시켜준다.  
                    if (result.animations.length > 0) {
                        //console.log(result.animations);
                        //content.mixer.clipAction(result.animations[0]).play();

                        // 객체 쪽으로 animation을 복사해 준다. 
                        //(gltf는 하부에 animations를 가지고 있음)
                        result.scene.animations.push(...result.animations);
                    }
                } );

                break;
            }

            case 'ifc': 
            {
                const loader = new IFCLoader(manager);
                loader.ifcManager.setWasmPath('three/examples/jsm/loaders/ifc');
                loader.parse(file.buffer, function (ifcModel) {
                    // object에 userdata를 추가한다. 
                    ifcModel.userData.name = filePath;

                    content.addObject( ifcModel );
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