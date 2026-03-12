import {useEffect,useRef,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";

function NetworkBackground(){
const canvasRef=useRef(null);
const mouse=useRef({x:0,y:0});

useEffect(()=>{
const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");
let w=canvas.width=window.innerWidth;
let h=canvas.height=window.innerHeight;

const pts=new Array(130).fill(0).map(()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*0.25,vy:(Math.random()-.5)*0.25}));

function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight}
window.addEventListener("resize",resize);

function move(e){mouse.current.x=e.clientX;mouse.current.y=e.clientY}
window.addEventListener("mousemove",move);

function loop(){
ctx.clearRect(0,0,w,h);

for(let p of pts){
p.x+=p.vx;
p.y+=p.vy;
if(p.x<0||p.x>w)p.vx*=-1;
if(p.y<0||p.y>h)p.vy*=-1;
}

for(let i=0;i<pts.length;i++){
const a=pts[i];

for(let j=i+1;j<pts.length;j++){
const b=pts[j];
const dx=a.x-b.x;
const dy=a.y-b.y;
const d=Math.sqrt(dx*dx+dy*dy);

if(d<120){
ctx.globalAlpha=1-d/120;
ctx.beginPath();
ctx.moveTo(a.x,a.y);
ctx.lineTo(b.x,b.y);
ctx.strokeStyle="#38bdf8";
ctx.lineWidth=1;
ctx.shadowBlur=8;
ctx.shadowColor="#38bdf8";
ctx.stroke();
ctx.shadowBlur=0;
}
}

const dx=a.x-mouse.current.x;
const dy=a.y-mouse.current.y;
const md=Math.sqrt(dx*dx+dy*dy);

if(md<170){
ctx.globalAlpha=1-md/170;
ctx.beginPath();
ctx.moveTo(a.x,a.y);
ctx.lineTo(mouse.current.x,mouse.current.y);
ctx.strokeStyle="#7dd3fc";
ctx.stroke();
}

ctx.globalAlpha=0.9;
ctx.beginPath();
ctx.arc(a.x,a.y,2,0,Math.PI*2);
ctx.fillStyle="#7dd3fc";
ctx.shadowBlur=10;
ctx.shadowColor="#7dd3fc";
ctx.fill();
ctx.shadowBlur=0;
}

ctx.globalAlpha=1;
requestAnimationFrame(loop);
}

loop();

return()=>{
window.removeEventListener("resize",resize);
window.removeEventListener("mousemove",move);
};
},[]);

return <canvas ref={canvasRef} className="fixed inset-0 -z-10"/>;
}

function smoothScroll(id){
const el=document.getElementById(id);
if(!el)return;
el.scrollIntoView({behavior:"smooth",block:"start"});
}

function useTypewriter(){
const [text,setText]=useState("Null");

useEffect(()=>{
const words=["Null","@nullvexdd"];
let wordIndex=0;
let charIndex=words[0].length;
let deleting=true;

const interval=setInterval(()=>{
const current=words[wordIndex];

if(deleting){
if(charIndex>0){
charIndex--;
setText(current.slice(0,charIndex));
}else{
deleting=false;
wordIndex=(wordIndex+1)%words.length;
}
}else{
const next=words[wordIndex];
if(charIndex<next.length){
charIndex++;
setText(next.slice(0,charIndex));
}else{
deleting=true;
}
}
},90);

return()=>clearInterval(interval);
},[]);

return text;
}

function Stat({n,l}){
return(
<div className="text-center">
<div className="text-3xl font-bold text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]">{n}</div>
<div className="text-zinc-400 text-sm">{l}</div>
</div>
);
}

function BlurDecor(){
return(
<>
<div className="absolute w-96 h-96 bg-sky-500/20 blur-[120px] rounded-full -top-20 -left-20"/>
<div className="absolute w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full top-40 right-0"/>
<div className="absolute w-72 h-72 bg-cyan-400/20 blur-[120px] rounded-full bottom-0 left-1/3"/>
</>
);
}

function ProjectCard({p,onOpen}){
return(
<motion.div whileHover={{scale:1.05,rotateX:6,rotateY:-6}} transition={{type:"spring",stiffness:200}} onClick={()=>onOpen(p)} className="cursor-pointer group bg-zinc-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl hover:shadow-sky-500/20">
<div className="relative">
<video src={p.video} autoPlay loop muted playsInline className="w-full h-48 object-cover group-hover:scale-105 transition"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
</div>
<div className="p-5 space-y-2">
<h3 className="text-xl font-semibold">{p.title}</h3>
<p className="text-zinc-400 text-sm">{p.desc}</p>
</div>
</motion.div>
);
}

function ProcessStep({title,desc}){
return(
<div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur hover:border-sky-500/40 transition">
<h3 className="font-semibold text-lg mb-2">{title}</h3>
<p className="text-zinc-400 text-sm">{desc}</p>
</div>
);
}

function LandingAnimation({done}){
return(
<motion.div initial={{opacity:1}} animate={{opacity:0}} transition={{duration:1.2,delay:1.6}} onAnimationComplete={done} className="fixed inset-0 bg-black z-50 flex items-center justify-center">
<motion.div initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:1}} className="text-center">
<div className="text-6xl font-bold text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]">Null</div>
<div className="text-zinc-400 mt-2">Roblox Systems Developer</div>
</motion.div>
</motion.div>
);
}

