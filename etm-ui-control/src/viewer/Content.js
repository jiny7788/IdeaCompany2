import * as THREE from 'three';
import { Loader } from "./Loader";

function Content() {

    // init
    this.loader = new Loader(this);
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.mixer = new THREE.AnimationMixer( this.scene );
    this.loadedObject = [];


    this.addObject = function (object, parent, index) {

        object.traverse( function ( child ) {

			//if ( child.geometry !== undefined ) this.addGeometry( child.geometry );
			//if ( child.material !== undefined ) this.addMaterial( child.material );

			// this.addCamera( child );
			//this.addHelper( child );

		} );

		if ( parent === undefined ) {
            console.log(object);
            // Array에 추가해 준다.
            this.loadedObject.push(object);
            
            // 확대/축소
            //object.scale.set(20, 20, 20);

            this.scene.add(object);   

            // animaton을 scene에 추가 해준다. 
            this.scene.animations.push(...object.animations);

            // animation이 있으면 플레이 시켜준다.  
            // if ( this.scene.animations.length > 0 ) {
            //      console.log(this.scene.animations);
            //      this.mixer.clipAction(this.scene.animations[0]).play();
            // }

            if (object.animations.length > 0) {
                console.log(object.animations);
                this.mixer.clipAction(object.animations[0]).play();
            }

		} else {

			parent.children.splice( index, 0, object );
			object.parent = parent;

		}

		// render() 호출
		// this.signals.sceneGraphChanged.dispatch();
    };

    this.addCamera = function ( camera ) {
        if( camera.isCamera) {
            this.cameras[ camera.uuid ] = camera;
            //this.signals.cameraAdded.dispatch( camera );
        }
    };


}

export { Content }; 