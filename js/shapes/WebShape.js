var webGeometry = new THREE.RingGeometry(30, 15, 8);
var webMaterial = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
    side: THREE.DoubleSide
});
var webMesh = new THREE.Mesh(webGeometry, webMaterial);
scene.add(mesh);