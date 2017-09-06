window.onload = function() {
var audioFile = document.querySelector('#audioFile');
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

    
}

}

/* 

var fileName = document.querySelector('input[name="newAudioFile"]').files[0].name

*/