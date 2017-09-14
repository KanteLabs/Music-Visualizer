var webGeometry = new THREE.RingGeometry(30, 15, 8);
var webMaterial = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true
});
var webMesh = new THREE.Mesh(webGeometry, webMaterial);
scene.add(webMesh);