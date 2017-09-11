window.onload = function() {
    var audioFile = document.querySelector('#audioFile');
    // var canvas = document.querySelector('#oscilloscope');
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // var canvasCtx = canvas.getContext('2d');
    
    audioFile.onchange = (event) =>{
        
        audioFile = event.target.files;
        var songName = audioFile[0].name;
        console.log(`Now playing ${audioFile[0].name}`)
        
        //Creates a temporary url for the file input in this case the audio that is being uploaded
        // audioPlayer.src = URL.createObjectURL(audioFile[0])
        audioPlayer = new Audio(URL.createObjectURL(audioFile[0]))
        var audioDiv = document.querySelector('.audio-container');
        
        //Prevents local memory of audio files so you can create a new instance on upload
        audioDiv.firstChild !== null ? (audioDiv.firstElementChild.remove(), (audioDiv.appendChild(audioPlayer))) : audioDiv.appendChild(audioPlayer);
        audioPlayer.load(), audioPlayer.play(), audioPlayer.controls = true;
        
        // AnalyserNode is necessary to provide real-time frequency and time-domain analysis information. It is an AudioNode that passes the audio stream unchanged from the input to the output, but allows you to take the generated data, process it, and create audio visualizations.
        var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        var analyser = audioCtx.createAnalyser();
        
        source = audioCtx.createMediaElementSource(audioPlayer) // Uploaded audio becomes the source for the media stream
        source.connect(analyser)
        analyser.connect(audioCtx.destination)
        console.log(analyser.connect(audioCtx.destination))
    
        analyser.fftSize = 1024; // 256 or 2048
        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength)
        var dataArray = new Uint8Array(bufferLength)
    
        // var WIDTH = canvas.width;
        // var HEIGHT = canvas.height;
        // canvasCtx.clearRect(0,0,WIDTH,HEIGHT)

        //3 main important things for 3JS, a scene, camera, and renderer. -> render the scene with a camera
        var scene = new THREE.Scene(); //new scene instance
        var cubes = new Array();
        //new camera type which is a PerspectiveCamera(setsFieldOfView, aspectRatio(widthOfElement/HeightOfElement), nearClipping, farClipping)
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight); //or (window.innerWidth/2, Window.innerHeight/2, false) to set a smaller a resolution 
        document.body.appendChild(renderer.domElement) //adds renderer to the DOM
        var i = 0;
        for(var x = 0; x < 30; x += 2){
            var j = 0;
            cubes[i] = new Array();
            for(var y = 0; y < 30; y += 2){
                var geometry = new THREE.CubeGeometry( 1.5, 1.5, 1.5) //BoxGeometry is a build in method for all the basic values of a cube
                var material = new THREE.MeshPhongMaterial({
                    color: (Math.random() * 0xffffff),
                    ambient: 0x808080,
                    specular: 0xffffff,
                    shininess: 20,
                    reflectivity: 5.5
                });
            }
        }
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

        // function drawVocal(){
        //     drawVisual = requestAnimationFrame(drawVocal);
        //     analyser.getByteTimeDomainData(dataArray);
    
        //     canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        //     canvasCtx.fillRect(0,0,WIDTH,HEIGHT);
    
        //     canvasCtx.lineWidth = 2;
        //     canvasCtx.strokeStyle = 'rgb(0,0,0)';
    
        //     canvasCtx.beginPath()
    
        //     var sliceWidth = WIDTH * 1.0 / bufferLength;
        //     var x = 0;
    
        //     for(var i = 0; i < bufferLength; i++){
        //         var v = dataArray[i] / 128.0;
        //         var y = v * HEIGHT/2;
        //         if(i === 0) {
        //           canvasCtx.moveTo(x, y);
        //         } else {
        //           canvasCtx.lineTo(x, y);
        //         }
        //         x += sliceWidth;
        //     }
    
        //     canvasCtx.lineTo(canvas.width, canvas.height/2);
        //     canvasCtx.stroke();
        // }
    
        // drawVocal()
    }
    
    }
    
    /* 
    
    var fileName = document.querySelector('input[name="newAudioFile"]').files[0].name
    
    */