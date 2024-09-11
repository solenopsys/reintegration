import * as THREE from "three";


export const HUB_HEIGHT = 25;
export const CONNECTOR_WIDTH = 25;
export const M2_HEIGHT = 4;
export const M2_PADDING = 2.5;
export const M2_PIN_HEIGHT = 3;


export type HubConfig = {
    connectorsBySide: number,
    skip: number[],
}

export function shapeMacros(config: HubConfig, scale: number): THREE.Mesh {

    const halfCircle = config.connectorsBySide;

    const extrudeSettings = {
        depth: 20 * scale,
        steps: 2
    };

    const d = new M2Drawer(config.connectorsBySide, scale, config.skip, drawLine, drawConnector)
    const context = new THREE.Shape
    d.drawPath(halfCircle, context, 0, 0)
    const geometry = new THREE.ExtrudeGeometry(context, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({color: 0x00aa00});
    return new THREE.Mesh(geometry, material);
}


function isSkip(skip: number[], n: number): boolean {
    return skip.some(d => d == n)
}

export function pinsMacros(config: HubConfig, scale: number): THREE.Group {
    const group = new THREE.Group();


    const height = M2_PIN_HEIGHT * scale;
    const width = 0.35 * scale;

    const geometry = new THREE.BoxGeometry(width, height, 1);


    const connectorWidth = CONNECTOR_WIDTH * scale
    const hubHeight = HUB_HEIGHT * scale;


    let n = 0;
    for (let i = 0; i < config.connectorsBySide; i++) {
        n++
        if (!isSkip(config.skip, n))
            pinArray(geometry, group, connectorWidth * i, 0, scale)

    }

    for (let i = 0; i < config.connectorsBySide; i++) {
        n++
        let pos = connectorWidth * (config.connectorsBySide - i) - M2_PADDING * scale * 2;
        if (!isSkip(config.skip, n))
            pinArray(geometry, group, pos - 2, hubHeight + 5 * scale, -1 * scale)
    }

    return group;
}

export function pcbSize(sideConnectorsCount: number, scale: number) {
    return {
        width: sideConnectorsCount * CONNECTOR_WIDTH * scale,
        height: (HUB_HEIGHT + M2_HEIGHT * 2) * scale
    }
}

export interface DrawFunction {
    (context: THREE.Shape, startX: number, startY: number, scale: number): { x: number, y: number };
}

export function drawConnector(shape: THREE.Shape, startX: number, startY: number, scale: number) {
    const m2Padding = M2_PADDING * scale;
    const m2Height = M2_HEIGHT * scale;
    const m2Width = (CONNECTOR_WIDTH - M2_PADDING * 2) * scale;
    let nextX = m2Padding + startX;

    shape.lineTo(nextX, startY);

    let nextY = startY - m2Height;
    shape.lineTo(nextX, nextY);
    nextX = nextX + m2Width;


    shape.lineTo(nextX, nextY);

    nextY = nextY + m2Height;
    shape.lineTo(nextX, nextY);
    nextX = nextX + m2Padding;
    shape.lineTo(nextX, nextY);

    return {x: nextX, y: nextY};
}

export function drawLine(shape: THREE.Shape, startX: number, startY: number, scale: number) {

    const m2Width = (CONNECTOR_WIDTH) * scale;
    let nextX = m2Width + startX;

    shape.lineTo(nextX, startY);
    return {x: nextX, y: startY};
}

const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700, // Set the base color to gold
    metalness: 1,   // Make the material fully metallic
    //  roughness: 0.2, // Set a moderate roughness for a polished look
});


export function pinArray(geometry, group: THREE.Group, startX, startY, scale) {
    for (let j = 0; j < 40; j++) {
        const mesh = new THREE.Mesh(geometry, goldMaterial);
        mesh.position.z = -1;
        mesh.position.x = (0.5 * scale * j) + startX;
        mesh.position.y = startY;
        group.add(mesh);
    }
}


export class M2Drawer {
    constructor(private connectors: number,
                private scale: number,
                private skip: number[],
                private drawSkip: DrawFunction,
                private draw: DrawFunction
    ) {

    }


    getDrawFunction(n: number) {
        return isSkip(this.skip, n) ? this.drawSkip : this.draw
    }


    drawPath(connectors, context: THREE.Shape, startX: number, startY: number) {
        const hubHeight = HUB_HEIGHT * this.scale;
        const connectorWidth = CONNECTOR_WIDTH * this.scale


        context.moveTo(startX, startY);

        let n = 0

        for (let i = 0; i < connectors; i++) {
            n++
            const df: DrawFunction = this.getDrawFunction(n);
            df(context, startX + connectorWidth * i, startY, this.scale);
        }


        context.lineTo(startX + connectors * connectorWidth, startY + hubHeight);


        for (let i = 0; i < connectors; i++) {
            n++
            let pos = connectorWidth * (connectors - i);
            const df: DrawFunction = this.getDrawFunction(n);
            df(context, startX + pos, startY + hubHeight, -1 * this.scale);
        }


        context.lineTo(startX, startY);
    }
}


export function generateHub(config: HubConfig, scale: number): THREE.Group {
    const superGroup: THREE.Group = new THREE.Group();
    const group: THREE.Group = pinsMacros(config, scale);
    group.position.x = M2_PADDING * scale + 1;
    group.position.y = M2_PIN_HEIGHT * scale / 2;
    superGroup.add(group);


    let mesh = shapeMacros(config, scale);
    mesh.position.x = 0;
    mesh.position.y = M2_HEIGHT * scale;
    superGroup.add(mesh);

    return superGroup;
}