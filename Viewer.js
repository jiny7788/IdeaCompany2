import React from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

let camera, scene, renderer;
let plane;
let pointer, raycaster, isShiftDown = false;

let rollOverMesh, rollOverMaterial;
let cubeGeo, cubeMaterial;

const objects = [];

function render() {
  renderer.render( scene, camera );
}

class Viewer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.set( 500, 800, 1300 );
      camera.lookAt( 0, 0, 0 );

      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xf0f0f0 );

      // roll-over helpers

      const rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
      rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
      rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
      scene.add( rollOverMesh );

      // cubes

      cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
      cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( 'textures/square-outline-textured.png' ) } );

      // grid

      const gridHelper = new THREE.GridHelper( 1000, 20 );
      scene.add( gridHelper );

      //

      raycaster = new THREE.Raycaster();
      pointer = new THREE.Vector2();

      const geometry = new THREE.PlaneGeometry( 1000, 1000 );
      geometry.rotateX( - Math.PI / 2 );

      plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
      scene.add( plane );

      objects.push( plane );

      // lights

      const ambientLight = new THREE.AmbientLight( 0x606060 );
      scene.add( ambientLight );

      const directionalLight = new THREE.DirectionalLight( 0xffffff );
      directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
      scene.add( directionalLight );

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );

      let orbit = new OrbitControls(camera, renderer.domElement);
      orbit.enableZoom = true;
      orbit.enabled = true;

      this.element.appendChild(renderer.domElement);

    document.addEventListener( 'pointermove', this.onPointerMove );
    document.addEventListener( 'pointerdown', this.onPointerDown );
    document.addEventListener( 'keydown', this.onDocumentKeyDown );
    document.addEventListener( 'keyup', this.onDocumentKeyUp );

    window.addEventListener( 'resize', this.onWindowResize );    

    render();
  }

  onWindowResize() {    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );  

    renderer.render(scene, camera);
      
    console.log("Width:" + window.innerWidth + ", Height:" + window.innerHeight);
  }
  
  onPointerMove( event ) {
    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( pointer, camera );  
    const intersects = raycaster.intersectObjects( objects, false );
  
    if ( intersects.length > 0 ) {  
      const intersect = intersects[ 0 ];
  
      rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
      rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
  
      render();
    }  
  }
  
  onPointerDown( event ) {
  
    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( pointer, camera );
  
    const intersects = raycaster.intersectObjects( objects, false );
  
    if ( intersects.length > 0 ) {
  
      const intersect = intersects[ 0 ];
  
      // delete cube
  
      if ( isShiftDown ) {
  
        if ( intersect.object !== plane ) {
  
          scene.remove( intersect.object );
  
          objects.splice( objects.indexOf( intersect.object ), 1 );
  
        }
  
        // create cube
  
      } else {
  
        const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
        voxel.position.copy( intersect.point ).add( intersect.face.normal );
        voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        scene.add( voxel );
  
        objects.push( voxel );
  
      }
  
      render();
  
    }
  
  }
  
  onDocumentKeyDown( event ) {
  
    switch ( event.keyCode ) {
  
      case 16: isShiftDown = true; break;
  
    }
  
  }
  
  onDocumentKeyUp( event ) {
  
    switch ( event.keyCode ) {
  
      case 16: isShiftDown = false; break;
  
    }
  
  }  

   render() {
    return (
      <div ref={el => this.element = el} style={{ width: '100%', height: '100%', border: '1px solid red' }} />
    );
  }
}

export default Viewer;