export default function App(){
const [active,setActive]=useState(null);
const [intro,setIntro]=useState(true);
const typed=useTypewriter();

const projects=[
{title:"Procedural Mining System",desc:"Directional mining with depth-based ore rarity.",video:"/videos/mining.mp4"},
{title:"Inventory + Crate System",desc:"Animated inventory UI with crate opening and rewards.",video:"/videos/inventory.mp4"},
{title:"Procedural World Generator",desc:"Optimized world generation with scalable architecture.",video:"/videos/worldgen.mp4"},
{title:"Advanced Data System",desc:"Session-safe data persistence and rollback protection.",video:"/videos/data.mp4"}
];

return(
<div className="text-white font-sans min-h-screen bg-black overflow-x-hidden">

{intro && <LandingAnimation done={()=>setIntro(false)}/>}

<NetworkBackground/>

<section className="relative h-screen flex flex-col justify-center items-center text-center px-6">

<BlurDecor/>

<motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:1}} className="text-7xl font-bold tracking-tight drop-shadow-[0_0_25px_rgba(56,189,248,0.8)]">
{typed}
</motion.h1>

<motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}} className="text-zinc-400 mt-4 max-w-xl">
Roblox Studio scripter specializing in scalable gameplay systems, optimized architecture and advanced mechanics.
</motion.p>

<div className="flex gap-10 mt-10">
<Stat n="4+" l="Years Experience"/>
<Stat n="Luau" l="Primary Language"/>
<Stat n="Roblox" l="Development Platform"/>
</div>

<div className="flex gap-4 mt-10">
<button onClick={()=>smoothScroll("projects")} className="px-7 py-3 bg-sky-500 hover:bg-sky-400 rounded-xl font-medium shadow-lg shadow-sky-500/20">View Projects</button>
<button onClick={()=>smoothScroll("hire")} className="px-7 py-3 border border-zinc-700 hover:border-zinc-500 rounded-xl">Hire Me</button>
</div>

</section>

<section id="projects" className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-4xl font-semibold mb-14 text-center">Featured Systems</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
{projects.map((p,i)=>(<ProjectCard key={i} p={p} onOpen={setActive}/>))}
</div>

</section>

<section className="max-w-5xl mx-auto px-6 py-24 text-center">

<h2 className="text-4xl font-semibold mb-8">About</h2>

<p className="text-zinc-400 leading-relaxed">
Developer focused on building performant Roblox systems with modular architecture. Specializing in gameplay mechanics, UI systems, procedural generation and scalable infrastructure built for large player bases.
</p>

</section>

<section id="hire" className="max-w-6xl mx-auto px-6 py-28">

<h2 className="text-4xl font-semibold text-center mb-14">Working With Me</h2>

<div className="grid md:grid-cols-3 gap-8">

<ProcessStep title="1. Project Discussion" desc="We start by discussing the system you need built with references and clear feature expectations."/>

<ProcessStep title="2. Planning" desc="Architecture and scope are planned before development begins so everything is structured."/>

<ProcessStep title="3. Development" desc="Systems are written modularly with performance and scalability in mind."/>

<ProcessStep title="4. Testing" desc="All mechanics are stress tested to ensure they work properly in real gameplay."/>

<ProcessStep title="5. Delivery" desc="You receive organized scripts ready to integrate into your experience."/>

<ProcessStep title="6. Support" desc="Post-delivery adjustments and integration assistance are provided."/>

</div>

</section>

<section className="max-w-6xl mx-auto px-6 pb-28">

<h2 className="text-4xl font-semibold text-center mb-14">Hiring Details</h2>

<div className="grid md:grid-cols-3 gap-8">

<div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
<h3 className="font-semibold mb-3">Communication</h3>
<p className="text-zinc-400 text-sm">Projects are coordinated through Discord with frequent progress updates.</p>
</div>

<div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
<h3 className="font-semibold mb-3">Project Details</h3>
<p className="text-zinc-400 text-sm">Provide system descriptions, references and expected functionality before work begins.</p>
</div>

<div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
<h3 className="font-semibold mb-3">Payment</h3>
<p className="text-zinc-400 text-sm">Payment is usually upfront or milestone based depending on project scope.</p>
</div>

</div>

</section>

<footer className="text-center py-12 text-zinc-500 text-sm border-t border-zinc-900">
© {new Date().getFullYear()} Null — Roblox Systems Developer
</footer>

<AnimatePresence>
{active && (
<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center p-6" onClick={()=>setActive(null)}>

<motion.div initial={{scale:.85}} animate={{scale:1}} exit={{scale:.85}} className="max-w-3xl w-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">

<video src={active.video} controls autoPlay className="w-full"/>

<div className="p-6">
<h3 className="text-2xl font-semibold mb-2">{active.title}</h3>
<p className="text-zinc-400 text-sm">{active.desc}</p>
</div>

</motion.div>

</motion.div>
)}
</AnimatePresence>

</div>
);
}
