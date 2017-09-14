var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var source;

window.onload = function() {
    var fileUpload = document.querySelector('#audioFile'); //Grabs the file input and stores it in an variable

    fileUpload.onchange = (event) => {
        audioFile = event.target.files;
        var songName = audioFile[0].name;
        console.log(`Now playing ${songName}`)
        
        //Creates a temporary url for the file that was uploaded so that it could be played the audio element 
        var audioPlayer = new Audio(URL.createObjectURL(audioFile[0]))
        var audioDiv = document.querySelector('.audio-container');
        
        //Prevents local memory of audio files so you can create a new instance on upload
        audioDiv.firstChild !== null ? (audioDiv.firstElementChild.remove(), (audioDiv.appendChild(audioPlayer))) : audioDiv.appendChild(audioPlayer);
        audioPlayer.controls = true;
        audioPlayer.load(); 
        /*audioPlayer.play(),*/ 
        
        analyzeAudio(audioPlayer);
    }
}

analyzeAudio = (audioPlayer) => {
    console.log(`Received ${audioPlayer}`)
    // AnalyserNode is necessary to provide real-time frequency and time-domain analysis information. It is an AudioNode that passes the audio stream unchanged from the input to the output, but allows you to take the generated data, process it, and create audio visualizations.
    
    source = audioCtx.createMediaElementSource(audioPlayer) // Uploaded audio becomes the source for the media stream
    source.connect(analyser)
    analyser.connect(audioCtx.destination)

    analyser.fftSize = 256; // 256 for analyser.getByteFrequencyData(dataArray) and 2048 for analyser.getByteTimeDomainData(dataArray)
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength)
    var dataArray = new Uint8Array(bufferLength)

    //Scene Details
    var scene = new THREE.Scene(); //new scene instance
    scene.background = new THREE.Color( 0x000000);
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.querySelector('canvas') != undefined ? (document.querySelector('canvas').remove(), document.body.appendChild(renderer.domElement)) : document.body.appendChild(renderer.domElement)

    //Lighting Details
    var light = new THREE.AmbientLight(0x505050);
    scene.add(light);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);
    
    
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, -1, -1);
    scene.add(directionalLight);
    
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-1, -1, 0);
    scene.add(directionalLight);

    //Camera Details
    var camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 1, 1000 );
    camera.position.x = 32;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    //Controls Details
    var controls;
    controls = new THREE.OrbitControls(camera);
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.5;
    controls.update();    

    //Cubes Details
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

    //BackgroundShapes Details
    var asteroidMesh = new Array()
    var asteroidGeometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
    var asteroidMaterial = new THREE.MeshPhongMaterial( { color: (Math.random() * 0xffffff), flatShading: false } );

    var i = 0;
    for(var x = 0; x < 100; x++){
        var j = 0;
        asteroidMesh[i] = new Array();
        for(var y = 0; y < 100; y+=2){
            asteroidMesh[i][j] = new THREE.Mesh(cubeGeometry, cubeMaterial);
            asteroidMesh[i][j].position.x = ( Math.random() - 0.5 ) * 100;
            asteroidMesh[i][j].position.y = ( Math.random() - 0.5 ) * 100;
            asteroidMesh[i][j].position.z = ( Math.random() - 0.5 ) * 100;
            asteroidMesh[i][j].scale.z = (Math.random() * 2, Math.random() * 2, Math.random() * 2);
            asteroidMesh[i][j].rotation.set(Math.random() * 4, Math.random() * 4, Math.random() * 4)
            scene.add(asteroidMesh[x][j])
            j++;
        }
        i++;
    }
    console.log(asteroidMesh)

    // var sphereGeo = new THREE.SphereGeometry(10, 64, 64)
    // var sphereMaterial = new THREE.MeshPhongMaterial({
    //     color: (Math.random() * 0xffffff),
    //     metalness: 1,
    //     specular: 0xffffff,
    //     shininess: 14,
    //     reflectivity: 2
    // })

    // var sphere = new THREE.Mesh(sphereGeo, sphereMaterial)
    // scene.add(sphere)

    

    function animate(){        
        requestAnimationFrame(animate) //better than set interval because it pauses when user leaves the page
        analyser.getByteFrequencyData(dataArray)

        
        var k = 0;
        for(var i = 0; i < cubes.length; i++) {
            for(var j = 0; j < cubes[i].length; j++) {
                var scale = dataArray[k] / 10;
                cubes[i][j].scale.y = (scale < 1 ? 1 : scale);
                k += (k < dataArray.length ? 1 : 0);
            }
        }
        
        var k = 0;
        for(var i = 0; i < asteroidMesh.length; i++) {
            for(var j = 0; j < asteroidMesh[i].length; j++) {
                var scale = dataArray[k] / 10;
                asteroidMesh[i][j].scale.z = (scale < 1 ? 1 : scale);
                k += (k < dataArray.length ? 1 : 0);
            }
        }
        renderer.render(scene, camera)
    }
    animate() //gets called 60x per sec to render scene
}