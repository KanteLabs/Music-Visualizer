var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var previousSearches = []
var source;
var gui = new dat.GUI({
    height: 5  * 32 - 1,
})
var defaultSong = "https://firebasestorage.googleapis.com/v0/b/kantelabs-threejs.appspot.com/o/03%20-%20Smooth%20Operator.mp3?alt=media&token=27e95f4c-b4fb-4160-9bdc-02833cf65a84";

window.onload = function() {
    var fileUpload = document.querySelector('#audioFile'); //Grabs the file input and stores it in an variable
    var prevSongs = document.querySelector('#prevSongs');
    var form = document.querySelector('form');
    var storageRef = firebase.storage().ref();
    var dbRoot = firebase.database().ref();
    var songsRef = dbRoot.child('songs')
    
    //Searches for and loads previous songs uploaded to firebase
    songsRef.on('child_added', snapshot=>{
        previousSearches.push([ snapshot.key, snapshot.val() ])
        return previousSearches
    })

    setTimeout(loadPrevSongs, 1000)

    function loadPrevSongs() {
        var audioPlayer = new Audio(defaultSong)
        audioPlayer.crossOrigin = "anonymous";
        addAudioPlayer(audioPlayer);
        
        previousSearches.map((song, i)=>{
            console.log(song[0], song[1])
            let currSongLi = document.createElement(`li`)
            let currSongP = document.createElement(`p`)
            let songTitle = document.createTextNode(song[0])
            currSongP.appendChild(songTitle)
            currSongP.dataset.name=(song[1])
            currSongLi.appendChild(currSongP)
            prevSongs.appendChild(currSongLi)
            currSongLi.addEventListener("click", firebaseSong)
        })
    }

    function firebaseSong(e) { 
        console.log(e.target.dataset.name)
        let firebaseURL = e.target.dataset.name;
        var audioPlayer = new Audio(firebaseURL)
        audioPlayer.crossOrigin = "anonymous";
        
        addAudioPlayer(audioPlayer);
    }
    
    fileUpload.onchange = (event) => {
        audioFile = event.target.files;
        var songName = audioFile[0].name;

        //Uploads Song to firebase
        var songRef = storageRef.child(songName)
        songRef.put(audioFile[0]).then(function(snapshot){
            let dlUrl = snapshot.downloadURL;
            databaseRef = firebase.database().ref().child('songs').child(songName.split('.').slice(0, 1).join(' '))
            databaseRef.set(dlUrl)
            console.log("uploaded song");
        })
        .then(res=>(console.log(res)))
        .catch(err=>console.log(err))
        
        //Creates a temporary url for the file that was uploaded so that it could be played the audio element 
        var audioPlayer = new Audio(URL.createObjectURL(audioFile[0]))
        audioPlayer.crossOrigin = "anonymous";
        addAudioPlayer(audioPlayer);
    }

    function addAudioPlayer(audioPlayer){
        var audioDiv = document.querySelector('.audio-container');
        //Prevents local memory of audio files so you can create a new instance on upload
        audioDiv.firstChild !== null ? (audioDiv.firstElementChild.remove(), (audioDiv.appendChild(audioPlayer))) : audioDiv.appendChild(audioPlayer);
        audioPlayer.controls = true;
        audioPlayer.load(); 

        analyzeAudio(audioPlayer);
    }
}

function analyzeAudio(audioPlayer) {
    // AnalyserNode is necessary to provide real-time frequency and time-domain analysis information. It is an AudioNode that passes the audio stream unchanged from the input to the output, but allows you to take the generated data, process it, and create audio visualizations.
    source = audioCtx.createMediaElementSource(audioPlayer) // Uploaded audio becomes the source for the media stream
    source.connect(analyser)
    analyser.connect(audioCtx.destination)

    analyser.fftSize = 256; // 256 for analyser.getByteFrequencyData(dataArray) and 2048 for analyser.getByteTimeDomainData(dataArray)
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength)
    console.log(bufferLength)

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
    controls.autoRotate = true;

    gui.destroy()

    gui = new dat.GUI({
        height: 5  * 32 - 1,
    })
    
    var f1 = gui.addFolder('Camera')
    f1.add( controls , 'autoRotate', false, true )
    f1.add( controls , 'autoRotateSpeed', 0, 10 ).step(0.5)
    f1.add( camera.position , 'x', -500, 500 ).step(5)
    f1.add( camera.position , 'y', -500, 500 ).step(5)
    f1.add( camera.position , 'z', -500, 500 ).step(5)
    f1.open()
    

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
    var asteroidGeometry = new THREE.TetrahedronGeometry((Math.random() + 0.5 ), 2);
    var asteroidMaterial = new THREE.MeshPhongMaterial({ 
        color: (Math.random() * 0xffffff), 
        flatShading: true 
    });

    var i = 0;
    for(var x = 0; x < 1; x++){
        var j = 0;
        asteroidMesh[i] = new Array();
        for(var y = 0; y < 1000; y++){
            asteroidMesh[i][j] = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            asteroidMesh[i][j].position.x = ( Math.random() - 0.5 ) * 300;
            asteroidMesh[i][j].position.y = ( Math.random() - 0.5 ) * 300;
            asteroidMesh[i][j].position.z = ( Math.random() - 0.5 ) * 300;
            asteroidMesh[i][j].scale.z = (Math.random() * 2, Math.random() * 2, Math.random() * 2);
            asteroidMesh[i][j].rotation.set(Math.random() * 4, Math.random() * 4, Math.random() * 4)
            scene.add(asteroidMesh[x][j])
            j++;
        }
        i++;
    }

    function animate(){        
        requestAnimationFrame(animate) //better than set interval because it pauses when user leaves the page
        analyser.getByteFrequencyData(dataArray)
        controls.update();  

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
                asteroidMesh[i][j].rotation.z += 0.02;
            }
        }
        renderer.render(scene, camera)
    }
    animate() //gets called 60x per sec to render scene
}
