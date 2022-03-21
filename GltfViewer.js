import React from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let camera, scene, renderer;

class GltfViewer extends React.Component {
    constructor(props) {
        super(props);
      }

      componentDidMount() {

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        camera.position.set( - 1.8, 0.6, 2.7 );

        scene = new THREE.Scene();

        new RGBELoader()
            .setPath( 'textures/equirectangular/' )
            .load( 'royal_esplanade_1k.hdr', function ( texture ) {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                scene.background = texture;
                scene.environment = texture;

                render();

                // model

                const loader = new GLTFLoader().setPath( 'models/gltf/LeePerrySmith/' );
                loader.load( 'LeePerrySmith.glb', function ( gltf ) {

                    scene.add( gltf.scene );

                    render();

                } );

            } );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        this.element.appendChild(renderer.domElement);

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set( 0, 0, - 0.2 );
        controls.update();

        window.addEventListener( 'resize', onWindowResize );
      }

      render() {
        return (
          <div ref={el => this.element = el} style={{ width: '100%', height: '100%', border: '1px solid red' }} />
        );
      }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function render() {

    renderer.render( scene, camera );

}

export default GltfViewer;