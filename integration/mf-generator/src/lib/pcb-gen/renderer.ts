import * as THREE from "three";

export function crateRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding; //улучшает качество
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    return renderer;
}

