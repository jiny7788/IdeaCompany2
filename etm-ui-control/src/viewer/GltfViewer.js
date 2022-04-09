import React from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { connect, ReactReduxContext  } from "react-redux";
import * as imageActions from "../actions/ImageActions";

let camera, scene, renderer;
let divElement;

class GltfViewer extends React.Component {
    

    constructor(props) {
        super(props);

        //console.log(props);

        this.state = {
            gltfFile:this.props.gltfFile
        };
    }

    componentDidMount() {

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        camera.position.set( - 1.8, 0.6, 2.7 );

        scene = new THREE.Scene();
        
        //console.log("Load gltfFile: " + this.state.gltfFile);
        const filePath = this.state.gltfFile;

        new RGBELoader()
            .setPath( 'textures/equirectangular/' )
            .load( 'royal_esplanade_1k.hdr', function ( texture ) {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                scene.background = texture;
                scene.environment = texture;

                render1();

                // model

                const loader = new GLTFLoader();
                //loader.load( 'models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', function ( gltf ) {
                loader.load( filePath, function ( gltf ) {

                    scene.add( gltf.scene );

                    render1();

                } );

            } );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setSize(document.getElementById('canvas').clientWidth, document.getElementById('canvas').clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        //this.element.appendChild(renderer.domElement);
        divElement = document.getElementById('canvas').appendChild(renderer.domElement);

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render1 ); // use if there is no animation loop
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set( 0, 0, - 0.2 );
        controls.update();

        window.addEventListener( 'resize', onWindowResize );
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.gltfFile && nextProps.gltfFile !== this.props.gltfFile) {
            console.log("componentWillReceiveProps: " + nextProps.gltfFile);

            const filePath = nextProps.gltfFile;

            new RGBELoader()
            .setPath( 'textures/equirectangular/' )
            .load( 'royal_esplanade_1k.hdr', function ( texture ) {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                scene.background = texture;
                scene.environment = texture;

                render1();

                // model

                const loader = new GLTFLoader();
                loader.load(filePath, function (gltf) {                    
                    
                    scene.add( gltf.scene );

                    render1();

                } );

            });

            // renderer = new THREE.WebGLRenderer( { antialias: true } );
            // renderer.setPixelRatio( window.devicePixelRatio );
            //  //renderer.setSize( window.innerWidth, window.innerHeight );
            // renderer.setSize(document.getElementById('canvas').clientWidth, document.getElementById('canvas').clientHeight);
            // renderer.toneMapping = THREE.ACESFilmicToneMapping;
            // renderer.toneMappingExposure = 1;
            // renderer.outputEncoding = THREE.sRGBEncoding;
            // //this.element.appendChild(renderer.domElement);
            // document.getElementById('canvas').appendChild(renderer.domElement);

            // const controls = new OrbitControls( camera, renderer.domElement );
            // controls.addEventListener( 'change', render1 ); // use if there is no animation loop
            // controls.minDistance = 2;
            // controls.maxDistance = 10;
            // controls.target.set( 0, 0, - 0.2 );
            // controls.update();
                        
        }

        //console.log("componentWillReceiveProps: " + nextProps.gltfFile);
    }

    render() {
        return (
            <>
                <div id="canvas" style={{ width: '50%', height: '500px', border: '1px solid red' }} />
            </>
        );
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    //renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize(document.getElementById('canvas').clientWidth, document.getElementById('canvas').clientHeight);

    render1();
}

function render1() {

    renderer.render( scene, camera );

}

const mapStateToProps = (state) => ({
    gltfFile: state.imageLoader.gltfFile
 });
  
const mapDispatchToProps = (dispatch) => ({
    loadImage: (fileName) => dispatch(imageActions.loadImage(fileName))
});
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GltfViewer);
  
