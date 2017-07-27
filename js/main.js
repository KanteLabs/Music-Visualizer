//3 main important things for 3JS, a scene, camera, and renderer. -> render the scene with a camera
const scene = new THREE.Scene(); //new scene instance
//new camera type which is a PerspectiveCamera(setsFieldOfView, aspectRatio(widthOfElement/HeightOfElement), nearClipping, farClipping)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, Window.innerHeight); //or (window.innerWidth/2, Window.innerHeight/2, false) to set a smaller a resolution 
document.body.appendChild(renderer.domElement) //adds renderer to the DOM

//Code for Cube shape, and design
const geometry = new THREE.BoxGeometry(1, 1, 1) //BoxGeometry is a build in method for all the basic values of a cube
const material = new THREE.MeshBasicMaterial({color: 0x00ff00}) //provides material to color cube
const cube = new THREE.Mesh(geometry, material) //Mesh is an object that takes a geometry and adds a material to it, which is insert into a scene
scene.add(cube)

camera.position.z = 5;

function animate(){
    requestAnimationFrame(animate) //better than set interval because it pauses when user leaves the page
    renderer.render(scene, camera)
}
animate() //gets called 60x per sec to render scene