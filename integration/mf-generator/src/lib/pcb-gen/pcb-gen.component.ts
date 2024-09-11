import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as THREE from "three";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";

import type { HubConfig } from "./tools/hub-drawer"
import  {generateHub} from "./tools/hub-drawer"

import {
    M2_HEIGHT,
    M2_PADDING,
    M2_PIN_HEIGHT,
    pcbSize,
    pinsMacros,
    shapeMacros
} from "./tools/hub-drawer";
import {createScene} from "./scene";
import {genGroup} from "./tools/flat-gen";
import {crateRenderer} from "./renderer";


@Component({
    selector: 'pcb-gen',
    templateUrl: './pcb-gen.component.html',
    styleUrls: ['./pcb-gen.component.css']
})
export class PcbGenComponent implements AfterViewInit {
    @ViewChild("3dDraw", {static: true})
    drawElement!: ElementRef<HTMLCanvasElement>;

    scene: THREE.Scene;

    @Input()
    config!: HubConfig
    @Input()
    cameraType = "front";


    renderer: THREE.WebGLRenderer;

    scale = 5
    size

    ngAfterViewInit(): void {

        this.size = pcbSize(this.config.connectorsBySide, this.scale);
        this.renderer = crateRenderer(this.size.width, this.size.height);

        this.drawElement.nativeElement.appendChild(this.renderer.domElement);

        this.renderInit()
    }


    renderInit() {
        let startX = -this.size.width / 2;
        let startY = this.size.height / -2;

        let camera;
        if (this.cameraType == "front") {

             camera = new THREE.OrthographicCamera(this.size.width / 2, startX, startY, this.size.height / 2, 1, 1000);
            camera.position.set(0, 0, -10);
            camera.lookAt(0, 0, 0);

        }

        if (this.cameraType == "perspective") {
            camera = new THREE.PerspectiveCamera(50,
                window.innerWidth / window.innerHeight, 0.7, 500);
            camera.position.set(0, 0, -500);
            camera.lookAt(0, 0, 1);

            // const controls = new OrbitControls(camera, this.renderer.domElement);
            // controls.enableDamping = true;
            // controls.dampingFactor = 0.25;
            // controls.enableZoom = true;

            // var aspectRatio = window.innerWidth / window.innerHeight,
            //     fieldOfView = 50,
            //     nearPlane =  0.2,
            //     farPlane = 500;
            //  camera = new THREE.PerspectiveCamera(
            //     fieldOfView,
            //     aspectRatio,
            //     nearPlane,
            //     farPlane
            // );
        }

        this.scene = createScene();
        const group = generateHub(this.config, this.scale);
        group.position.x = -this.size.width / 2;
        group.position.y = -this.size.height / 2;
        this.scene.add(group)

        let group2 = genGroup(1, this.scale, 15, 15, 2);
        group2.position.y += 2;

        this.scene.add(group2)

        new RGBELoader()
            .setPath('/assets/hdr/')
            .load('skylit_garage_1k.hdr', function (texture) {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                //   scene.background = texture;
                //this.scene.environment = texture;
            });


        this.renderer.useLegacyLights = false;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        this.animate(camera as THREE.Camera);
    }


    animate(camera) {
        this.renderer.render(this.scene, camera);
    }
}
