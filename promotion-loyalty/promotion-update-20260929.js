(function(){
 const T=BookeseTarget,E=T.esc;
 if(location.pathname.endsWith('promotions.html')){
  const member=targetMember;targetMember=function(){member();const input=document.querySelector('#memberFinal [name=excluded]');const label=input.closest('label');label.firstChild.textContent='Blackout date';const host=document.createElement('div');label.append(host);BookeseBlackout.mount(input,host)};
  const form=renderBookeseForm;renderBookeseForm=function(){form();if(formType!=='Flash Sale')return;const f=document.querySelector('#typeOffer');if(!f)return;
   const stay=f.querySelector('[name=stayStart]')?.closest('section');if(stay)stay.remove();
   // Old form storage compatibility only; these fields never limit Flash Sale eligibility.
   f.insertAdjacentHTML('beforeend','<input type="hidden" name="stayStart" value="1900-01-01"><input type="hidden" name="stayEnd" value="9999-12-31"><input type="hidden" name="excludedDates" value="">'+[0,1,2,3,4,5,6].map(n=>`<input type="hidden" name="weekday" value="${n}">`).join(''));
   const start=f.elements.boostStart,end=f.elements.boostEnd;end.readOnly=true;
   const sync=()=>{if(!start.value)return;const d=new Date(start.value+'Z');d.setUTCDate(d.getUTCDate()+5);end.value=d.toISOString().slice(0,16)};
   start.addEventListener('change',sync);sync();
   const prior=data.items.find(x=>x.id===editing);if(prior&&FlashPublicity.live(prior)){start.readOnly=true;start.closest('section').insertAdjacentHTML('beforeend','<p class="flash-control-note">Đợt đã mở bán giữ nguyên thời điểm bắt đầu; chỉnh sửa/Activate không khởi động lại 5 ngày.</p>')}
   end.closest('label').firstChild.textContent='Kết thúc tự động sau 5 ngày (120 giờ)';
   const submit=f.onsubmit;f.onsubmit=ev=>{sync();const a=Date.parse(start.value+'+07:00'),b=Date.parse(end.value+'+07:00');if(b-a!==5*86400000){ev.preventDefault();document.querySelector('#formerror').textContent='Mỗi Flash Sale mở bán 5 ngày từ thời điểm bắt đầu.';return}submit(ev)};
  };
  // Explicit inactive state for existing promotions; activating never resets the sale window.
  data.items.forEach(p=>{if(p.status==='paused')p.status='inactive'});
  const registration=registrationForm;registrationForm=function(id){registration(id);const d=T.read(),r=d.registrations.find(x=>x.price===id),f=document.querySelector('#rf');if(!f)return;
   if(r?.adminStopped)f.insertAdjacentHTML('afterbegin','<p class="flash-control-note">Bookese đã dừng đăng ký này. Gửi yêu cầu tham gia lại để admin xét duyệt; sửa thông tin không tự mở lại.</p>');
  };
  targetRender();
 }
 if(location.pathname.endsWith('intranet.html')){
  const detail=programDetail;programDetail=function(){detail();const g=targetProgram();if(!g)return;const d=T.read(),ids=d.prices.filter(p=>p.program===g.id).map(p=>p.id),regs=d.registrations.filter(r=>ids.includes(r.price));const section=[...document.querySelectorAll('#app section')].find(s=>s.querySelector('h2')?.textContent==='Chỗ nghỉ đăng ký');if(!section)return;
   section.querySelector('h2').insertAdjacentHTML('afterend','<p class="muted">Đủ điều kiện tự động tham gia. Chỉ xét duyệt lại các chỗ nghỉ từng bị Bookese dừng.</p>');
   section.querySelectorAll('tbody tr').forEach((tr,i)=>{const r=regs[i];if(r?.status==='Đã tham gia')tr.lastElementChild.insertAdjacentHTML('beforeend',` <button onclick="stopCampaignRegistration('${E(r.id)}')">Dừng tham gia</button>`)});
  };
  window.stopCampaignRegistration=id=>{const r=T.read().registrations.find(r=>String(r.id)===String(id));if(!r)return;modal('Dừng chỗ nghỉ tham gia',`<form id="stopRegistration"><p>Chỉ ngừng áp dụng cho đơn mới; đơn đã xác nhận giữ quyền lợi.</p><label class="field">Lý do dừng<textarea name="reason" required></textarea></label><div class="actions"><button type="button" onclick="closeModal()">Hủy</button><button class="primary">Dừng tham gia</button></div></form>`);document.querySelector('#stopRegistration').onsubmit=ev=>{ev.preventDefault();const reason=ev.target.reason.value.trim();if(!reason)return;T.update(d=>{const x=d.registrations.find(x=>String(x.id)===String(id));x.status='Bookese dừng';x.adminStopped=true;x.reviewReason=reason;x.confirmedBy='Admin Bookese';x.reviewedAt=new Date().toISOString()},'Admin dừng tham gia: '+reason);closeModal();programDetail()}};
  nav();
 }
 if(location.pathname.endsWith('customer.html')){
  const oldSearch=search;
  search=function(){const result=oldSearch(),wrap=document.createElement('div');wrap.innerHTML=result;const section=wrap.querySelector('.search-layout>section');if(!section)return result;
   const offers=FlashPublicity.offers().items.filter(p=>p.type==='Flash Sale'&&FlashPublicity.live(p)&&FlashPublicity.state(p)==='Đã duyệt'&&(p.market||'Đà Nẵng')===(customer.destination||'Đà Nẵng'));
   const byHotel=new Map();for(const offer of offers){const q=FlashPublicity.preview(offer);if(!q)continue;const key=offer.hotelId||offer.hotelName||'Awaken Da Nang Hotel';const old=byHotel.get(key);if(!old||q.total<old.q.total)byHotel.set(key,{p:offer,q})}
   if(!byHotel.size)return result;
   const block=`<section class="flash-search-section"><div class="flash-search-head"><div><h2>Flash Sale tại ${E(customer.destination||'Đà Nẵng')}</h2><p>Ưu đãi đang mở bán trong thời gian có hạn</p></div><button aria-label="Xem thêm khách sạn Flash Sale" onclick="this.closest('section').querySelector('.flash-search-cards').scrollBy({left:280,behavior:'smooth'})">→</button></div><div class="flash-search-cards">${[...byHotel.values()].map(({p,q})=>`<article class="flash-search-card"><img src="${E(p.image||assets.hotel)}" alt="${E(p.hotelName||'Awaken Da Nang Hotel')}"><div><span class="flash-label">ϟ Flash Sale</span><h3>${E(p.hotelName||'Awaken Da Nang Hotel')}</h3><p>★★★★★</p><p>${E(p.market||'Đà Nẵng')}</p><small>Còn <span class="flash-countdown" data-flash-end="${E(p.boostEnd)}">${FlashPublicity.remaining(p.boostEnd)}</span></small><del>${money(q.base)}</del><strong class="flash-price">${money(q.total)}</strong><small>${nights()} đêm · 1 phòng · Đã gồm thuế/phí</small><button class="primary flash-action" onclick="flashOpen('${E(p.id)}')">Xem phòng</button></div></article>`).join('')}</div></section>`;
   const first=section.querySelector('.hotel-card');if(first)first.insertAdjacentHTML('afterend',block);else section.insertAdjacentHTML('beforeend',block);return wrap.innerHTML;
  };
  renderCustomer();
 }
 setInterval(()=>{document.querySelectorAll('[data-flash-end]').forEach(el=>{const remain=Date.parse(el.dataset.flashEnd+'+07:00')-FlashPublicity.now();el.textContent=FlashPublicity.remaining(el.dataset.flashEnd);if(remain<=0){const card=el.closest('.flash-search-card');if(card){card.remove();if(!document.querySelector('.flash-search-card'))document.querySelector('.flash-search-section')?.remove()}}})},1000);
})();
