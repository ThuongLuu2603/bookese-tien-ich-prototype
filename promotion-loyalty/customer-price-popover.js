// Tax rates below match the existing Bookese example and are prototype fixtures.
let pricePopoverAnchor=null;
function closePricePopover(restore=false){document.getElementById('price-popover')?.remove();pricePopoverAnchor?.setAttribute('aria-expanded','false');if(restore)pricePopoverAnchor?.focus();pricePopoverAnchor=null}
function showPriceDetails(anchor,room=customer.room){
 if(pricePopoverAnchor===anchor&&document.getElementById('price-popover')){closePricePopover();return}
 closePricePopover();const q=quote(room);if(q.error){modal('Kiểm tra ngày',`<p>${esc(q.error)}</p>`);return}
 const qty=location.hash==='#checkout'?Math.max(1,customer.quantity):1,total=q.total*qty,net=Math.round(total/1.155),service=Math.round(net*.05),vat=total-net-service;
 let allocated=0;const nightsHtml=q.rows.map((r,i)=>{const amount=i===q.rows.length-1?net-allocated:Math.round(r.best.price*qty/1.155);allocated+=amount;const dt=r.date.split('-');return `<div class="pp-row"><span>Đêm ${i+1} (${+dt[2]}/${+dt[1]})${qty>1?' × '+qty+' phòng':''}</span><span>${money(amount)}</span></div>`}).join('');
 const coins=customer.tier<0?0:Math.floor(total*(customer.tier+1)/100);
 const pop=document.createElement('section');pop.id='price-popover';pop.className='price-popover';pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Chi tiết giá');
 pop.innerHTML=`<div class="pp-heading">Chi tiết giá<button aria-label="Đóng chi tiết giá" onclick="closePricePopover(true)">×</button></div><div class="pp-row"><span>Giá gốc</span><del>${money(q.base*qty)}</del></div><div class="pp-row pp-section"><span>Giá phòng</span><span>${money(net)}</span></div><div class="pp-sub">${nightsHtml}</div><div class="pp-row pp-section"><span>Thuế & Phí</span><span>${money(service+vat)}</span></div><div class="pp-sub"><div class="pp-row"><span>Phí dịch vụ 5%</span><span>${money(service)}</span></div><div class="pp-row"><span>Thuế VAT 10%</span><span>${money(vat)}</span></div></div><div class="pp-total"><div class="pp-row"><span>Tổng tiền phòng</span><span>${money(total)}</span></div><em>(Bao gồm Thuế & phí cho ${nights()} đêm, ${qty} phòng)</em></div><div class="pp-row pp-coins"><div>Xu nhận sau lưu trú<br><em>${customer.tier<0?'Đăng nhập để nhận xu':'Hạng “'+['Thành viên','Thân thiết','Trung thành'][customer.tier]+'”'}</em></div><span>${customer.tier<0?'—':'+'+coins.toLocaleString('vi-VN')+' xu'}</span></div><details class="pp-promotions"><summary>Ưu đãi đã tính trong giá phòng</summary>${q.rows.map(r=>`<div><b>${esc(r.date)}</b>${r.best.ps.length?r.best.ps.map(p=>`<div class="pp-row"><span>${esc(p.name)}</span><span>−${p.rate}%</span></div>`).join(''):'<p>Giá cơ sở</p>'}</div>`).join('')}<p>Giảm nối tiếp, không cộng phần trăm. Mã và xu chưa trừ; xu nhận sẽ được kiểm tra lại tại thanh toán.</p></details>`;
 document.body.appendChild(pop);pricePopoverAnchor=anchor;anchor?.setAttribute('aria-expanded','true');
 const r=anchor?.getBoundingClientRect()||{left:innerWidth/2,right:innerWidth/2,bottom:80,top:80},w=pop.offsetWidth,h=pop.offsetHeight;
 const left=Math.max(12,Math.min(innerWidth-w-12,(r.left+r.right)/2-w/2));const top=Math.max(12,Math.min(r.bottom+12,innerHeight-h-12));
 pop.style.left=left+'px';pop.style.top=top+'px';pop.style.maxHeight=(innerHeight-top-12)+'px';pop.style.setProperty('--pointer-x',Math.max(20,Math.min(w-20,(r.left+r.right)/2-left))+'px');if(top<r.bottom)pop.classList.add('pp-shifted');
 pop.querySelector('button').focus();
}
priceDetails=function(room=customer.room){showPriceDetails(document.activeElement,room)};
document.addEventListener('click',e=>{if(document.getElementById('price-popover')&&!e.target.closest('#price-popover')&&!e.target.closest('[onclick*="showPriceDetails"]'))closePricePopover()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePricePopover(true)});
window.addEventListener('hashchange',()=>closePricePopover());
window.addEventListener('resize',()=>closePricePopover());
document.addEventListener('scroll',e=>{if(!e.target.closest?.('#price-popover'))closePricePopover()},true);
