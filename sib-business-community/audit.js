const puppeteer=require('puppeteer-core'),path=require('path');
(async()=>{const b=await puppeteer.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:'shell',args:['--no-sandbox']});
const p=await b.newPage();await p.setViewport({width:1920,height:1080});
await p.goto('file://'+path.join(process.cwd(),'index.html')+'?static=1',{waitUntil:'networkidle0'});
await p.evaluate(()=>document.fonts.ready);
const r=await p.evaluate(()=>{
  const small=[],out=[];
  document.querySelectorAll('.slide').forEach(sl=>{
    const sb=sl.getBoundingClientRect();
    const cs=getComputedStyle(sl);
    const padT=parseFloat(cs.paddingTop)||0, padB=parseFloat(cs.paddingBottom)||0;
    const top=sb.top+Math.min(padT,40), bot=sb.bottom-Math.min(padB,40);
    sl.querySelectorAll('*').forEach(el=>{
      const txt=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join('');
      if(!txt) return;
      const fs=parseFloat(getComputedStyle(el).fontSize);
      if(fs<24) small.push(sl.id+' '+fs+'px '+txt.slice(0,26));
      const r=el.getBoundingClientRect();
      if(r.height===0) return;
      if(r.bottom>bot+1||r.top<top-1) out.push(sl.id+' | '+txt.slice(0,24)+' | top'+Math.round(r.top-sb.top)+' bottom'+Math.round(r.bottom-sb.top));
    });
  });
  return {small, out:[...new Set(out)]};
});
console.log('◆ 24px未満:',r.small.length); r.small.forEach(x=>console.log('  ',x));
console.log('◆ 枠外にはみ出し:',r.out.length); r.out.slice(0,20).forEach(x=>console.log('  ',x));
await b.close();})();
