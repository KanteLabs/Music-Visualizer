function createCubes(){
    var cubes = new Array();
    var cubeGeometry = new THREE.CubeGeometry( 1.5, 1.5, 1.5)
    var cubeMaterial = new THREE.MeshPhongMaterial({
        color: (Math.random() * 0xffffff),
        flatShading: false,
        specular: 0xffffff,
        shininess: 14,
        reflectivity: 2,
        fog: false
    });

    var i = 0;
    for(var x = 0; x <= 256; x += 2){
        var j = 0;
        cubes[i] = new Array();
        for(var y = 0; y <= 62; y += 2){
            cubes[i][j] = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubes[i][j].position.x = (y-30);
            cubes[i][j].position.y = (0);
            cubes[i][j].position.z = (x);
            scene.add(cubes[i][j])
            j++;
        }
        i++;
    }
}