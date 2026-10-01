# Original Music Visualizer runtime

MSFN and the standalone site execute the same `js/main.js`. Its exported `mountMusicVisualizer(container, libraries)` returns an idempotent cleanup function. `js/standalone.js` calls it for the original page; the React adapter calls it for the measured MSFN slot.

The build takes UI markup, styles, and Firebase configuration directly from `index.html` and the existing CSS. It bundles the repository's original Three.js, OrbitControls and dat.GUI files. The visualizer's cube loops, frequency cursor, camera, lights, material, asteroids, default song, previous-song library, and Firebase upload path remain original. There is no second scene implementation and no iframe.

Integration changes are scoped selectors, container resizing, explicit mount, and disposal of audio, RAF, renderer, controls, Firebase listeners, pending uploads and local URLs. Existing Firebase availability and storage rules still determine whether cloud songs/uploads work. Selecting a file retains the original behavior of uploading it to the shared Firebase library.

Build: `node build.cjs`. Tests: `node --test lifecycle.test.mjs`. The lifecycle test executes the actual application source with mocked browser services, checking original scene behavior and three mount/eject cycles. Standalone: serve the repository over HTTP and open `index.html`.
