window.onload = function() {
var audioFile = document.querySelector('#audioFile');
var audioPlayer = document.querySelector('#audio');

// AnalyserNode is necessary to provide real-time frequency and time-domain analysis information. It is an AudioNode that passes the audio stream unchanged from the input to the output, but allows you to take the generated data, process it, and create audio visualizations.
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

updateSource=(event)=>{
    console.log(event.target.files[0].name)
    var songName = event.target.files[0].name;
    var newSource = 
}
source = audioCtx.createMediaStreamSource
}

/* 

var fileName = document.querySelector('input[name="newAudioFile"]').files[0].name

*/