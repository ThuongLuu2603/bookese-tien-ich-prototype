function customerPriceQuote(room){if(room!=='legacy')return quote(room);const rows=quote('deluxe').rows.map(r=>({...r,base:427500,best:{price:427500,ps:[]}}));return {base:427500*rows.length,total:427500*rows.length,rows}}
function priceBreakdown(q,qty=1,atCheckout=false){
 const total=q.total*qty,net=Math.round(total/1.155),service=Math.round(net*.05),vat=total-net-service;
 const original=q.base*qty,offerTotals=new Map();
 for(const row of q.rows){
  let price=row.base;
  for(const offer of row.best.ps){
   const next=Math.floor(price*(10000-Math.round(offer.rate*100))/10000);
   const key=offer.id||offer.name;
   const saved=offerTotals.get(key)||{name:offer.name,amount:0};
   saved.amount+=(price-next)*qty;
   offerTotals.set(key,saved);
   price=next;
  }
 }
 const offerRows=[...offerTotals.values()].filter(offer=>offer.amount>0);
 const voucher=atCheckout?voucherResult().discount:0;
 const coinLimit=atCheckout&&customer.tier>=0?(window.loyaltyCheckoutLimit?loyaltyCheckoutLimit(total,voucher):Math.min(100000,2000000,Math.floor(total*.3),total-voucher)):0;
 const used=Math.min(customer.coins,coinLimit),payable=total-voucher-used;
 const coins=customer.tier<0?0:Math.floor(payable*((window.CoinOps?CoinOps.policy().rates[customer.tier]:customer.tier+1))/100);
 return `<div class="pp-row"><span>Giá gốc</span><del>${money(original)}</del></div>${offerRows.length?`<div class="pp-applied">${offerRows.map(offer=>`<div class="pp-row"><span>${esc(offer.name)}</span><span>−${money(offer.amount)}</span></div>`).join('')}<small>Số tiền giảm theo từng ưu đãi cho ${nights()} đêm · trước mã và xu</small></div>`:''}<div class="pp-row pp-section"><span>Giá phòng</span><span>${money(net)}</span></div><div class="pp-row pp-section"><span>Thuế & Phí</span><span>${money(service+vat)}</span></div><div class="pp-sub"><div class="pp-row"><span>Phí dịch vụ 5%</span><span>${money(service)}</span></div><div class="pp-row"><span>Thuế VAT 10%</span><span>${money(vat)}</span></div></div><div class="pp-total"><div class="pp-row"><span>Tổng tiền phòng</span><span>${money(total)}</span></div><em>(Bao gồm Thuế & phí cho ${nights()} đêm, ${qty} phòng)</em></div>${atCheckout?`<div class="pp-checkout-adjustments"><div class="pp-row"><span>Mã Bookese${voucher?' · '+esc(customer.code):''}</span><span>−${money(voucher)}</span></div><div class="pp-row"><span>Xu sử dụng</span><span>−${money(used)}</span></div><div class="pp-row pp-payable"><b>Tổng thanh toán</b><b>${money(payable)}</b></div></div>`:''}<div class="pp-row pp-coins"><div>Xu nhận sau lưu trú<br><em>${customer.tier<0?'Đăng nhập để nhận xu':'Hạng “'+['Thành viên','Thân thiết','Trung thành'][customer.tier]+'”'}</em></div><span>${customer.tier<0?'—':'+'+coins.toLocaleString('vi-VN')+' xu'}</span></div>`;
}
// Tax rates below match the existing Bookese example and are prototype fixtures.
let pricePopoverAnchor=null;
function closePricePopover(restore=false){document.getElementById('price-popover')?.remove();pricePopoverAnchor?.setAttribute('aria-expanded','false');if(restore)pricePopoverAnchor?.focus();pricePopoverAnchor=null}
function showPriceDetails(anchor,room=customer.room){
 if(pricePopoverAnchor===anchor&&document.getElementById('price-popover')){closePricePopover();return}
 closePricePopover();const q=customerPriceQuote(room);if(q.error){modal('Kiểm tra ngày',`<p>${esc(q.error)}</p>`);return}
 const pop=document.createElement('section');pop.id='price-popover';pop.className='price-popover';pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Chi tiết giá');
 pop.innerHTML='<div class="pp-heading">Chi tiết giá<button aria-label="Đóng chi tiết giá" onclick="closePricePopover(true)">×</button></div>'+priceBreakdown(q,location.hash==='#checkout'?Math.max(1,customer.quantity):1,location.hash==='#checkout');
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

const checkoutBeforePriceSync=checkout;
checkout=function(){const html=checkoutBeforePriceSync();if(!customer.quantity)return html;const start=html.indexOf('<div class="price-ticket">'),end=html.indexOf('<label class="terms">',start);if(start<0||end<0)return html;return html.slice(0,start)+'<div class="price-ticket unified-price-ticket"><h3>Chi tiết giá</h3>'+priceBreakdown(quote(),customer.quantity,true)+html.slice(end)};
renderCustomer();
