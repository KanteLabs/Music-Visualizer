//3 main important things for 3JS, a scene, camera, and renderer. -> render the scene with a camera
var scene = new THREE.Scene(); //new scene instance
//new camera type which is a PerspectiveCamera(setsFieldOfView, aspectRatio(widthOfElement/HeightOfElement), nearClipping, farClipping)
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight); //or (window.innerWidth/2, Window.innerHeight/2, false) to set a smaller a resolution 
document.body.appendChild(renderer.domElement) //adds renderer to the DOM

//Code for Cube shape, and design
var geometry = new THREE.BoxGeometry( 1, 1, 1) //BoxGeometry is a build in method for all the basic values of a cube
var material = new THREE.MeshBasicMaterial({color: 0x00ff00}) //provides material to color cube
var cube = new THREE.Mesh(geometry, material) //Mesh is an object that takes a geometry and adds a material to it, which is insert into a scene
scene.add(cube)

camera.position.z = 5;

function animate(){
    requestAnimationFrame(animate) //better than set interval because it pauses when user leaves the page
    cube.rotation.x += 0.01; //controls the x rotation speed
    cube.rotation.y += 0.01; //controls the y rotation speed
    renderer.render(scene, camera)
}
animate() //gets called 60x per sec to render scene