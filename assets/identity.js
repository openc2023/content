(()=>{'use strict';
const root=document.documentElement,body=document.body,reduced=matchMedia('(prefers-reduced-motion: reduce)'),field=document.getElementById('field'),hero=document.getElementById('heroCanvas'),f=field.getContext('2d'),h=hero.getContext('2d'),motion=document.getElementById('motion'),theme=document.getElementById('theme'),status=document.getElementById('status');
const text=()=>window.studio7Text||{start:'开启动态',pause:'暂停动态',dark:'深色模式',light:'浅色模式',copied:'SVG 地址已复制',failed:'复制失败，请使用 SVG 链接复制地址'};
let trail=null,scrollImpulse=0,scrollPrevious=scrollY;
let paused=false,mode='ascii',W=0,H=0,HW=0,HH=0,mask=null,cols=0,rows=0,last=0,time=0,renderOnce=true,pointer={x:-999,y:-999},ripples=[],heroVisible=true,toastTimer;const ramp=' .:-=+*xo%#@',logo=new Image();logo.src='logo/studio7-white.svg';
const hash=(x,y)=>{const a=Math.sin(x*127.1+y*311.7)*43758.5453;return a-Math.floor(a)},noise=(x,y)=>Math.sin(x*.15+y*.1)+Math.cos(y*.13-x*.08);
function updateMotion(){body.classList.toggle('motion-paused',paused);motion.textContent=paused?text().start:text().pause;motion.setAttribute('aria-pressed',String(paused));renderOnce=true}
function resize(){W=innerWidth;H=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);for(const[c,ctx,w,hh]of[[field,f,W,H],[hero,h,hero.clientWidth,hero.clientHeight]]){c.width=Math.round(w*d);c.height=Math.round(hh*d);ctx.setTransform(d,0,0,d,0,0)}HW=hero.clientWidth;HH=hero.clientHeight;cols=Math.ceil(HW/7);rows=Math.ceil(HH/11);buildMask();renderOnce=true}
function buildMask(){if(!logo.complete||!logo.naturalWidth||!HW)return;const c=document.createElement('canvas');c.width=cols;c.height=rows;const ctx=c.getContext('2d',{willReadFrequently:true});const side=Math.min(HW*.98,HH*.94),x=(HW-side)/2,y=(HH-side)/2-5;ctx.drawImage(logo,x/7,y/11,side/7,side/11);const p=ctx.getImageData(0,0,cols,rows).data;mask=new Float32Array(cols*rows);trail=new Float32Array(cols*rows);for(let i=0;i<mask.length;i++)mask[i]=p[i*4+3]/255;body.classList.add('canvas-ready')}
logo.onload=()=>{buildMask();renderOnce=true};window.addEventListener('resize',resize,{passive:true});window.addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY}},{passive:true});document.addEventListener('pointerleave',()=>{pointer={x:-999,y:-999}});document.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input'))return;ripples.push({x:e.clientX,y:e.clientY,t:time});ripples=ripples.slice(-4)});
new IntersectionObserver(e=>{heroVisible=e[0].isIntersecting;renderOnce=true},{threshold:0}).observe(hero);
function colors(){const light=root.dataset.theme==='light';return{accent:light?'26,86,145':'114,185,255',ink:light?'23,48,73':'218,235,252'}}
// Page background: same character field as 07S (bgfield.js) — sparse drifting dots, a cursor flashlight that
// reveals characters mixed with 0/7/S, scroll parallax that brightens with speed, and 07S words that glitch in.
const fHash=(x,y)=>{const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v)}
const fSmooth=v=>v<=0?0:v>=1?1:v*v*(3-2*v)
function fNoise(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=fSmooth(x-ix),fy=fSmooth(y-iy),a=fHash(ix,iy),b=fHash(ix+1,iy),c=fHash(ix,iy+1),d=fHash(ix+1,iy+1);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy}
let fieldLight=0,fieldLastY=scrollY,fieldVel=0
const FIELD_RAMP='.·:-=+*xo%#@',FIELD_BRAND='07S',FIELD_GLITCH='07S#%/\\<>=+*'
function drawField(t,C){f.clearRect(0,0,W,H)
const light=root.dataset.theme==='light',dot=light?'17,24,32':'247,247,248',ch=light?'83,97,113':'141,142,151'
const cell=W<640?18:16,fs=W<640?10:11,sy=scrollY
fieldVel+=((sy-fieldLastY)-fieldVel)*.25;fieldLastY=sy
const speed=Math.min(1,Math.abs(fieldVel)/45),on=pointer.x>-500&&!matchMedia('(hover: none)').matches
fieldLight+=((on?1:0)-fieldLight)*.08
const par=sy*.35,rowShift=Math.floor(par/cell),off=par-rowShift*cell,cols=Math.ceil(W/cell)+1,rows=Math.ceil(H/cell)+2,R=190,dots=[],chars=[]
for(let r=0;r<rows;r++){const gy=r+rowShift,py=r*cell-off
for(let c=0;c<cols;c++){const px=c*cell
let v=(fNoise(c*.07+t*.04,gy*.07-t*.03)-.56)*2.6
if(speed>.02)v+=speed*.55*fHash(c,gy+Math.floor(t*8))
let near=0
if(fieldLight>.01){near=fSmooth(1-Math.hypot(px+cell/2-pointer.x,py+cell/2-pointer.y)/R)*fieldLight;v+=near*(.55+.45*fHash(c*3.1,gy*1.7))}
if(v<.06)continue
if(near>.12)chars.push(px,py,Math.min(1,v),near)
else if(v>.42)chars.push(px,py,Math.min(1,v),.3+(v-.42)*.4)
else dots.push(px+cell/2-1,py+cell/2-1,Math.min(1,v))}}
f.fillStyle=`rgb(${dot})`
for(let i=0;i<dots.length;i+=3){f.globalAlpha=.1+dots[i+2]*.32;f.fillRect(dots[i],dots[i+1],2,2)}
f.font=`400 ${fs}px Consolas,"SFMono-Regular",monospace`;f.textBaseline='top'
const lastIdx=FIELD_RAMP.length-1,slot=Math.floor(t*1.5),marks=[]
f.fillStyle=`rgb(${ch})`
for(let j=0;j<chars.length;j+=4){const cx=chars[j],cy=chars[j+1],k=fHash(cx*.119+slot*3.7,(cy+par)*.143)
if(k>.74){marks.push(cx,cy,chars[j+3],FIELD_BRAND.charAt(Math.floor(k*1000)%3));continue}
f.globalAlpha=Math.min(.5,chars[j+3]*.62);f.fillText(FIELD_RAMP.charAt(Math.floor(chars[j+2]*lastIdx)),cx+cell*.2,cy+cell*.12)}
f.fillStyle=`rgb(${dot})`
for(let q=0;q<marks.length;q+=4){f.globalAlpha=Math.min(.75,marks[q+2]);f.fillText(marks[q+3],marks[q]+cell*.2,marks[q+1]+cell*.12)}
for(let wr=0;wr<rows;wr++){const wy=wr+rowShift
for(let wc=0;wc+2<cols;wc+=3){const life=t/5+fHash(wc*.31,wy*.57)*9,gen=Math.floor(life)
if(fHash(wc*1.7+gen*5.3,wy*2.9)<.986)continue
const ph=life-gen,a=Math.sin(ph*Math.PI),wx=wc*cell,wpy=wr*cell-off
const nearW=fieldLight>.01?fSmooth(1-Math.hypot(wx+cell*1.5-pointer.x,wpy+cell/2-pointer.y)/260)*fieldLight:0
f.globalAlpha=Math.min(.8,a*.45+nearW*.35)
for(let w=0;w<3;w++){const letter=ph>.18+w*.06?FIELD_BRAND.charAt(w):FIELD_GLITCH.charAt(Math.floor(fHash(wc+w,wy+Math.floor(t*12))*FIELD_GLITCH.length));f.fillText(letter,wx+w*cell+cell*.2,wpy+cell*.12)}}}
f.globalAlpha=1
for(const r of ripples){const age=t-r.t
if(age>1.8)continue
f.beginPath();f.strokeStyle=`rgba(${dot},${.12*(1-age/1.8)})`;f.arc(r.x,r.y,age*230,0,Math.PI*2);f.stroke()}}
function drawHero(t,C){h.clearRect(0,0,HW,HH);if(!mask)return;const rect=hero.getBoundingClientRect();h.font=mode==='braille'?'13px Consolas,monospace':'10px Consolas,monospace';h.textBaseline='top';for(let y=0;y<rows;y++){for(let x=0;x<cols;x++){const px=x*7,py=y*11,m=mask[y*cols+x],n=(noise(x*.7+t*.9,y*.8-t*.7)+2)/4,near=Math.max(0,1-Math.hypot(px+rect.left-pointer.x,py+rect.top-pointer.y)/100);const i=y*cols+x;if(!paused)trail[i]=Math.max(near,trail[i]*.945);const after=trail[i]||0;let v=m*(.68+.32*n)+(m<.1?.07*Math.max(0,n-.55):0)+after*.36;const sweep=Math.exp(-Math.pow((x/cols-(Math.sin(t*.35)*.65+.5))/.075,2));v+=m*sweep*.16;for(const r of ripples){const age=t-r.t,band=Math.abs(Math.hypot(px+rect.left-r.x,py+rect.top-r.y)-age*230);if(age<1.5&&band<20)v+=.35*(1-band/20)*(1-age/1.5)}if(v<.035)continue;h.fillStyle=`rgba(${m>.1?C.ink:C.accent},${Math.min(.95,v)})`;if(mode==='ascii')h.fillText(ramp[Math.min(ramp.length-1,Math.floor(v*(ramp.length-1)))],px,py);else if(mode==='braille'){const bits=[1,2,4,64,8,16,32,128];let dots=0;for(let j=0;j<8;j++)if(hash(x*2+j,y+j*.3)<v*.92)dots|=bits[j];if(dots)h.fillText(String.fromCharCode(0x2800+dots),px,py)}else if(mode==='halftone'){const s=Math.min(3,v*3.4);h.beginPath();h.arc(px+3.5,py+5.5,s,0,Math.PI*2);h.fill()}else if(v>hash(x,y)*.7)h.fillRect(px,py,3,5)}}}
function frame(now){requestAnimationFrame(frame);if(document.hidden)return;if(paused&&!renderOnce)return;if(!renderOnce&&now-last<(W<640?50:40))return;const delta=last?Math.min((now-last)/1000,.1):0;last=now;if(!paused){time+=delta;scrollImpulse*=.91;}const C=colors();drawField(time,C);if(heroVisible)drawHero(time,C);renderOnce=false;ripples=ripples.filter(r=>time-r.t<1.8)}
motion.addEventListener('click',()=>{paused=!paused;updateMotion()});theme.addEventListener('click',()=>{const light=root.dataset.theme!=='light';root.dataset.theme=light?'light':'dark';theme.textContent=light?text().dark:text().light;try{localStorage.setItem('studio7-theme',root.dataset.theme)}catch(e){}theme.setAttribute('aria-pressed',String(light));renderOnce=true});document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(a=>a.setAttribute('aria-pressed',String(a===b)));renderOnce=true}));
function notify(text){status.textContent=text;status.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>status.classList.remove('visible'),2400)}
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const url=new URL(b.dataset.copy,location.href).href;try{await navigator.clipboard.writeText(url);notify(text().copied)}catch(e){const input=document.createElement('textarea');input.value=url;input.style.position='fixed';input.style.opacity='0';body.append(input);input.select();const ok=document.execCommand('copy');input.remove();notify(ok?text().copied:text().failed)}}));document.addEventListener('studio7:language',()=>{updateMotion();theme.textContent=root.dataset.theme==='light'?text().dark:text().light});window.addEventListener('scroll',()=>{scrollImpulse=Math.min(1,Math.abs(scrollY-scrollPrevious)/80);scrollPrevious=scrollY},{passive:true});try{const saved=localStorage.getItem('studio7-theme');if(['light','dark'].includes(saved))root.dataset.theme=saved}catch(e){}theme.textContent=root.dataset.theme==='light'?text().dark:text().light;theme.setAttribute('aria-pressed',String(root.dataset.theme==='light'));updateMotion();resize();requestAnimationFrame(frame);
})();
// Mark the category bar entry for the section currently in view.
(()=>{const links=[...document.querySelectorAll('.category-nav a')];if(!links.length||!('IntersectionObserver' in window))return
const mark=id=>links.forEach(a=>a.setAttribute('aria-current',String(a.getAttribute('href')==='#'+id)))
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){mark(e.target.id);const a=links.find(l=>l.getAttribute('href')==='#'+e.target.id);a&&a.parentNode.scrollTo({left:a.offsetLeft-16,behavior:'smooth'})}}),{rootMargin:'-45% 0px -50% 0px'})
document.querySelectorAll('.collection').forEach(sec=>io.observe(sec))})();
