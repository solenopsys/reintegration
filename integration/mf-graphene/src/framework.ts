import * as THREE from 'three';
import {
    Brush,
    Evaluator,
    ADDITION,
    SUBTRACTION,
    INTERSECTION,
} from 'three-bvh-csg';

const redMaterial = new THREE.MeshStandardMaterial({ roughness: 0.25 });
const greenMaterial = new THREE.MeshStandardMaterial({ roughness: 0.25 });
const blueMaterial = new THREE.MeshStandardMaterial({ roughness: 0.25 });

redMaterial.color.set(0xFF1744);
greenMaterial.color.set(0x76FF03);
blueMaterial.color.set(0x292929);


export function testGeomentry() {
    // materials

    // basic pieces
    const cylinder1 = new Brush(new THREE.CylinderGeometry(0.5, 0.5, 6, 45), blueMaterial);
    cylinder1.updateMatrixWorld();

    const cylinder2 = new Brush(new THREE.CylinderGeometry(0.5, 0.5, 6, 45), blueMaterial);
    cylinder2.rotation.x = Math.PI / 2;
    cylinder2.updateMatrixWorld();

    const cylinder3 = new Brush(new THREE.CylinderGeometry(0.5, 0.5, 6, 45), blueMaterial);
    cylinder3.rotation.z = Math.PI / 2;
    cylinder3.updateMatrixWorld();

    const sphere = new Brush(new THREE.SphereGeometry(1, 50, 50), greenMaterial);
    sphere.updateMatrixWorld();

    const box = new Brush(new THREE.BoxGeometry(1.5, 1.5, 1.5), redMaterial);
    box.updateMatrixWorld();

    // processing
    const evaluator = new Evaluator();
    let result;
    result = evaluator.evaluate(cylinder1, cylinder2, ADDITION);
    result = evaluator.evaluate(result, cylinder3, ADDITION);
    result = evaluator.evaluate(sphere, result, SUBTRACTION);
    result = evaluator.evaluate(box, result, INTERSECTION);

    return result
}

export function column(bottomDiameter, topDiametr, height, material) {
    const cylinderGeometry = new THREE.CylinderGeometry(topDiametr / 2, bottomDiameter / 2, height, 32);
    const cone = new THREE.Mesh(cylinderGeometry, material);
    return cone
}

export function connector(diameter) {
    const cylinderGeometry = new THREE.SphereGeometry(diameter / 2, 32, 32);
    const cone = new THREE.Mesh(cylinderGeometry, blueMaterial);
    return cone
}


export function cloneAndPlaceGeometry(originalMesh, offset, rotationAngle) {
    // Клонируем геометрию
    const clonedGeometry = originalMesh.geometry.clone();

    // Создаем новый меш с клонированной геометрией и оригинальными материалами
    const clonedMesh = new THREE.Mesh(clonedGeometry, originalMesh.material);

    // Перемещаем, вращаем и добавляем копию
    clonedMesh.position.copy(offset);
    clonedMesh.rotation.y = rotationAngle;

    // Возвращаем клонированный меш
    return clonedMesh;
}

export function genSegment(h, w, d1, d2, d3, material): THREE.Group {
    // Create a group to hold multiple meshes
    const assembly = new THREE.Group();


    const topColumnDiamter = d3
    const midleColumnDiamter = d2
    const bottomColumnDiameter = d1


    const roundPerset = 1.25

    const halfH = h / 2
    const halfW = w / 2

    const angle = Math.PI / 3

    const col = column(midleColumnDiamter, topColumnDiamter, h, material)
    assembly.add(col);

    const colBottomLeft = column(bottomColumnDiameter, midleColumnDiamter, w, material)
    colBottomLeft.position.y = colBottomLeft.position.y - halfH - halfW * Math.cos(angle)
    colBottomLeft.position.z = colBottomLeft.position.z - halfW * Math.sin(angle)
    colBottomLeft.rotation.x = angle;
    assembly.add(colBottomLeft);

    const colBottomRigth = column(bottomColumnDiameter, midleColumnDiamter, w, material)
    colBottomRigth.position.y = colBottomRigth.position.y - halfH - halfW * Math.cos(angle) //

    colBottomRigth.position.z = colBottomRigth.position.z + halfW * Math.sin(angle)
    colBottomRigth.rotation.x = -angle;
    assembly.add(colBottomRigth);

    const conTop = connector(topColumnDiamter * roundPerset)
    conTop.position.y = conTop.position.y + halfH
    assembly.add(conTop);

    const conBottom = connector(midleColumnDiamter * roundPerset)
    conBottom.position.y = conBottom.position.y - halfH
    assembly.add(conBottom);

    const conBottomLeft = connector(bottomColumnDiameter * roundPerset)
    conBottomLeft.position.y = conBottomLeft.position.y - halfH - w * Math.cos(angle)
    conBottomLeft.position.z = conBottomLeft.position.z + w * Math.sin(angle)
    assembly.add(conBottomLeft);


    const conBottomRight = connector(bottomColumnDiameter * roundPerset)
    conBottomRight.position.y = conBottomRight.position.y - halfH - w * Math.cos(angle)
    conBottomRight.position.z = conBottomRight.position.z - w * Math.sin(angle)
    assembly.add(conBottomRight);

    return assembly
}

