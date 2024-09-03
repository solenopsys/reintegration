

export function generate  (conf,mapping,THREE) {
    const geometry = new THREE.BufferGeometry();
   const edgeLength = conf.edgeLength;
    const sphereRadius = conf.sphereRadius;
    const n = conf.n;

   // // Рассчитываем высоту шестиугольника
    const hexHeight = Math.sqrt(3) * edgeLength;

   // // Создаем базовую шестиугольную плоскость
    const hexPoints = [];
   for (let i = 0; i < 6; i++) {
       const angle = (i / 6) * Math.PI * 2;
       hexPoints.push(
           new THREE.Vector3(
               Math.cos(angle) * edgeLength,
               Math.sin(angle) * edgeLength,
               0,
           ),
       );
   }

//	const vertices = [];

   // // Делим каждое ребро на n частей и вычисляем точки на сфере
   // for (let i = 0; i < 6; i++) {
   // 	const p1 = hexPoints[i];
   // 	const p2 = hexPoints[(i + 1) % 6];
   // 	for (let j = 0; j <= n; j++) {
   // 		const t = j / n;
   // 		const x = THREE.MathUtils.lerp(p1.x, p2.x, t);
   // 		const y = THREE.MathUtils.lerp(p1.y, p2.y, t);
   // 		const z = Math.sqrt(sphereRadius * sphereRadius - x * x - y * y); // Z-coordinate on the sphere
   // 		vertices.push(x, y, z);
   // 	}
   // }

   // const indices = [];

   // // Создаем поверхности на основе вершин
   // for (let i = 0; i < 6; i++) {
   // 	const baseIndex = i * (n + 1);
   // 	for (let j = 0; j < n; j++) {
   // 		const a = baseIndex + j;
   // 		const b = baseIndex + j + 1;
   // 		const c = ((baseIndex + (n + 1)) % (6 * (n + 1))) + j + 1;
   // 		const d = ((baseIndex + (n + 1)) % (6 * (n + 1))) + j;
   // 		indices.push(a, b, c);
   // 		indices.push(a, c, d);
   // 	}
   // }

   // geometry.setIndex(indices);
   // geometry.setAttribute(
   // 	"position",
   // 	new THREE.Float32BufferAttribute(vertices, 3),
   // );
   // geometry.computeVertexNormals();
   // geometry.computeBoundingBox(); // Вычисление boundingBox

   // console.log(geometry.boundingBox); // Теперь boundingBox не должен быть null

   // const material =  MATERIALS["wf"]; // Изменено на wireframe для проверки
   // const mesh = new THREE.Mesh(geometry, material);
   // mesh.position.set(0, 0, 0);
   // mesh.rotation.x = Math.PI / 2;

   const group = new THREE.Group();

   // Создание геометрии треугольника

//    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
 // geometry.rotateX(Math.PI / 2);

   // Создание материала и меша треугольника
  
//   const triangle = new THREE.Mesh(geometry, MATERIALS["wf"]);
 //  triangle.position.set(0, 0, 0);  // Убедитесь, что треугольник находится в поле зрения камеры
//   group.add(triangle);


   return group;
};