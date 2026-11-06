// Figma geometry is kept as editable, independent DOM elements, not a page image.
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const rgba = c => `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${c.a ?? 1})`;
export const matrix = t => `matrix(${t.join(',')})`;
export function artwork(n, prefix) {
  if(n.type === 'TEXT' && !n.glyphs?.length) return '';
  let defs = '', body = '', seq = 0;
  function paint(p) {
    if (p.type === 'SOLID') return rgba({...p.color, a:(p.color.a ?? 1)*(p.opacity ?? 1)});
    const id = `${prefix}-paint-${seq++}`;
    if (p.type === 'IMAGE') {
      const t = p.transform || {m00:1,m11:1,m02:0,m12:0};
      const a=t.m00 || 1,d=t.m11 || 1;
      defs += `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${n.w}" height="${n.h}"><image href="assets/images/${p.image}" x="${-t.m02*n.w/a}" y="${-t.m12*n.h/d}" width="${n.w/a}" height="${n.h/d}" preserveAspectRatio="none" opacity="${p.opacity ?? 1}"/></pattern>`;
    } else if (p.type === 'GRADIENT_LINEAR') {
      const t=p.transform || {m00:1,m01:0,m02:0,m10:0,m11:1,m12:0};
      defs += `<linearGradient id="${id}" gradientUnits="objectBoundingBox" x1="0" y1=".5" x2="1" y2=".5" gradientTransform="matrix(${t.m00} ${t.m10} ${t.m01} ${t.m11} ${t.m02} ${t.m12})">${p.stops.map(s=>`<stop offset="${s.position}" stop-color="${rgba(s.color)}"/>`).join('')}</linearGradient>`;
    } else return 'none';
    return `url(#${id})`;
  }
  if (n.type === 'TEXT' && n.glyphs?.length) {
    const fills=n.fillPaints.length?n.fillPaints:[{type:'SOLID',color:{r:0,g:0,b:0,a:1}}];
    for (const p of [...fills].reverse()) {
      const fill=paint(p);
      body+=`<g fill="${fill}">${n.glyphs.map(g=>`<use href="#path-${g.path}" transform="translate(${g.x} ${g.y}) scale(${g.size} ${-g.size})"/>`).join('')}</g>`;
    }
  } else {
    for (const [geometries, paints] of [[n.fillGeometry,n.fillPaints],[n.strokeGeometry,n.strokePaints]]) {
      for (const p of [...paints].reverse()) {
        const fill=paint(p);
        const geometry=geometries?.length?geometries:(n.type==='LINE'?[]:[{rect:true}]);
        for (const g of geometry) body+=g.rect?`<rect width="${n.w}" height="${n.h}" fill="${fill}"/>`:`<use href="#path-${g.path}" fill="${fill}" fill-rule="${g.rule==='ODD'?'evenodd':'nonzero'}"/>`;
        if (!geometry.length && n.type==='LINE') body+=`<path d="M0 0H${n.w}" fill="none" stroke="${fill}" stroke-width="${n.strokeWeight}"/>`;
      }
    }
  }
  return body?`<svg class="artwork" width="${n.w}" height="${Math.max(n.h,1)}" aria-hidden="true" style="overflow:visible"><defs>${defs}</defs>${body}</svg>`:'';
}
export function createNode(n, prefix, document) {
  const el=document.createElement('div');
  el.className=`design-node${n.text?' design-text':''}`;el.dataset.node=n.id;el.dataset.name=n.name;
  Object.assign(el.style,{width:`${n.w}px`,height:`${n.h}px`,transform:matrix(n.matrix),opacity:n.opacity,overflow:n.clip?'hidden':'visible'});
  if (!['NORMAL','PASS_THROUGH'].includes(n.blend)) el.style.mixBlendMode=n.blend.toLowerCase().replaceAll('_','-');
  el.innerHTML=artwork(n,prefix);
  if(n.text) {
    const text=document.createElement('span');text.textContent=n.text;
    if(n.glyphs?.length) text.className='accessible-text';
    else {text.className='live-text';text.style.fontSize=`${n.fontSize}px`;text.style.color=n.fillPaints[0]?.color?rgba(n.fillPaints[0].color):'#262420';text.style.textAlign=n.align.toLowerCase();text.style.fontWeight=/extra|heavy/i.test(n.fontName?.style)?800:/bold/i.test(n.fontName?.style)?700:/medium/i.test(n.fontName?.style)?500:400;}
    el.append(text);
  }
  let parent=el;
  if(n.childScale && n.childScale.some(s=>s!==1)) {
    parent=document.createElement('div');parent.className='component-content';parent.style.transform=`scale(${n.childScale.join(',')})`;el.append(parent);
  }
  n.children.forEach((child,i)=>parent.append(createNode(child,`${prefix}-${i}`,document)));
  return el;
}
export function definitions(paths) {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="path-library" aria-hidden="true"><defs>${Object.entries(paths).map(([id,d])=>`<path id="path-${id}" d="${esc(d)}"/>`).join('')}</defs></svg>`;
}
