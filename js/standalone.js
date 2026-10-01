import { mountMusicVisualizer } from './main.js';
document.body.style.height = "100vh";
mountMusicVisualizer(document.body, { THREE: window.THREE, dat: window.dat, firebase: window.firebase });
