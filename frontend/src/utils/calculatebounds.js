export const getBounds = (route) => {
    let minLng = route[0][0];
    let maxLng = route[0][0];
    let minLat = route[0][1];
    let maxLat = route[0][1];

    route.forEach(point => {
        if (point[0] < minLng) minLng = point[0];
        if (point[0] > maxLng) maxLng = point[0];
        if (point[1] < minLat) minLat = point[1];
        if (point[1] > maxLat) maxLat = point[1];
    });

    return [[minLng, minLat], [maxLng, maxLat]];
}

// route = [
//     [72.97553, 19.1868],
//     [72.9755, 19.1868],
//     [72.97544, 19.18686],
//     [72.97542, 19.1869],
//     [72.97541, 19.18693],
//     [72.97379, 19.18684],
//     [72.97352, 19.18684],
//     [72.97309, 19.18699],
//     [72.97304, 19.18704],
//     [72.97297, 19.1871],
//     [72.97283, 19.18749],
//     [72.97302, 19.18763],
//     [72.97305, 19.18767],
//     ...
// ]