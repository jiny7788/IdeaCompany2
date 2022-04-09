import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useSelector } from 'react-redux'; 

let camera, scene, renderer;
let filePath;

function GltfViewer1() {

    // useSelector는 리덕스 스토어의 상태를 조회하는 Hook입니다.
    // state의 값은 store.getState() 함수를 호출했을 때 나타나는 결과물과 동일합니다.
    const { gltfFile } = useSelector(state => ({
        gltfFile: state.imageLoader.gltfFile
    }));
    
    useEffect(() => {
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        camera.position.set(- 1.8, 0.6, 2.7);
        camera.layers.enable( 0 ); // enabled by default
        camera.layers.enable( 1 );
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        
        const light = new THREE.PointLight( 0xffffff, 1 );
		light.layers.enable( 0 );
		light.layers.enable( 1 );

        scene.add( camera );
        camera.add( light );
        
        console.log("Load gltfFile: " + gltfFile);        

         new RGBELoader()
            .setPath( 'textures/equirectangular/' )
            .load( 'royal_esplanade_1k.hdr', function ( texture ) {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                scene.background = texture;
                scene.environment = texture;

                render1();

                const loader = new GLTFLoader();
                loader.load( gltfFile, function ( gltf ) {
                    //scene.add(gltf.scene);

                    gltf.scene.traverse( function ( object ) {

                        if (object.isMesh) object.castShadow = true;
                        object.layers.set(0);

                    });
                    
                    const model1 = SkeletonUtils.clone( gltf.scene );
					const model2 = SkeletonUtils.clone( gltf.scene );
                    const model3 = SkeletonUtils.clone(gltf.scene);
                    
                    model1.position.x = - 2;
					model2.position.x = 0;
                    model3.position.x = 2;
                    
                    scene.add(model1, model2, model3);
                    
                    //camera.layers.toggle( 0 );

                    render1();

                } );

            });
        
        const geometry = new THREE.BoxGeometry( 20, 20, 20 );        
        const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
        object.position.x = 1;
		object.position.y = 1;
        object.position.z = 1;

        object.rotation.x = 0;
        object.rotation.y = 0;
        object.rotation.z = 0;
 
        object.scale.x = 0.01;
        object.scale.y = 0.01;
        object.scale.z = 0.01;

        object.layers.set(1);
        scene.add( object );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setSize(document.getElementById('viewer').clientWidth, document.getElementById('viewer').clientHeight);

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;

        if (document.getElementById('viewer').childElementCount > 0)
        {   // 기존 dom을 없앤다.
            document.getElementById('viewer').removeChild(document.getElementById('viewer').firstChild);
            console.log("delete canvas");
        }
        document.getElementById('viewer').appendChild(renderer.domElement);

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render1 ); // use if there is no animation loop
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set( 0, 0, - 0.2 );
        controls.update();

        

        filePath = gltfFile;

        window.addEventListener('resize', onWindowResize);   
        
        render1();
        
        return () => {
        };
    }, [gltfFile]);

    return (
        <>            
            <div id="viewer" style={{ width: '100%', height: '100%', border: '1px solid blue' }} />
        </>
      );

}

function onWindowResize() {
    //console.log("Resize:" + filePath);
    //camera.aspect = window.innerWidth / window.innerHeight;
    //camera.aspect = document.getElementById('canvas').clientWidth / document.getElementById('canvas').clientHeight;
    //camera.updateProjectionMatrix();

    renderer.setSize(document.getElementById('viewer').clientWidth, document.getElementById('viewer').clientHeight);

    render1();
}

function render1() {

    renderer.render( scene, camera );
}

export default GltfViewer1;