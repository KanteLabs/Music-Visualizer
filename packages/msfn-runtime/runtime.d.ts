import type { ComponentType } from 'react';
export type RuntimeProps = {active:boolean; onExit:()=>void; containerSize:{width:number;height:number}};
declare const manifest: {id:string; runtimeApiVersion:number; mode:'full'; renderer:'isolated'; suspendHostScene:true; Component:ComponentType<RuntimeProps>};
export default manifest;
