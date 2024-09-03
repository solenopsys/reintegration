

/**
 * @typedef {Object} ConcreteTileConfig
 * @property {number} radius
 */

/**
 * Generates a 3D object group containing a cylindrical tile with specified radius.
 * @type {GenFunction<any>}
 * @param {ConcreteTileConfig} conf - The configuration object for the cylindrical tile.
 * @returns {THREE.Group} - The group containing the generated tile.
 */

export function generate(conf, mapping,THREE) {
	const group = new THREE.Group();
	const geometry = new THREE.CylinderGeometry(conf.radius, conf.radius, 2, 6);
	// Rotate geometry around the x-axis by 90 degrees
	geometry.rotateX(Math.PI / 2);
	const tile = new THREE.Mesh(geometry, mapping.MATERIALS["mesh"]);
	group.add(tile);
	return group;
}
