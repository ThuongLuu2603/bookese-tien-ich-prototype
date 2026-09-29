/* Shared blackout input: individual dates, click a range, or drag a range. */
(function(){
 const iso=d=>d.toISOString().slice(0,10), date=s=>new Date(s+'T00:00:00Z');
 window.BookeseBlackout={mount(input,host){
  if(!input||!host||host.dataset.mounted)return;
  host.dataset.mounted='true';input.type='hidden';
  let chosen=new Set(input.value.split(',').map(x=>x.trim()).filter(Boolean)), month=date([...chosen][0]||input.form?.elements.stayStart?.value||new Date().toISOString().slice(0,10));month.setUTCDate(1);
  let anchor=null,drag=null,hover=null,mode='day';
  const bounds=()=>[input.form?.elements.stayStart?.value||'',input.form?.elements.stayEnd?.value||''];
  const allowed=s=>{const [a,b]=bounds();return (!a||s>=a)&&(!b||s<=b)};
  const range=(a,b)=>{const out=[];for(let d=date(a<b?a:b),end=a>b?a:b;iso(d)<=end;d.setUTCDate(d.getUTCDate()+1))if(allowed(iso(d)))out.push(iso(d));return out};
  function save(){input.value=[...chosen].sort().join(',');input.dispatchEvent(new Event('change',{bubbles:true}));draw()}
  function addRange(a,b,remove=false){range(a,b).forEach(s=>remove?chosen.delete(s):chosen.add(s));save()}
  function draw(){
   const first=new Date(month),days=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth()+1,0)).getUTCDate(),offset=(first.getUTCDay()+6)%7;
   host.innerHTML=`<div class="blackout-picker"><div class="blackout-toolbar"><b>Ngày không áp dụng ưu đãi</b><select aria-label="Cách chọn blackout"><option value="day">Chọn từng ngày / nhấp kéo</option><option value="range">Chọn ngày đầu và ngày cuối</option></select></div><p class="muted">Click một ngày để chọn/bỏ chọn; nhấp kéo để chọn nhiều ngày liên tiếp. ${anchor?'Chọn ngày cuối của khoảng.':''}</p><div class="blackout-month"><button type="button" data-shift="-1" aria-label="Tháng trước">‹</button><strong>Tháng ${month.getUTCMonth()+1}/${month.getUTCFullYear()}</strong><button type="button" data-shift="1" aria-label="Tháng sau">›</button></div><div class="blackout-grid" role="group" aria-label="Lịch blackout">${['T2','T3','T4','T5','T6','T7','CN'].map(x=>`<span>${x}</span>`).join('')}${'<i></i>'.repeat(offset)}${Array.from({length:days},(_,i)=>{const s=iso(new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth(),i+1)));return `<button type="button" data-day="${s}" aria-label="${s}" aria-pressed="${chosen.has(s)}" ${allowed(s)?'':'disabled'}>${i+1}</button>`}).join('')}</div><div class="blackout-selection" aria-live="polite"><b>${chosen.size} ngày đã chọn</b><button type="button" data-clear>Xóa tất cả</button><p>${[...chosen].sort().map(s=>s.split('-').reverse().join('/')).join(', ')||'Chưa có ngày loại trừ.'}</p></div></div>`;
   host.querySelector('select').value=mode;host.querySelector('select').onchange=ev=>{mode=ev.target.value;anchor=null;draw()};
   host.querySelectorAll('[data-shift]').forEach(b=>b.onclick=()=>{month.setUTCMonth(month.getUTCMonth()+Number(b.dataset.shift));draw()});
   host.querySelector('[data-clear]').onclick=()=>{chosen.clear();anchor=null;save()};
   host.querySelectorAll('[data-day]').forEach(b=>{
    b.onpointerdown=ev=>{if(ev.button!==0||b.disabled)return;drag=b.dataset.day;hover=drag;ev.preventDefault()};
    b.onpointerenter=()=>{if(!drag||b.disabled)return;hover=b.dataset.day;const preview=range(drag,hover);host.querySelectorAll('[data-day]').forEach(x=>x.classList.toggle('blackout-preview',preview.includes(x.dataset.day)))};
    b.onkeydown=ev=>{if(!['Enter',' '].includes(ev.key))return;ev.preventDefault();select(b.dataset.day)};
   });
  }
  function select(s){if(mode==='range'){if(!anchor){anchor=s;draw()}else{const a=anchor;anchor=null;addRange(a,s)}}else{chosen.has(s)?chosen.delete(s):chosen.add(s);save()}}
  document.addEventListener('pointerup',()=>{if(!drag)return;const a=drag,b=hover;drag=null;hover=null;if(a===b)select(a);else{anchor=null;addRange(a,b)}});
  document.addEventListener('pointercancel',()=>{drag=null;hover=null});
  input.form?.querySelectorAll('[name=stayStart],[name=stayEnd]').forEach(x=>x.addEventListener('change',()=>{if(x.name==='stayStart'&&x.value){month=date(x.value);month.setUTCDate(1)}draw()}));
  draw();
 }};
})();
