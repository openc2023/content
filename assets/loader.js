// ASCII page loader (same as 07S): a character bar in the middle and a big 000–100 counter in 5×7 character pixels.
// Each visit picks one style at random; ?loader=block etc. forces one for testing. Click to skip.
(()=>{
  const overlay=document.getElementById('loader');
  if(!overlay)return;
  const number=overlay.querySelector('.num'),bar=overlay.querySelector('.bar');
  const DIGITS={
    0:['01110','10001','10011','10101','11001','10001','01110'],
    1:['00100','01100','00100','00100','00100','00100','01110'],
    2:['01110','10001','00001','00010','00100','01000','11111'],
    3:['11110','00001','00001','01110','00001','00001','11110'],
    4:['00010','00110','01010','10010','11111','00010','00010'],
    5:['11111','10000','11110','00001','00001','10001','01110'],
    6:['00110','01000','10000','11110','10001','10001','01110'],
    7:['11111','00001','00010','00100','01000','01000','01000'],
    8:['01110','10001','10001','01110','10001','10001','01110'],
    9:['01110','10001','10001','01111','00001','00010','01100']
  };
  const RAMP='.:-=+*#%@';
  // ink(row,col,tick) returns the two characters for one pixel; off is the unlit pixel.
  const STYLES={
    pixel:{ink:(r,c,t)=>'07S#@%'[(r*7+c*3+t)%6].repeat(2),off:'  ',spin:'|/-\\',bar:(f,n)=>'['+'#'.repeat(f)+'·'.repeat(n-f)+']'},
    block:{ink:()=>'██',off:'░░',spin:'▖▘▝▗',bar:(f,n)=>'▐'+'█'.repeat(f)+'░'.repeat(n-f)+'▌'},
    dither:{ink:(r,c,t)=>RAMP[Math.floor((Math.sin((c+r)*.7-t*.35)+1)/2*(RAMP.length-1))].repeat(2),off:'  ',spin:'.oOo',bar:(f,n)=>'['+'='.repeat(Math.max(0,f-1))+(f?'>':'')+' '.repeat(n-f)+']'},
    binary:{ink:(r,c,t)=>(((r*5+c+t)>>1)&1?'10':'01'),off:'  ',spin:'01',bar:(f,n)=>'['+'1'.repeat(f)+'0'.repeat(n-f)+']'},
    slash:{ink:(r,c,t)=>((c+r+t)%4<2?'//':'\\\\'),off:'  ',spin:'<^>v',bar:(f,n)=>'{'+'/'.repeat(f)+' '.repeat(n-f)+'}'}
  };
  const forced=new URLSearchParams(location.search).get('loader');
  const names=Object.keys(STYLES);
  const name=STYLES[forced]?forced:names[Math.floor(Math.random()*names.length)];
  const style=STYLES[name];
  overlay.dataset.style=name;
  const SLOTS=24;
  const started=performance.now();
  let ready=document.readyState==='complete',closed=false,tick=0;
  // Each lit pixel is two characters wide so the digits look square in a monospace font.
  const bigNumber=text=>DIGITS[0].map((_,row)=>[...text].map(d=>DIGITS[d][row].split('').map((on,col)=>on==='1'
    ?style.ink(row,col+Number(d)*5,tick):style.off).join('')).join(style.off)).join('\n');
  const paint=value=>{
    tick++;
    const text=String(value).padStart(3,'0'),filled=Math.round(value/100*SLOTS);
    number.textContent=bigNumber(text);
    bar.textContent=(value>=100?'*':style.spin[tick%style.spin.length])+' '+style.bar(filled,SLOTS)+' '+text+'%';
  };
  const close=()=>{
    if(closed)return;
    closed=true;paint(100);
    setTimeout(()=>{overlay.classList.add('done');setTimeout(()=>overlay.remove(),1000);},200);
  };
  const step=()=>{
    if(closed||!overlay.isConnected)return;
    const elapsed=performance.now()-started;
    if(ready&&elapsed>=1500){close();return;}
    const progress=Math.min(1,elapsed/1500);
    paint(Math.min(ready?99:90,Math.round((1-Math.pow(1-progress,3))*100)));
    setTimeout(step,30);
  };
  addEventListener('load',()=>{ready=true;},{once:true});
  setTimeout(()=>{ready=true;},6000);   // never hold the page longer than this on a slow image
  overlay.onclick=close;
  step();
})();
