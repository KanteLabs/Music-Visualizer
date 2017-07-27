//3 main important things for 3JS, a scene, camera, and renderer. -> render the scene with a camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, Window.innerHeight);
document.body.appendChild(renderer.domElement)