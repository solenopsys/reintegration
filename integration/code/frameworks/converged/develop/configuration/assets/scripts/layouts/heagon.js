function calculateHexagons(layers) {
    if (layers < 0) {
        return 0;
    }

    let totalHexagons = 1; // Центральный шестигранник
    for (let i = 1; i <= layers; i++) {
        totalHexagons += 6 * i;
    }

    return totalHexagons;
}


export function layout  (object, conf,mapping,THREE)  {
    const count=calculateHexagons(conf.layers);
    console.log("COUNT",count);
    const group = new THREE.Group();

    const directions = [
        new THREE.Vector2(1, 0), // Восток
        new THREE.Vector2(0.5, Math.sqrt(3) / 2), // Северо-восток
        new THREE.Vector2(-0.5, Math.sqrt(3) / 2), // Северо-запад
        new THREE.Vector2(-1, 0), // Запад
        new THREE.Vector2(-0.5, -Math.sqrt(3) / 2), // Юго-запад
        new THREE.Vector2(0.5, -Math.sqrt(3) / 2) // Юго-восток
    ];

    const placeHexagon = (x, y) => {
        const cloned = object.clone();
        cloned.position.set(x, y, 0);
        group.add(cloned);
    };

    placeHexagon(0, 0); // Центральный шестигранник

    let layer = 1;
    let placed = 1;

    while (placed < count) {
        let x = layer * directions[4].x * conf.gap;
        let y = layer * directions[4].y * conf.gap;

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < layer; j++) {
                if (placed >= count) break;

                placeHexagon(x, y);

                x += directions[i].x * conf.gap;
                y += directions[i].y * conf.gap;
                placed++;
            }
        }

        layer++;
    }

    return group;
};