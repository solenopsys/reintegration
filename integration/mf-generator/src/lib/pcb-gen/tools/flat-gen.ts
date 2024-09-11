import * as THREE from "three";


function genSimpleSmtIC(conf: IC): THREE.Group {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(conf.width, conf.height, conf.deep);
    const cube = new THREE.Mesh(geometry, conf.material);
    group.add(cube);
    return group;
}

interface IC {
    width: number;
    height: number;
    deep: number;
    material: THREE.Material;
}

interface GenFunction<T> {
    (conf: T): THREE.Group;
}

export function genGroup(count: number, scale: number, width: number, height: number,deep:number): THREE.Group {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({color: 0x000000});
    const conf: IC = {
        width: scale * width,
        height: scale * height,
        deep: deep* scale,
        material: material
    }

    const genFunc: GenFunction<IC> = genSimpleSmtIC;
    let comp = genFunc(conf);
    for (let i = 0; i < count; i++) {
        const cloned = comp.clone();
        cloned.position.x = i * 20;
        group.add(cloned);
    }
    group.add(comp);
    return group;

}