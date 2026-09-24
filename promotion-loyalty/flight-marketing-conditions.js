/* Flight campaign configuration; catalog entries are prototype examples. */
(function(){
  const T=BookeseTarget;
  const journeys={all:'Một chiều và khứ hồi',oneway:'Chỉ một chiều',roundtrip:'Chỉ khứ hồi'};
  const scopes={all:'Tất cả chuyến bay',domestic:'Nội địa',international:'Quốc tế'};
  const airports=[['SGN','TP.HCM (SGN)'],['HAN','Hà Nội (HAN)'],['DAD','Đà Nẵng (DAD)'],['PQC','Phú Quốc (PQC)'],['CXR','Cam Ranh (CXR)'],['SIN','Singapore (SIN)'],['BKK','Bangkok (BKK)'],['ICN','Seoul (ICN)']];
  const airlines=[['VN','Vietnam Airlines'],['VJ','Vietjet Air'],['QH','Bamboo Airways'],['SQ','Singapore Airlines'],['TG','Thai Airways']];
  const money=value=>Number(value||0).toLocaleString('vi-VN');
  const date=value=>value?value.split('-').reverse().join('/'):'—';
  const normalize=(raw,p)=>({scope:'all',journey:'all',roundtripCheck:'outbound',airlineMode:'all',airlines:[],routeMode:'all',routes:[],bookingStart:p.start,bookingEnd:p.end,flightDateMode:'all',flightStart:'',flightEnd:'',excludedDates:[],directDiscount:true,discountType:'amount',discount:0,minimum:0,maximum:null,discountUnit:'booking',...raw,scope:p.flightScope||raw?.scope||'all'});
  const validate=(c,p)=>{
    if(!c.bookingStart||!c.bookingEnd||c.bookingEnd<c.bookingStart||c.bookingStart<p.start||c.bookingEnd>p.end)return 'Lịch đặt vé phải hợp lệ và nằm trong thời gian đợt tiếp thị.';
    if(c.airlineMode==='selected'&&!c.airlines.length)return 'Chọn ít nhất một hãng bay.';
    if(c.routeMode==='selected'){
      if(!c.routes.length)return 'Thêm ít nhất một chặng bay.';
      const seen=new Set();
      for(const r of c.routes){
        if(!r.from||!r.to||r.from===r.to)return 'Mỗi chặng cần điểm đi và điểm đến khác nhau.';
        const domestic=['SGN','HAN','DAD','PQC','CXR'].includes(r.from)&&['SGN','HAN','DAD','PQC','CXR'].includes(r.to);
        if((c.scope==='domestic'&&!domestic)||(c.scope==='international'&&domestic))return 'Chặng bay phải phù hợp phạm vi Nội địa/Quốc tế đã chọn.';
        const keys=[r.from+'-'+r.to,...(r.reverse?[r.to+'-'+r.from]:[])];
        if(keys.some(key=>seen.has(key)))return 'Có chặng bay bị trùng, kể cả chiều ngược lại đã chọn.';
        keys.forEach(key=>seen.add(key));
      }
    }
    if(c.flightDateMode==='range'&&(!c.flightStart||!c.flightEnd||c.flightEnd<c.flightStart))return 'Nhập đủ khoảng ngày bay hợp lệ.';
    if(c.flightDateMode==='range'&&c.excludedDates.some(value=>value<c.flightStart||value>c.flightEnd))return 'Ngày bay loại trừ phải nằm trong khoảng ngày bay đã chọn.';
    if(c.directDiscount&&!['booking','ticket'].includes(c.discountUnit))return 'Chọn đơn vị áp dụng.';
    if(c.directDiscount&&(!Number.isSafeInteger(c.discount)||c.discount<1||(c.discountType==='percent'&&c.discount>99)||!Number.isSafeInteger(c.minimum)||c.minimum<0||(c.discountType==='percent'&&(!Number.isSafeInteger(c.maximum)||c.maximum<1))))return 'Kiểm tra mức giảm, đơn tối thiểu và giảm tối đa.';
    return '';
  };
  window.FlightMarketingConditions={normalize,validate};
  const style=document.createElement('style');
  style.textContent=`dialog:has(#flightConditionForm){width:900px;max-width:calc(100vw - 40px);max-height:90vh;overflow:auto}#flightConditionForm section{border-top:1px solid #e5e9ef;padding:16px 0}#flightConditionForm h3{margin:0 0 16px}#flightConditionForm [hidden]{display:none!important}#flightConditionForm .flight-route{border:1px solid #e5e9ef;border-radius:6px;padding:12px;margin:10px 0}#flightConditionForm .flight-route .fields{grid-template-columns:1fr 1fr}#flightConditionForm .flight-checks{display:flex;gap:16px;flex-wrap:wrap;margin:12px 0}#flightConditionForm .flight-checks label{display:flex;align-items:center;gap:6px}#flightConditionForm .flight-checks input{width:auto}#flightConditionForm .flight-dates{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}#flightConditionForm .actions{position:sticky;bottom:-24px;background:white;padding:16px 0;margin:0}#flightConditionForm .error{scroll-margin:20px}`;
  document.head.appendChild(style);
  window.flightConditionForm=()=>{
    const p=targetProgram(),c=normalize(p.flightConditions||{},p);
    const routes=c.routes.map(item=>({...item})),excluded=new Set(c.excludedDates);
    modal('Điều kiện chương trình tiếp thị vé máy bay',`<form id="flightConditionForm">
      <p class="muted">${e(p.name)} · ${date(p.start)} – ${date(p.end)}</p>
      <section><h3>1. Chuyến bay áp dụng</h3><p class="muted">Phạm vi: <b>${e(scopes[c.scope])}</b> · Theo thông tin đợt tiếp thị.</p><div class="fields">

      ${select('Loại hành trình','journey',Object.entries(journeys),c.journey)}
      </div><div id="roundtripFields">${select('Với khứ hồi, xét điều kiện trên','roundtripCheck',[['outbound','Lượt đi'],['both','Cả lượt đi và lượt về']],c.roundtripCheck)}
      <p class="muted">Áp dụng cách xét này cho hãng bay, chặng và ngày bay. Chọn cả hai lượt thì cả lượt đi và về đều phải hợp lệ. Chặng về đảo điểm đi–đến của chặng đi.</p></div>
      ${select('Hãng bay áp dụng','airlineMode',[['all','Tất cả hãng bay'],['selected','Chọn hãng bay']],c.airlineMode)}
      <div id="airlineChoices" class="flight-checks">${airlines.map(([code,name])=>`<label><input type="checkbox" name="airlines" value="${code}" ${c.airlines.includes(code)?'checked':''}>${e(name)}</label>`).join('')}</div>
      ${select('Chặng bay áp dụng','routeMode',[['all','Tất cả chặng bay'],['selected','Chọn chặng bay']],c.routeMode)}
      <div id="routeChoices"><div id="flightRoutes"></div><button type="button" id="addFlightRoute">＋ Thêm chặng</button><p class="muted">“Áp dụng cả chiều ngược lại” cho phép hành trình khởi hành từ đầu còn lại. Ví dụ SGN ↔ HAN. Điều này khác với loại vé khứ hồi.</p></div>
      </section><section><h3>2. Thời gian áp dụng</h3><div class="fields">
      ${field('Đặt vé từ','bookingStart','date',c.bookingStart,'required')}${field('Đặt vé đến','bookingEnd','date',c.bookingEnd,'required')}</div>
      ${select('Ngày bay','flightDateMode',[['all','Không giới hạn ngày bay'],['range','Chọn khoảng ngày bay']],c.flightDateMode)}
      <div id="flightDateRange" class="fields">${field('Bay từ','flightStart','date',c.flightStart)}${field('Bay đến','flightEnd','date',c.flightEnd)}</div>
      <label class="field">Ngày bay loại trừ (tùy chọn)<input type="date" id="excludeFlightDate"></label><button type="button" id="addExcludedDate">Thêm ngày loại trừ</button><div id="excludedFlightDates" class="flight-dates"></div>
      <p class="muted">Lịch đặt vé nằm trong thời gian đợt. Ngày bay có thể sau ngày kết thúc đợt; với khứ hồi, xét lượt đã chọn ở trên.</p>
      </section><section><h3>3. Giảm trực tiếp</h3><label><input type="checkbox" name="directDiscount" ${c.directDiscount?'checked':''}> Áp dụng giảm trực tiếp trên đơn vé</label>
      <p class="muted">Có thể tắt nếu đợt chỉ dùng voucher hoặc thưởng thêm xu.</p>
      <div id="flightDiscountFields">${select('Đơn vị áp dụng','discountUnit',[['booking','Theo booking'],['ticket','Theo vé']],c.discountUnit)}<div class="fields">${select('Hình thức giảm','discountType',[['amount','Giảm số tiền'],['percent','Giảm theo %']],c.discountType)}${field('Mức giảm','discount','number',c.discount||'','min="1" step="1"')}</div>
      ${field('Giá trị tối thiểu (đ, tùy chọn)','minimum','number',c.minimum||'','min="0" step="1"')}
      <label class="field" id="flightMaximum"><span id="flightMaximumLabel">Giảm tối đa mỗi booking (đ)</span><input name="maximum" type="number" min="1" step="1" value="${e(c.maximum||'')}"></label>
      <p class="muted" id="flightUnitHelp"></p><p class="muted">Tính trên tiền vé đủ điều kiện, không gồm thuế, phí và dịch vụ mua thêm.</p></div></section>
      <div id="flightConditionError" class="error" role="alert"></div><div class="actions"><button type="button" onclick="closeModal()">Hủy</button><button class="primary">Lưu điều kiện</button></div></form>`);
    const f=document.querySelector('#flightConditionForm'),error=f.querySelector('#flightConditionError');
    const fail=message=>{error.textContent=message;error.scrollIntoView({block:'nearest'})};
    const airportOptions=value=>'<option value="">Chọn sân bay</option>'+airports.map(([code,name])=>`<option value="${code}" ${value===code?'selected':''}>${e(name)}</option>`).join('');
    const drawRoutes=()=>{
      f.querySelector('#flightRoutes').innerHTML=routes.map((r,i)=>`<div class="flight-route"><div class="fields"><label class="field">Điểm đi<select data-from="${i}">${airportOptions(r.from)}</select></label><label class="field">Điểm đến<select data-to="${i}">${airportOptions(r.to)}</select></label></div><label><input type="checkbox" data-reverse="${i}" ${r.reverse?'checked':''}> Áp dụng cả chiều ngược lại</label> <button type="button" data-remove-route="${i}">Xóa chặng</button></div>`).join('');
      f.querySelectorAll('[data-from]').forEach(input=>input.onchange=()=>routes[+input.dataset.from].from=input.value);
      f.querySelectorAll('[data-to]').forEach(input=>input.onchange=()=>routes[+input.dataset.to].to=input.value);
      f.querySelectorAll('[data-reverse]').forEach(input=>input.onchange=()=>routes[+input.dataset.reverse].reverse=input.checked);
      f.querySelectorAll('[data-remove-route]').forEach(button=>button.onclick=()=>{routes.splice(+button.dataset.removeRoute,1);drawRoutes()});
    };
    const drawDates=()=>{
      f.querySelector('#excludedFlightDates').innerHTML=[...excluded].sort().map(value=>`<button type="button" data-remove-date="${value}" aria-label="Bỏ ngày ${date(value)}">${date(value)} ×</button>`).join('')||'<span class="muted">Chưa loại trừ ngày nào.</span>';
      f.querySelectorAll('[data-remove-date]').forEach(button=>button.onclick=()=>{excluded.delete(button.dataset.removeDate);drawDates()});
    };
    f.querySelector('#addFlightRoute').onclick=()=>{routes.push({from:'',to:'',reverse:false});drawRoutes()};
    f.querySelector('#addExcludedDate').onclick=()=>{const input=f.querySelector('#excludeFlightDate');if(!input.value)return fail('Chọn ngày bay cần loại trừ.');excluded.add(input.value);input.value='';error.textContent='';drawDates()};
    const toggle=()=>{
      f.querySelector('#roundtripFields').hidden=f.journey.value==='oneway';
      f.querySelector('#airlineChoices').hidden=f.airlineMode.value==='all';
      f.querySelector('#routeChoices').hidden=f.routeMode.value==='all';
      f.querySelector('#flightDateRange').hidden=f.flightDateMode.value==='all';
      f.flightStart.required=f.flightEnd.required=f.flightDateMode.value==='range';
      f.flightStart.disabled=f.flightEnd.disabled=f.flightDateMode.value==='all';
      const discount=f.directDiscount.checked,percent=f.discountType.value==='percent',ticket=f.discountUnit.value==='ticket';
      f.discount.closest('label').firstChild.textContent=percent?'Tỷ lệ giảm (%)':'Số tiền giảm (đ/'+(ticket?'vé':'booking')+')';
      f.minimum.closest('label').firstChild.textContent=ticket?'Tiền vé tối thiểu mỗi vé (đ, tùy chọn)':'Tổng tiền vé tối thiểu của booking (đ, tùy chọn)';
      f.querySelector('#flightMaximumLabel').textContent='Giảm tối đa mỗi '+(ticket?'vé':'booking')+' (đ, bắt buộc)';
      f.querySelector('#flightUnitHelp').textContent=ticket?'Tính riêng từng vé đủ điều kiện rồi cộng lại. Một vé là hành trình của một hành khách; khứ hồi và nối chuyến không nhân thêm lần giảm.':'Tính giảm một lần cho toàn booking, không nhân theo số hành khách hoặc lượt bay.';
      f.discount.max=percent?'99':'';
      f.discountUnit.disabled=!discount;
      f.querySelector('#flightDiscountFields').hidden=!discount;f.discount.required=discount;
      f.querySelector('#flightMaximum').hidden=!percent;f.maximum.required=discount&&percent;
      f.discount.disabled=f.minimum.disabled=f.discountType.disabled=!discount;f.maximum.disabled=!discount||!percent;
    };
    for(const name of ['journey','airlineMode','routeMode','flightDateMode','directDiscount','discountType','discountUnit'])f.elements[name].onchange=toggle;
    drawRoutes();drawDates();toggle();
    f.onsubmit=event=>{
      event.preventDefault();
      const fd=new FormData(f),direct=f.directDiscount.checked;
      const next={scope:c.scope,discountUnit:f.discountUnit.value,journey:f.journey.value,roundtripCheck:f.journey.value==='oneway'?'outbound':f.roundtripCheck.value,airlineMode:f.airlineMode.value,airlines:f.airlineMode.value==='selected'?fd.getAll('airlines'):[],routeMode:f.routeMode.value,routes:f.routeMode.value==='selected'?routes:[],bookingStart:f.bookingStart.value,bookingEnd:f.bookingEnd.value,flightDateMode:f.flightDateMode.value,flightStart:f.flightDateMode.value==='range'?f.flightStart.value:'',flightEnd:f.flightDateMode.value==='range'?f.flightEnd.value:'',excludedDates:[...excluded].sort(),directDiscount:direct,discountType:direct?f.discountType.value:'amount',discount:direct?Number(f.discount.value):0,minimum:direct?Number(f.minimum.value||0):0,maximum:direct&&f.discountType.value==='percent'?Number(f.maximum.value):null};
      const message=validate(next,p);if(message)return fail(message);
      T.update(data=>{data.programs.find(item=>item.id===p.id).flightConditions=next},'Lưu điều kiện VMB '+p.name);
      closeModal();programDetail();
    };
  };
  const priorDetail=programDetail;
  programDetail=function(){
    priorDetail();const p=targetProgram();if(p?.serviceType!=='flight'||!p.flightConditions)return;
    const panel=[...document.querySelectorAll('#app section.card')].find(el=>el.querySelector('h2')?.textContent==='Điều kiện chương trình tiếp thị vé máy bay');if(!panel)return;
    const c=normalize(p.flightConditions,p);
    [...panel.children].filter(el=>!el.classList.contains('row')).forEach(el=>el.remove());
    panel.insertAdjacentHTML('beforeend',`<p><b>Hành trình:</b> ${e(journeys[c.journey])} · ${e(scopes[c.scope])}${c.journey!=='oneway'?` · Khứ hồi xét ${c.roundtripCheck==='both'?'cả hai lượt':'lượt đi'}`:''}</p><p><b>Hãng bay:</b> ${c.airlineMode==='all'?'Tất cả':e(c.airlines.map(code=>airlines.find(item=>item[0]===code)?.[1]||code).join(', '))}</p><p><b>Chặng bay:</b> ${c.routeMode==='all'?'Tất cả':e(c.routes.map(r=>r.from+(r.reverse?' ↔ ':' → ')+r.to).join('; '))}</p><p><b>Đặt vé:</b> ${date(c.bookingStart)} – ${date(c.bookingEnd)} · <b>Ngày bay:</b> ${c.flightDateMode==='all'?'Không giới hạn':date(c.flightStart)+' – '+date(c.flightEnd)}</p>${c.excludedDates.length?`<p><b>Ngày bay loại trừ:</b> ${c.excludedDates.map(date).join(', ')}</p>`:''}<p><b>Giảm trực tiếp:</b> ${!c.directDiscount?'Không áp dụng':c.discountType==='percent'?`${money(c.discount)}% · tối đa ${money(c.maximum)}đ / ${c.discountUnit==='ticket'?'vé':'booking'}`:`${money(c.discount)}đ / ${c.discountUnit==='ticket'?'vé':'booking'}`}${c.directDiscount?` · ${c.discountUnit==='ticket'?'Tiền vé tối thiểu/vé':'Tổng tiền vé tối thiểu/booking'}: ${c.minimum?money(c.minimum)+'đ':'Không yêu cầu'}`:''}</p>`);
  };
  const priorAction=programAction;
  programAction=function(status){const p=targetProgram();if(status==='Đang mở'&&p?.serviceType==='flight'&&p.flightConditions){const problem=validate(normalize(p.flightConditions,p),p);if(problem){toast(problem);return}}priorAction(status)};
  if(location.hash==='#program')programDetail();
})();
