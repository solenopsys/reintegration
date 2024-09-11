import * as THREE from "three";

const light1 = new THREE.SpotLight(0xffffff, 1);
light1.position.set(-600, 1200, -1200);

const light2 = new THREE.SpotLight(0x02ffff, 1);
light2.position.set(800, -1500, -1100);

const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);


export function createScene() {
    const scene = new THREE.Scene();
    // this.scene.add(ambientLight);//
    // scene.add(light1);
    // scene.add(light2);
    // scene.add(hemiLight);
    var col_light = 0xffffff; // set

    var light = new THREE.AmbientLight(col_light, 0.6);

    var keyLight = new THREE.DirectionalLight(col_light, 0.6);
    keyLight.position.set(20, 30, 10);
    keyLight.castShadow = true;
    keyLight.shadow.camera.top = 20;

// var shadowHelper = new THREE.CameraHelper( keyLight.shadow.camera );
// scene.add( shadowHelper );

    var fillLight = new THREE.DirectionalLight(col_light, 0.3);
    fillLight.position.set(-20, 20, 20);

    var backLight = new THREE.DirectionalLight(col_light, 0.1);
    backLight.position.set(10, 0, -20);

    scene.add(light);
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
    return scene
}
//
// export function createScene() {
//     const scene = new THREE.Scene();
//     // this.scene.add(ambientLight);//
//     var ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
//     scene.add(ambientLight);
//
// // Create directional light
//     var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(0, 1, 0); // Set position
//     scene.add(directionalLight);
//
// // Create point light
//     var pointLight = new THREE.PointLight(0xff0000, 1, 100);
//     pointLight.position.set(5, 5, 5); // Set position
//     scene.add(pointLight);
//
// // Create spotlight
//     var spotLight = new THREE.SpotLight(0xffff00, 1);
//     spotLight.position.set(-5, 5, -5); // Set position
//     spotLight.target.position.set(0, 0, 0); // Set target position
//     scene.add(spotLight);
//     scene.add(spotLight.target);
//
//     return scene
// }