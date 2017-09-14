var webGeometry = new THREE.RingGeometry(30, 15, 8);
var webMaterial = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true
});
var webMesh = new THREE.Mesh(webGeometry, webMaterial);
scene.add(webMesh);

var webGeometry = new THREE.RingGeometry(30, 15, 8);
var webMaterial = new THREE.WireframeGeometry({
    geometry,
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true,
});
var webMesh = new THREE.LineSegments(webMaterial);
webMesh.material.depthTest = false;
webMesh.material.opacity = 0.25;
webMesh.material.transparent = true;
scene.add(webMesh);

var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
var material = new THREE.WireframeGeometry( geometry );
var torusKnot = new THREE.LineSegments( material );
torusKnot.material.depthTest = false;
torusKnot.material.opacity = 0.25;
torusKnot.material.transparent = true;
scene.add( torusKnot );