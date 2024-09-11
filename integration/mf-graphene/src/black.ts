import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { cloneAndPlaceGeometry, conuse, genSceneObjects, testGeomentry } from './framework';

let renderer, camera, scene, controls, gui, light, wireframeResult;




export async function init() {

	const bgColor = 0x111111;

	// renderer setup
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(bgColor, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);

	// scene setup
	scene = new THREE.Scene();

	// lights
	light = new THREE.DirectionalLight(0xffffff, 3.5);
	light = new THREE.DirectionalLight(0xffffff, 3.5);
	light.position.set(1, 2, 1);
	scene.add(light, new THREE.AmbientLight(0xb0bec5, 0.35));

	// shadows
	const shadowCam = light.shadow.camera;
	light.castShadow = true;
	light.shadow.mapSize.setScalar(4096);
	light.shadow.bias = 1e-5;
	light.shadow.normalBias = 1e-2;

	shadowCam.left = shadowCam.bottom = - 2.5;
	shadowCam.right = shadowCam.top = 2.5;
	shadowCam.updateProjectionMatrix();

	// camera setup
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
	camera.position.set(800, 1.5, 2);
	camera.far = 1000;
	camera.updateProjectionMatrix();

	// controls
	controls = new OrbitControls(camera, renderer.domElement);

	// floor
	const floor = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.ShadowMaterial({ opacity: 0.05 }));
	floor.material.color.set(0xE0F7FA);
	floor.rotation.x = - Math.PI / 2;
	floor.scale.setScalar(10);
	floor.position.y = - 0.75;
	floor.receiveShadow = true;
	scene.add(floor);



	genSceneObjects(scene)


	// add wireframe representation
	wireframeResult = new THREE.Mesh(result.geometry, new THREE.MeshBasicMaterial({
		wireframe: true,
		color: 0,
		opacity: 0.15,
		transparent: true,
	}));
	wireframeResult.material.color.set(0x001516);
	wireframeResult.visible = false;


	scene.add(wireframeResult);

	// gui
	gui = new GUI();
	gui.add(wireframeResult, 'visible').name('wireframe');

	window.addEventListener('resize', function () {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}, false);


}

export function render() {

	requestAnimationFrame(render);
	renderer.render(scene, camera);

}