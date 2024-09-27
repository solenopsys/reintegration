

/**
 * @typedef {Object} IC
 * @property {number} width
 * @property {number} height
 * @property {number} deep
 * @property {MaterialKey} material
 */

/**
 * Generates a 3D object group containing a cube with specified dimensions and material.
 * @param {IC} conf - The configuration object for the cube.
 * @returns {THREE.Group} - The group containing the generated cube.
 */
export function generate(conf,mapping,THREE) {
	const group = new THREE.Group();
	const geometry = new THREE.BoxGeometry(conf.width, conf.height, conf.deep);
	const cube = new THREE.Mesh(geometry, mapping.MATERIALS[conf.material]);
	group.add(cube);
	return group;
}