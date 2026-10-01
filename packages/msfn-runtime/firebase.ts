let pending: Promise<any> | undefined;
/** Load the exact SDK used by the standalone page, only on runtime mount. */
export function loadFirebase(config: object): Promise<any> {
  if (!pending) pending = new Promise((resolve,reject) => {
    const ready = () => {
      const sdk = (window as any).firebase;
      try { resolve(sdk.apps.length ? sdk.app() : sdk.initializeApp(config)); }
      catch (error) { pending=undefined; reject(error); }
    };
    if ((window as any).firebase) { ready(); return; }
    const script=document.createElement('script');
    script.src='https://www.gstatic.com/firebasejs/4.3.1/firebase.js';
    script.onload=()=>{script.onload=null;script.onerror=null;ready();};
    script.onerror=()=>{pending=undefined;script.remove();reject(new Error('Music Visualizer could not load its original Firebase SDK. Retry when connected.'));};
    document.head.appendChild(script);
  });
  return pending;
}
