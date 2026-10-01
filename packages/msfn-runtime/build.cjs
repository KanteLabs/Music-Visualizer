const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const postcss = require('postcss');
const root=path.resolve(__dirname,'../..');
const page=fs.readFileSync(path.join(root,'index.html'),'utf8');
const markup=page.match(/<body>([\s\S]*?)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g,'');
const config=page.match(/var config = (\{[\s\S]*?\});/)[1];
const css=postcss.parse(page.match(/<style>([\s\S]*?)<\/style>/)[1]+'\n'+fs.readFileSync(path.join(root,'css/main.css'),'utf8')+'\n'+fs.readFileSync(path.join(root,'css/dat.gui.css'),'utf8'));
css.walkRules(rule=>{rule.selectors=rule.selectors.map(selector=>selector==='body'?'.original-music-runtime':'.original-music-runtime '+selector);});
fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'dist/runtime.css'),css.toString()+'\n.original-music-runtime {position:absolute;inset:0;overflow:hidden;text-align:left;font-size:16px;}\n.original-music-runtime canvas {display:block;}');
const options = {
 entryPoints:[path.join(__dirname,'runtime.tsx')],outfile:path.join(__dirname,'dist/runtime.js'),
 bundle:true,format:'esm',platform:'browser',target:'es2020',jsx:'automatic',external:['react','react-dom'],
 banner:{js:'import "./runtime.css";'},logLevel:'info',
 plugins:[{name:'original-application-boundaries',setup(build){
  build.onResolve({filter:/^original-page$/},()=>({path:'original-page',namespace:'original-page'}));
  build.onLoad({filter:/.*/,namespace:'original-page'},()=>({contents:'export const markup='+JSON.stringify(markup)+'; export const firebaseConfig='+config+';'}));
  build.onLoad({filter:/OrbitControls\.js$/},args=>({contents:'export default function install(THREE){'+fs.readFileSync(args.path,'utf8')+'\n}',loader:'js'}));
 }}]
};
(async()=>{if(process.argv.includes('--watch')){const context=await esbuild.context(options);await context.watch();}else await esbuild.build(options);})().catch(error=>{console.error(error);process.exit(1);});
