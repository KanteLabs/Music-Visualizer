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
    
        analyser.fftSize = 256; // 256 or 2048
        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength)
        var dataArray = new Uint8Array(bufferLength)

        //3 main important things for 3JS, a scene, camera, and renderer. -> render the scene with a camera
        var scene = new THREE.Scene(); //new scene instance
        scene.background = new THREE.Color( 0x000000);
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        var cubes = new Array();
        var camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 1, 1000 );
        camera.position.x = 32;
        camera.position.y = 50;
        camera.position.z = 50;
        var controls;

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight); //or (window.innerWidth/2, Window.innerHeight/2, false) to set a smaller a resolution 
        document.querySelector('canvas') != undefined ? (document.querySelector('canvas').remove(), document.body.appendChild(renderer.domElement)) : document.body.appendChild(renderer.domElement) //adds renderer to the DOM

        var cubeGeometry = new THREE.CubeGeometry( 1.5, 1.5, 1.5) //BoxGeometry is a build in method for all the basic values of a cube
        var cubeMaterial = new THREE.MeshPhongMaterial({
            color: (Math.random() * 0xffffff),
            flatShading: true,
            specular: 0xffffff,
            shininess: 14,
            reflectivity: 2,
            fog: false,
            morphTargets: true
        });

        var i = 0;
        for(var x = 0; x <= 256; x += 2){
            var j = 0;
            cubes[i] = new Array();
            for(var y = 0; y <= 62; y += 2){
                cubes[i][j] = new THREE.Mesh(cubeGeometry, cubeMaterial); //Mesh is an object that takes a geometry and adds a material to it, which is insert into a scene
                cubes[i][j].position.x = (y);
                cubes[i][j].position.y = (0);
                cubes[i][j].position.z = (x);
                // cubes[i][j].position.z = (Math.random() * (100 - 0) + 0);
                scene.add(cubes[i][j])
                j++;
            }
            i++;
        }

        var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
        var material = new THREE.MeshPhongMaterial( { color: (Math.random() * 0xffffff), flatShading: true } );

        for ( var i = 0; i < 500; i ++ ) {

            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = ( Math.random() - 0.5 ) * 1000;
            mesh.position.y = ( Math.random() - 0.5 ) * 1000;
            mesh.position.z = ( Math.random() - 0.5 ) * 1000;
            mesh.scale.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
            mesh.rotation.set(Math.random() * 4, Math.random() * 4, Math.random() * 4)
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            scene.add( mesh );

        }

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

        controls = new THREE.OrbitControls(camera);        
        function animate(){
            // controls.autoRotate = true;
            // controls.autoRotateSpeed = 0.5;
            controls.update();            
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
            renderer.render(scene, camera)
        }
        animate() //gets called 60x per sec to render scene
    }
    
    }