# Music Visualizer
User's can either upload a song or choose one that has been uploaded by other users and then see the visualizations for it on their screen. 

### Bars - Main Visualizer
![Bars](/assets/visual1_zoom.png)
### Experimental Web Visualizer
![Web](/assets/visual2_zoom.png)

### Sample Code
This sample code was how I generated the random floating shapes around the scene.
 
```javascript
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
```
## Main Features
- User can upload a track and see a 2d visualization [x]
- Can generate a basic shape in the canvas [x]
- create at least 3 different scenes []
  - cubes [x]
  - web [x]
  - matrix []
  - abstract []
- Can generate an array of random shapes as a matrix [x]
- camera functions [x]
- have features of shape determined by song data[x]
  - color [x]
  - size [x]
- controls option to change certain things
  - camera rotation []
  - different shapes [] 
  - shape color []
  - shape size []
- option to choose different scenes []

## Tech/Tools
  - Three.js with WebGL
  - VR options for Google Cardboard(bonus)
  - Optional Aframe
  - Geometry & Trigonometry
  - save song history to firebase[x]
  