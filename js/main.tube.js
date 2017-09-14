var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var source;

window.onload = function() {
    var fileUpload = document.querySelector('#audioFile'); //Grabs the file input and stores it in an variable
    var form = document.querySelector('form');
    var pickedShape = form.elements.sceneShape.value;

    fileUpload.onchange = (event) => {
        audioFile = event.target.files;
        var songName = audioFile[0].name;
        console.log(`Now playing ${songName}, with shape ${pickedShape}`)
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

    form.onchange = (event) => {
        console.log(event.target.value)
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
    window.addEventListener( 'resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }, false );

    //Controls Details
    var controls;
    controls = new THREE.OrbitControls(camera);  

    var geometry = new THREE.TorusKnotBufferGeometry( 10, 3, 100, 16 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00, flatShading: true } );
    var torusKnot = new THREE.Mesh( geometry, material );
    scene.add( torusKnot );

    function animate(){        
        console.log(torusKnot)
        requestAnimationFrame(animate) //better than set interval because it pauses when user leaves the page
        analyser.getByteFrequencyData(dataArray)
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.update();  
       
        var k = 0;
        torusKnot.scale.x = (dataArray[k] / 50 < 1 ? 1 : dataArray[k] / 50)
        torusKnot.scale.y = (dataArray[k] / 50 < 1 ? 1 : dataArray[k] / 50)
        torusKnot.scale.z = (dataArray[k] / 50 < 1 ? 1 : dataArray[k] / 50)
        for(var i = 0; i < dataArray.length; i++) {
            k += (k < dataArray.length ? 1 : 0);
        }
        renderer.render(scene, camera)
    }
    animate() //gets called 60x per sec to render scene
}