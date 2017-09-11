window.onload = function() {
var audioFile = document.querySelector('#audioFile');
var canvas = document.querySelector('#oscilloscope');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasCtx = canvas.getContext('2d');


// var audioPlayer = document.querySelector('#audio');

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

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    canvasCtx.clearRect(0,0,WIDTH,HEIGHT)

    var scene = new THREE.Scene()

    function drawVocal(){
        drawVisual = requestAnimationFrame(drawVocal);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0,0,WIDTH,HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0,0,0)';

        canvasCtx.beginPath()

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++){
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;
            if(i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
    }

    drawVocal()
}

}

/* 

var fileName = document.querySelector('input[name="newAudioFile"]').files[0].name

*/