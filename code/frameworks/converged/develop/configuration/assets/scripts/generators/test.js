

export function generate(conf,mapping,THREE)  {
    const group = new THREE.Group();

    // Создание геометрии треугольника
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0.0, 0.0, 0.0,  // Вершина 1
        10.0, 0.0, 0.0,  // Вершина 2
        0.0, 10.0, 0.0   // Вершина 3
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  // geometry.rotateX(Math.PI / 2);

    // Создание материала и меша треугольника
   
    const triangle = new THREE.Mesh(geometry, mapping.MATERIALS["wf"]);
    triangle.position.set(0, 0, 0);  // Убедитесь, что треугольник находится в поле зрения камеры
    group.add(triangle);

 

    return group;
};