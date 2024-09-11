import * as THREE from "three";
import {ThreeMFLoader} from "three/examples/jsm/loaders/3MFLoader";


function load3MF(fileUrl: string) {
    const loader = new ThreeMFLoader();
    loader.load(
        fileUrl,
        (object) => {

            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    console.log("MAT", child.name);
                    console.log("MAT", child.material);
                    console.log("MAT", child.material.uuid);
                    //child.material.color={isColor: true, r: 221, g: 1, b: 1}
                    //  child.material = TestMaterialRed.clone();
                    // console.log("MAT",child)
                    //    child.castShadow = true;
                    if (child.name == "body68314") {
                        child.material.color = new THREE.Color(0, 1, 0);

                    } else if (child.name == "body67351") {
                        child.material.color = new THREE.Color(0, 0, 1);
                    } else if (child.name == "body68855") {
                        child.material = new THREE.MeshStandardMaterial({
                            metalness: 1,
                            roughness: 0.5,
                            //  envMap :  this.envMap
                        });
                    } else {
                        child.material.color = new THREE.Color(0.3, 0, 0);

                        //    child.material.envMap =  this.envMap
                    }


                }
                //

            });
            object.position.z = 1;


            this.scene.add(object);
        });
}