export function genRoundArray(conf: RingParams, d1, d2, d3,): THREE.Group {

    const group = genSegment(conf.h, conf.w, d1, d2, d3, conf.material)

    const assembly = new THREE.Group();

    for (let i = 0; i < conf.countSegments; i++) {
        const clonedObject = group.clone();
        const angleInDegrees = i * conf.itemAngle;
        const angleInRadians = THREE.MathUtils.degToRad(angleInDegrees);

        const x = conf.radius * Math.cos(angleInRadians);
        const z = conf.radius * Math.sin(angleInRadians);

        clonedObject.position.set(x, 0, z);
        clonedObject.lookAt(0, 0, 0);
        clonedObject.rotation.y -= THREE.MathUtils.degToRad(90);
        assembly.add(clonedObject)

    }
    return assembly
}

class RingParams {
    public readonly angle = Math.PI / 3
    public readonly segmentWidth
    public readonly countSegments
    public readonly itemAngle
    public readonly radius

    constructor(public readonly h: number, public readonly w: number, private requredDiameter: number, public material: THREE.material) {
        const perimenter = this.requredDiameter * Math.PI
        this.segmentWidth = w * Math.sin(this.angle) * 2
        this.countSegments = Math.round(perimenter / this.segmentWidth)

        console.log("COUNT SEGMENT", this.countSegments)
        this.itemAngle = 360 / this.countSegments
        this.radius = this.countSegments * this.segmentWidth / (Math.PI * 2)

    }

}

export function genPerimetr() {
    const assembly = new THREE.Group();

    const conf = new RingParams(12, 12, 600, blueMaterial)

    const max = 0.75
    const minus = 0.08

    const group1 = genRoundArray(conf, max, max - minus, max - minus * 2)
    assembly.add(group1);
    const group2 = genRoundArray(conf, max - minus * 3, max - minus - minus * 4, max - minus * 5)
    group2.position.y = group2.position.y + 18
    group2.rotation.y = 0.035

    // const group3 = genRoundArray(conf, max - minus * 3, max - minus - minus * 4, max - minus * 5)
    // group3.position.y = group3.position.y + 18*2
  
    // assembly.add(group3);
    return assembly
}


export function genFundament(h, w, d, mateial, levels, cancel) {
    const assembly = new THREE.Group();

    const conf = new RingParams(h, w, d, mateial)

    let current = 2.4
    const minus = 0.06



    for (let level = 0; level < levels; level++) {
        const group = genRoundArray(conf, current, current - minus, current - minus * 2)

     //   if(level>=cancel-1){

        assembly.add(level);
   // }

        current = current - minus * 3

        group.position.y = group.position.y + 18 * level
        group.rotation.y = 0.055 * level % 2

    

        console.log("CURREND DIAMETER", current)
    }


    return assembly
}

// Создаем геометрию бублика (тора) с использованием шестигранников
export function createTorusGeometry(innerRadius, outerRadius, radialSegments, tubularSegments) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    for (let j = 0; j <= tubularSegments; j++) {
        for (let i = 0; i <= radialSegments; i++) {
            const theta = (i / radialSegments) * Math.PI * 2;
            const phi = (j / tubularSegments) * Math.PI * 2;

            const x = (outerRadius + innerRadius * Math.cos(phi)) * Math.cos(theta);
            const y = (outerRadius + innerRadius * Math.cos(phi)) * Math.sin(theta);
            const z = innerRadius * Math.sin(phi);

            vertices.push(x, y, z);

            if (i < radialSegments && j < tubularSegments) {
                const first = i + (radialSegments + 1) * j;
                const second = i + (radialSegments + 1) * (j + 1);

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

 
    return geometry;
}


export function ring() {
    const assembly = new THREE.Group();

    const material = new THREE.LineBasicMaterial({ color: 0x555555 });

    const torGeopm = createTorusGeometry(6.5, 192.5, 500, 15)
    const wireframeGeometry = new THREE.WireframeGeometry(torGeopm);

 
   const tor = new THREE.LineSegments(wireframeGeometry, material);

    //   const tor =  createTorusGeometry2(2, 4, 16, 100)
    tor.rotation.x = Math.PI / 2
    tor.position.y = 190
    assembly.add(tor);
    const levels=11
   const ext = genFundament(12, 12, 400, redMaterial, levels,9);
   assembly.add(ext);
   const bl = genFundament(12, 10.4, 370, blueMaterial,levels,9)
   bl.rotation.y = 0.040
   assembly.add(bl);

    const perimetr=genPerimetr()
    perimetr.position.y = 185
    assembly.add(perimetr);

    return assembly
}



export function genSceneObjects(scene) {

    const assembly=ring();
    scene.add(assembly);
}