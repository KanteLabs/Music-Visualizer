// The standalone page and MSFN execute this same application source.
export function mountMusicVisualizer(container, { THREE, dat, firebase }) {
var disposed = false;
var disposeScene = function () {};
var releaseUnlock = function () {};
var currentAudio;
var songsRef;
var songsTimer;
var ownedUrls = [];
var uploads = [];
function createGui() {
    var panel = new dat.GUI({ height: 5 * 32 - 1, autoPlace: false, hideable: false });
    panel.domElement.style.cssText = 'position:absolute;right:0;top:0;z-index:99999';
    container.appendChild(panel.domElement);
    return panel;
}
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var previousSearches = []
var source;
var gui = createGui()
var defaultSong = "https://firebasestorage.googleapis.com/v0/b/kantelabs-threejs.appspot.com/o/03%20-%20Smooth%20Operator.mp3?alt=media&token=27e95f4c-b4fb-4160-9bdc-02833cf65a84";

function start() {
    var fileUpload = container.querySelector('#audioFile'); //Grabs the file input and stores it in an variable
    var prevSongs = container.querySelector('#prevSongs');
    var storageRef = firebase.storage().ref();
    var dbRoot = firebase.database().ref();
    songsRef = dbRoot.child('songs');
    var audioDiv = container.querySelector('.audio-container');
    var audioPlayer = new Audio(defaultSong)
    audioPlayer.crossOrigin = "anonymous";
    addAudioPlayer(audioPlayer);

    releaseUnlock = unlockAudioContext(audioCtx);


    //Searches for and loads previous songs uploaded to firebase
    songsRef.on('child_added', snapshot => {
        previousSearches.push([snapshot.key, snapshot.val()])
        return previousSearches
    })

    songsTimer = setTimeout(loadPrevSongs, 1000)

    function loadPrevSongs() {
        previousSearches.map((song, i) => {
            let currSongLi = document.createElement(`li`)
            let currSongP = document.createElement(`p`)
            let songTitle = document.createTextNode(song[0])
            currSongP.appendChild(songTitle)
            currSongP.dataset.name = (song[1])
            currSongLi.appendChild(currSongP)
            prevSongs.appendChild(currSongLi)
            currSongLi.addEventListener("click", firebaseSong)
        })
    }

    function firebaseSong(e) {
        console.log(e.target.dataset.name)
        let firebaseURL = e.target.dataset.name;
        let audioPlayer = container.querySelector('audio');
        audioPlayer.src = firebaseURL;
    }

    fileUpload.onchange = (event) => {
        var audioFile = event.target.files;
        if (!audioFile.length) return;
        var songName = audioFile[0].name;

        //Uploads Song to firebase
        var songRef = storageRef.child(songName)
        var upload = songRef.put(audioFile[0]);
        uploads.push(upload);
        upload.then(function (snapshot) {
            if (disposed) return;
            let dlUrl = snapshot.downloadURL;
            var databaseRef = firebase.database().ref().child('songs').child(songName.split('.').slice(0, 1).join(' '))
            databaseRef.set(dlUrl)
            console.log("uploaded song");
        })
            .then(res => (console.log(res)))
            .catch(err => console.log(err))

        //Creates a temporary url for the file that was uploaded so that it could be played the audio element
        var localUrl = URL.createObjectURL(audioFile[0]);
        ownedUrls.push(localUrl);
        var audioPlayer = new Audio(localUrl)
        audioPlayer.crossOrigin = "anonymous";
        addAudioPlayer(audioPlayer);
    }

    function addAudioPlayer(audioPlayer) {
        if (currentAudio) { currentAudio.pause(); currentAudio.removeAttribute("src"); currentAudio.load(); }
        currentAudio = audioPlayer;
        audioPlayer.onplay = () => { void audioCtx.resume().catch(console.warn); };
        //Prevents local memory of audio files so you can create a new instance on upload
        audioDiv.firstChild !== null ? (audioDiv.firstElementChild.remove(), (audioDiv.appendChild(audioPlayer))) : audioDiv.appendChild(audioPlayer);
        audioPlayer.controls = true;
        // audioPlayer.load();

        analyzeAudio(audioPlayer);
    }
}

function analyzeAudio(audioPlayer) {
    disposeScene();
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
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

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
    var camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.x = 32;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    var observer = new ResizeObserver(function () {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);

    });
    observer.observe(container);

    //Controls Details
    var controls;
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = false;

    gui.destroy();
    gui.domElement.remove();

    gui = createGui()

    var f1 = gui.addFolder('Camera')
    f1.add(controls, 'autoRotate', false, true)
    f1.add(controls, 'autoRotateSpeed', 0, 10).step(0.5)
    f1.add(camera.position, 'x', -500, 500).step(5)
    f1.add(camera.position, 'y', -500, 500).step(5)
    f1.add(camera.position, 'z', -500, 500).step(5)
    f1.open()


    //Cubes Details
    var cubes = new Array();
    var cubeGeometry = new THREE.CubeGeometry(1.5, 1.5, 1.5)
    var cubeMaterial = new THREE.MeshPhongMaterial({
        color: (Math.random() * 0xffffff),
        flatShading: false,
        specular: 0xffffff,
        shininess: 14,
        reflectivity: 2,
        fog: false
    });

    var i = 0;
    for (var x = 0; x <= 256; x += 2) {
        var j = 0;
        cubes[i] = new Array();
        for (var y = 0; y <= 62; y += 2) {
            cubes[i][j] = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubes[i][j].position.x = (y - 30);
            cubes[i][j].position.y = (0);
            cubes[i][j].position.z = (x);
            scene.add(cubes[i][j])
            j++;
        }
        i++;
    }

    //BackgroundShapes Details
    var asteroidMesh = new Array()
    var asteroidGeometry = new THREE.TetrahedronGeometry((Math.random() + 0.5), 2);
    var asteroidMaterial = new THREE.MeshPhongMaterial({
        color: (Math.random() * 0xffffff),
        flatShading: true
    });

    var i = 0;
    for (var x = 0; x < 1; x++) {
        var j = 0;
        asteroidMesh[i] = new Array();
        for (var y = 0; y < 1000; y++) {
            asteroidMesh[i][j] = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            asteroidMesh[i][j].position.x = (Math.random() - 0.5) * 300;
            asteroidMesh[i][j].position.y = (Math.random() - 0.5) * 300;
            asteroidMesh[i][j].position.z = (Math.random() - 0.5) * 300;
            asteroidMesh[i][j].scale.z = (Math.random() * 2, Math.random() * 2, Math.random() * 2);
            asteroidMesh[i][j].rotation.set(Math.random() * 4, Math.random() * 4, Math.random() * 4)
            scene.add(asteroidMesh[x][j])
            j++;
        }
        i++;
    }

    var frame;
    var stopped = false;
    disposeScene = function () {
        stopped = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        source.disconnect();
        var geometries = new Set(), materials = new Set();
        scene.traverse(function (object) {
            if (object.geometry) geometries.add(object.geometry);
            if (object.material) materials.add(object.material);
        });
        geometries.forEach(value => value.dispose());
        materials.forEach(value => value.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
    };
    function animate() {
        if (stopped) return;
        frame = requestAnimationFrame(animate) //better than set interval because it pauses when user leaves the page
        analyser.getByteFrequencyData(dataArray)
        controls.update();

        var k = 0;
        for (var i = 0; i < cubes.length; i++) {
            for (var j = 0; j < cubes[i].length; j++) {
                var scale = dataArray[k] / 10;
                cubes[i][j].scale.y = (scale < 1 ? 1 : scale);
                k += (k < dataArray.length ? 1 : 0);
            }
        }

        var k = 0;
        for (var i = 0; i < asteroidMesh.length; i++) {
            for (var j = 0; j < asteroidMesh[i].length; j++) {
                asteroidMesh[i][j].rotation.z += 0.02;
            }
        }
        renderer.render(scene, camera)
    }
    animate() //gets called 60x per sec to render scene
}

function unlockAudioContext(audioCtx) {
    if (audioCtx.state !== 'suspended') return function () {};
    const b = container;
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    events.forEach(e => b.addEventListener(e, unlock, false));
    function unlock() { void audioCtx.resume().then(clean).catch(console.warn); }
    function clean() { events.forEach(e => b.removeEventListener(e, unlock)); }
    return clean;
}

function dispose() {
    if (disposed) return;
    disposed = true;
    clearTimeout(songsTimer);
    songsRef?.off();
    uploads.forEach(upload => { if (upload.snapshot?.state === 'running') upload.cancel(); });
    releaseUnlock();
    disposeScene();
    gui.destroy();
    gui.domElement.remove();
    if (currentAudio) { currentAudio.onplay = null; currentAudio.pause(); currentAudio.removeAttribute('src'); currentAudio.load(); }
    analyser.disconnect();
    void audioCtx.close().catch(console.warn);
    ownedUrls.forEach(url => URL.revokeObjectURL(url));
    container.replaceChildren();
}
try { start(); } catch (error) { dispose(); throw error; }
return dispose;
}
