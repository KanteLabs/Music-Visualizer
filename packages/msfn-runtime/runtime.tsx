import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore: the legacy UMD vendor is bundled without changing its version.
import * as THREE from '../../js/utils/three.min.js';
import dat from '../../js/utils/dat.gui.min.js';
// The build wraps the repository's unmodified legacy controls in an installer.
// @ts-ignore: legacy script gains its module boundary at build time.
import installOrbitControls from '../../js/utils/OrbitControls.js';
import { mountMusicVisualizer } from '../../js/main.js';
// @ts-ignore: extracted from the repository's index.html by the build.
import { markup, firebaseConfig } from 'original-page';
import { loadFirebase } from './firebase';
type RuntimeProps = {active:boolean; onExit:()=>void; containerSize:{width:number;height:number}};
installOrbitControls(THREE);
function MusicRuntime({active}: RuntimeProps) {
  const container = useRef<HTMLDivElement>(null);
  const [failure,setFailure] = useState<Error | null>(null);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let dispose: undefined | (() => void);
    const target = container.current!;
    loadFirebase(firebaseConfig).then(firebase => {
      if (cancelled) return;
      target.innerHTML = markup;
      dispose = mountMusicVisualizer(target, {THREE,dat,firebase});
    }).catch(error => { if (!cancelled) setFailure(error); });
    return () => { cancelled = true; dispose?.(); target.replaceChildren(); };
  }, [active]);
  if (failure) throw failure;
  return <div ref={container} className="original-music-runtime" aria-label="Music Visualizer original application" />;
}
export default {id:'music-visualizer',runtimeApiVersion:1,mode:'full' as const,renderer:'isolated' as const,suspendHostScene:true as const,Component:MusicRuntime};
