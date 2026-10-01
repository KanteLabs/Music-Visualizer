import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const original = await readFile(new URL('../../js/main.js', import.meta.url), 'utf8');
const { mountMusicVisualizer } = await import('data:text/javascript;base64,' + Buffer.from(original).toString('base64'));

test('the original application retains its scene algorithm and disposes repeated mounts', () => {
  const saved = new Map();
  const stub = (name,value) => { saved.set(name,globalThis[name]); globalThis[name]=value; };
  let contexts=0, closed=0, observed=0, disconnected=0, controlsDisposed=0, renderersDisposed=0, lost=0, subscriptions=0, sourceDisconnected=0;
  let nextFrame=1; const frames=new Set(); const meshes=[];
  const node=()=>({style:{},dataset:{},children:[],appendChild(child){this.children.push(child);},remove(){},addEventListener(){},removeEventListener(){}});
  class Context {
    state='suspended'; destination={};
    constructor(){contexts++;}
    createAnalyser(){return {frequencyBinCount:128,connect(){},disconnect(){},getByteFrequencyData(data){data.fill(120);}};}
    createMediaElementSource(){return {connect(){},disconnect(){sourceDisconnected++;}};}
    resume(){return Promise.resolve();}
    close(){closed++;return Promise.resolve();}
  }
  class Audio {
    constructor(src){this.src=src;}
    pause(){} removeAttribute(){} load(){}
  }
  class Object3D {
    position={x:0,y:0,z:0,set(){}}; scale={x:1,y:1,z:1}; rotation={x:0,y:0,z:0,set(){}};
    lookAt(){} updateProjectionMatrix(){}
  }
  class Mesh extends Object3D {
    constructor(geometry,material){super();this.geometry=geometry;this.material=material;meshes.push(this);}
  }
  class Resource {dispose(){}}
  const THREE={
    Scene:class {children=[];position={};add(object){this.children.push(object);}traverse(fn){this.children.forEach(fn);}},
    Color:Resource,FogExp2:Resource,AmbientLight:Object3D,DirectionalLight:Object3D,PerspectiveCamera:Object3D,
    CubeGeometry:Resource,TetrahedronGeometry:Resource,MeshPhongMaterial:Resource,Mesh,
    WebGLRenderer:class {domElement=node();setSize(){}render(){}dispose(){renderersDisposed++;}forceContextLoss(){lost++;}},
    OrbitControls:class {update(){}dispose(){controlsDisposed++;}},
  };
  const dat={GUI:class {domElement=node();destroy(){}addFolder(){return {add(){return {step(){}};},open(){}};}}};
  const songs={on(){subscriptions++;},off(){subscriptions--;}};
  const firebase={storage:()=>({ref:()=>({})}),database:()=>({ref:()=>({child:()=>songs})})};
  stub('window',{AudioContext:Context}); stub('Audio',Audio);
  stub('document',{createElement:node,createTextNode:text=>text});
  stub('requestAnimationFrame',()=>{const id=nextFrame++;frames.add(id);return id;});
  stub('cancelAnimationFrame',id=>frames.delete(id));
  stub('ResizeObserver',class {observe(){observed++;}disconnect(){disconnected++;}});
  try {
    for(let cycle=0;cycle<3;cycle++) {
      meshes.length=0;
      const audioDiv={firstChild:null,appendChild(){}};
      const input=node(), list=node();
      const container={...node(),clientWidth:900,clientHeight:600,querySelector(selector){return {'#audioFile':input,'#prevSongs':list,'.audio-container':audioDiv}[selector];},replaceChildren(){}};
      const dispose=mountMusicVisualizer(container,{THREE,dat,firebase});
      assert.equal(meshes.length,129*32+1000);
      assert.equal(meshes[0].position.x,-30);
      assert.equal(meshes[0].scale.y,12);
      assert.equal(meshes[128].scale.y,NaN); // Preserve the repository's original cursor behavior.
      assert.equal(meshes.at(-1).rotation.z,.02);
      assert.equal(frames.size,1); assert.equal(subscriptions,1);
      dispose(); dispose();
      assert.equal(frames.size,0); assert.equal(subscriptions,0);
    }
    assert.deepEqual([contexts,closed,observed,disconnected,controlsDisposed,renderersDisposed,lost,sourceDisconnected],[3,3,3,3,3,3,3,3]);
  } finally { for(const [name,value] of saved) {if(value===undefined)delete globalThis[name];else globalThis[name]=value;} }
});
