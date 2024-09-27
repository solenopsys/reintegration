export function layout (
	object,
	conf,mapping,THREE
)  {
	const group = new THREE.Group();


	for (let i = 0; i < conf.count; i++) {
		const cloned = object.clone();
		cloned.position.x = i * conf.gap;
		group.add(cloned);
	}

	return group;
};
